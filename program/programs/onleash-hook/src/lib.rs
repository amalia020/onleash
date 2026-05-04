use std::cell::RefMut;

use anchor_lang::prelude::*;
use anchor_spl::{
    token_2022::spl_token_2022::{
        extension::{
            transfer_hook::TransferHookAccount, BaseStateWithExtensionsMut,
            PodStateWithExtensionsMut,
        },
        pod::PodAccount,
    },
    token_interface::{Mint, TokenAccount},
};
use spl_tlv_account_resolution::{
    account::ExtraAccountMeta, seeds::Seed, state::ExtraAccountMetaList,
};
use spl_discriminator::SplDiscriminate;
use spl_transfer_hook_interface::instruction::{
    ExecuteInstruction, InitializeExtraAccountMetaListInstruction,
};

declare_id!("7vJ2fa6dr3Tnx8whNAepUMmpytAnEZxcASMyH2jAuG7v");

const ONE_DAY_SECONDS: i64 = 86_400;
const MAX_ALLOWLIST: usize = 8;

#[error_code]
pub enum OnleashError {
    #[msg("Token is not in a transfer context")]
    NotTransferring,
    #[msg("Destination not in allowlist")]
    DestinationNotAllowed,
    #[msg("Amount exceeds per-tx maximum")]
    ExceedsPerTxMax,
    #[msg("Amount exceeds daily cap")]
    ExceedsDailyCap,
    #[msg("Allowlist exceeds 8 entries")]
    AllowlistTooLong,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Math overflow")]
    Overflow,
}

#[program]
pub mod onleash_hook {
    use super::*;

    #[instruction(discriminator = InitializeExtraAccountMetaListInstruction::SPL_DISCRIMINATOR_SLICE)]
    pub fn initialize_extra_account_meta_list(
        ctx: Context<InitializeExtraAccountMetaList>,
    ) -> Result<()> {
        let extra_account_metas = InitializeExtraAccountMetaList::extra_account_metas()?;
        ExtraAccountMetaList::init::<ExecuteInstruction>(
            &mut ctx.accounts.extra_account_meta_list.try_borrow_mut_data()?,
            &extra_account_metas,
        )
        .map_err(|_| ProgramError::InvalidAccountData)?;
        Ok(())
    }

    pub fn init_policy(
        ctx: Context<InitPolicy>,
        per_tx_max: u64,
        daily_cap: u64,
        allowlist: Vec<Pubkey>,
    ) -> Result<()> {
        require!(allowlist.len() <= MAX_ALLOWLIST, OnleashError::AllowlistTooLong);
        let policy = &mut ctx.accounts.policy;
        policy.authority = ctx.accounts.authority.key();
        policy.mint = ctx.accounts.mint.key();
        policy.per_tx_max = per_tx_max;
        policy.daily_cap = daily_cap;
        policy.day_start_unix = Clock::get()?.unix_timestamp;
        policy.spent_today = 0;
        policy.destination_allowlist = allowlist;
        Ok(())
    }

    pub fn update_policy(
        ctx: Context<UpdatePolicy>,
        per_tx_max: Option<u64>,
        daily_cap: Option<u64>,
        allowlist: Option<Vec<Pubkey>>,
    ) -> Result<()> {
        let policy = &mut ctx.accounts.policy;
        require_keys_eq!(
            policy.authority,
            ctx.accounts.authority.key(),
            OnleashError::Unauthorized
        );
        if let Some(v) = per_tx_max {
            policy.per_tx_max = v;
        }
        if let Some(v) = daily_cap {
            policy.daily_cap = v;
        }
        if let Some(v) = allowlist {
            require!(v.len() <= MAX_ALLOWLIST, OnleashError::AllowlistTooLong);
            policy.destination_allowlist = v;
        }
        Ok(())
    }

    #[instruction(discriminator = ExecuteInstruction::SPL_DISCRIMINATOR_SLICE)]
    pub fn transfer_hook(ctx: Context<TransferHook>, amount: u64) -> Result<()> {
        check_is_transferring(&ctx)?;

        let policy = &mut ctx.accounts.policy;

        // 1. Destination allowlist
        require!(
            policy
                .destination_allowlist
                .contains(&ctx.accounts.destination_token.key()),
            OnleashError::DestinationNotAllowed
        );

        // 2. Per-tx cap
        require!(amount <= policy.per_tx_max, OnleashError::ExceedsPerTxMax);

        // 3. Daily cap with rolling 24-hour window
        let now = Clock::get()?.unix_timestamp;
        if now.saturating_sub(policy.day_start_unix) >= ONE_DAY_SECONDS {
            policy.day_start_unix = now;
            policy.spent_today = 0;
        }
        let new_total = policy
            .spent_today
            .checked_add(amount)
            .ok_or(OnleashError::Overflow)?;
        require!(new_total <= policy.daily_cap, OnleashError::ExceedsDailyCap);
        policy.spent_today = new_total;

        msg!(
            "onleash: ok amount={} spent_today={} daily_cap={}",
            amount,
            policy.spent_today,
            policy.daily_cap
        );

        Ok(())
    }
}

fn check_is_transferring(ctx: &Context<TransferHook>) -> Result<()> {
    let source_token_info = ctx.accounts.source_token.to_account_info();
    let mut account_data_ref: RefMut<&mut [u8]> = source_token_info.try_borrow_mut_data()?;
    let mut account = PodStateWithExtensionsMut::<PodAccount>::unpack(*account_data_ref)
        .map_err(|_| ProgramError::InvalidAccountData)?;
    let account_extension = account
        .get_extension_mut::<TransferHookAccount>()
        .map_err(|_| ProgramError::InvalidAccountData)?;

    if !bool::from(account_extension.transferring) {
        return err!(OnleashError::NotTransferring);
    }
    Ok(())
}

#[derive(Accounts)]
pub struct InitializeExtraAccountMetaList<'info> {
    #[account(mut)]
    payer: Signer<'info>,

    /// CHECK: ExtraAccountMetaList Account, validated by token-2022.
    #[account(
        init,
        seeds = [b"extra-account-metas", mint.key().as_ref()],
        bump,
        space = ExtraAccountMetaList::size_of(
            InitializeExtraAccountMetaList::extra_account_metas_count()
        ).unwrap(),
        payer = payer
    )]
    pub extra_account_meta_list: UncheckedAccount<'info>,
    pub mint: InterfaceAccount<'info, Mint>,
    pub system_program: Program<'info, System>,
}

impl<'info> InitializeExtraAccountMetaList<'info> {
    pub fn extra_account_metas() -> Result<Vec<ExtraAccountMeta>> {
        // Tell token-2022 to pass the per-mint Policy PDA on every transfer.
        // AccountKey index 1 = mint (per ExecuteInstruction account ordering).
        Ok(vec![ExtraAccountMeta::new_with_seeds(
            &[
                Seed::Literal { bytes: b"policy".to_vec() },
                Seed::AccountKey { index: 1 },
            ],
            false,
            true,
        )
        .map_err(|_| ProgramError::InvalidArgument)?])
    }

    pub fn extra_account_metas_count() -> usize {
        1
    }
}

#[derive(Accounts)]
pub struct InitPolicy<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(
        init,
        seeds = [b"policy", mint.key().as_ref()],
        bump,
        // 8 disc + 32 + 32 + 8 + 8 + 8 + 8 + (4 + 32*8) = 364, pad to 400
        space = 400,
        payer = authority,
    )]
    pub policy: Account<'info, Policy>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdatePolicy<'info> {
    pub authority: Signer<'info>,
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(mut, seeds = [b"policy", mint.key().as_ref()], bump)]
    pub policy: Account<'info, Policy>,
}

#[derive(Accounts)]
pub struct TransferHook<'info> {
    #[account(token::mint = mint, token::authority = owner)]
    pub source_token: InterfaceAccount<'info, TokenAccount>,
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(token::mint = mint)]
    pub destination_token: InterfaceAccount<'info, TokenAccount>,
    /// CHECK: source token account owner.
    pub owner: UncheckedAccount<'info>,
    /// CHECK: ExtraAccountMetaList — validated by seeds + token-2022.
    #[account(seeds = [b"extra-account-metas", mint.key().as_ref()], bump)]
    pub extra_account_meta_list: UncheckedAccount<'info>,
    #[account(mut, seeds = [b"policy", mint.key().as_ref()], bump)]
    pub policy: Account<'info, Policy>,
}

#[account]
pub struct Policy {
    pub authority: Pubkey,
    pub mint: Pubkey,
    pub per_tx_max: u64,
    pub daily_cap: u64,
    pub day_start_unix: i64,
    pub spent_today: u64,
    pub destination_allowlist: Vec<Pubkey>,
}
