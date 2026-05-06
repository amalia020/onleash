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
    #[msg("Policy is paused — all transfers halted by authority")]
    PolicyPaused,
    #[msg("Cooldown active — minimum interval between transfers not elapsed")]
    CooldownActive,
    #[msg("Daily transfer count limit reached")]
    ExceedsTransferCount,
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
        cooldown_secs: i64,
        max_transfers_per_day: u32,
    ) -> Result<()> {
        require!(allowlist.len() <= MAX_ALLOWLIST, OnleashError::AllowlistTooLong);
        require!(cooldown_secs >= 0, OnleashError::Overflow);
        let policy = &mut ctx.accounts.policy;
        policy.authority = ctx.accounts.authority.key();
        policy.mint = ctx.accounts.mint.key();
        policy.per_tx_max = per_tx_max;
        policy.daily_cap = daily_cap;
        policy.day_start_unix = Clock::get()?.unix_timestamp;
        policy.spent_today = 0;
        policy.transfers_today = 0;
        policy.destination_allowlist = allowlist;
        policy.paused = false;
        policy.cooldown_secs = cooldown_secs;
        policy.last_transfer_unix = 0;
        policy.max_transfers_per_day = max_transfers_per_day;
        Ok(())
    }

    pub fn update_policy(
        ctx: Context<UpdatePolicy>,
        per_tx_max: Option<u64>,
        daily_cap: Option<u64>,
        allowlist: Option<Vec<Pubkey>>,
        paused: Option<bool>,
        cooldown_secs: Option<i64>,
        max_transfers_per_day: Option<u32>,
    ) -> Result<()> {
        let policy = &mut ctx.accounts.policy;
        require_keys_eq!(
            policy.authority,
            ctx.accounts.authority.key(),
            OnleashError::Unauthorized
        );
        if let Some(v) = per_tx_max { policy.per_tx_max = v; }
        if let Some(v) = daily_cap { policy.daily_cap = v; }
        if let Some(v) = allowlist {
            require!(v.len() <= MAX_ALLOWLIST, OnleashError::AllowlistTooLong);
            policy.destination_allowlist = v;
        }
        if let Some(v) = paused { policy.paused = v; }
        if let Some(v) = cooldown_secs {
            require!(v >= 0, OnleashError::Overflow);
            policy.cooldown_secs = v;
        }
        if let Some(v) = max_transfers_per_day { policy.max_transfers_per_day = v; }
        Ok(())
    }

    #[instruction(discriminator = ExecuteInstruction::SPL_DISCRIMINATOR_SLICE)]
    pub fn transfer_hook(ctx: Context<TransferHook>, amount: u64) -> Result<()> {
        check_is_transferring(&ctx)?;

        let policy = &mut ctx.accounts.policy;
        let now = Clock::get()?.unix_timestamp;

        // Roll the daily window if 24h has elapsed
        if now.saturating_sub(policy.day_start_unix) >= ONE_DAY_SECONDS {
            policy.day_start_unix = now;
            policy.spent_today = 0;
            policy.transfers_today = 0;
        }

        // Check 1: Pause — emergency stop, authority can freeze all transfers
        require!(!policy.paused, OnleashError::PolicyPaused);

        // Check 2: Destination allowlist
        require!(
            policy.destination_allowlist.contains(&ctx.accounts.destination_token.key()),
            OnleashError::DestinationNotAllowed
        );

        // Check 3: Per-tx cap
        require!(amount <= policy.per_tx_max, OnleashError::ExceedsPerTxMax);

        // Check 4: Daily spend cap
        let new_total = policy
            .spent_today
            .checked_add(amount)
            .ok_or(OnleashError::Overflow)?;
        require!(new_total <= policy.daily_cap, OnleashError::ExceedsDailyCap);

        // Check 5: Cooldown — minimum time between transfers (0 = disabled)
        if policy.cooldown_secs > 0 {
            require!(
                now.saturating_sub(policy.last_transfer_unix) >= policy.cooldown_secs,
                OnleashError::CooldownActive
            );
        }

        // Check 6: Daily transfer count (0 = disabled)
        if policy.max_transfers_per_day > 0 {
            require!(
                policy.transfers_today < policy.max_transfers_per_day,
                OnleashError::ExceedsTransferCount
            );
        }

        // All checks passed — commit state mutations
        policy.spent_today = new_total;
        policy.last_transfer_unix = now;
        policy.transfers_today = policy.transfers_today
            .checked_add(1)
            .ok_or(OnleashError::Overflow)?;

        msg!(
            "onleash: ok amount={} spent_today={} transfers_today={} cooldown_remaining={}s",
            amount,
            policy.spent_today,
            policy.transfers_today,
            if policy.cooldown_secs > 0 {
                policy.cooldown_secs.saturating_sub(now.saturating_sub(policy.last_transfer_unix))
            } else { 0 }
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

// ─── Account contexts ────────────────────────────────────────────────────────

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
        // 8 disc + 32 + 32 + 8 + 8 + 8 + 8 + (4+32*8) + 1 + 8 + 8 + 4 + 4 = ~395 → pad to 450
        space = 450,
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
    // ── Spend limits ──────────────────────────────────────────────────────
    pub per_tx_max: u64,
    pub daily_cap: u64,
    pub day_start_unix: i64,
    pub spent_today: u64,
    // ── Destination control ───────────────────────────────────────────────
    pub destination_allowlist: Vec<Pubkey>,     // max 8
    // ── Advanced controls ─────────────────────────────────────────────────
    pub paused: bool,                           // emergency stop
    pub cooldown_secs: i64,                     // min seconds between transfers (0 = disabled)
    pub last_transfer_unix: i64,                // timestamp of last successful transfer
    pub max_transfers_per_day: u32,             // max transfers per 24h window (0 = disabled)
    pub transfers_today: u32,                   // transfer count in current window
}
