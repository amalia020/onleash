import type { Program } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createInitializeTransferHookInstruction,
  createMintToInstruction,
  createTransferCheckedWithTransferHookInstruction,
  ExtensionType,
  getAssociatedTokenAddressSync,
  getMintLen,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import { assert, expect } from "chai";
import type { OnleashHook } from "../target/types/onleash_hook";

describe("onleash-hook", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.OnleashHook as Program<OnleashHook>;
  const wallet = provider.wallet as anchor.Wallet;
  const connection = provider.connection;

  // Mint with the transfer hook extension
  const mint = new Keypair();
  const decimals = 6; // 6 dp like USDC

  // Source = our wallet (acts as the "agent wallet" in the demo)
  const sourceTokenAccount = getAssociatedTokenAddressSync(
    mint.publicKey,
    wallet.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );

  // Destination 1 (allowlisted) = the "approved pool"
  const allowedRecipient = Keypair.generate();
  const allowedDest = getAssociatedTokenAddressSync(
    mint.publicKey,
    allowedRecipient.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );

  // Destination 2 (NOT allowlisted) = the "attacker"
  const attackerRecipient = Keypair.generate();
  const attackerDest = getAssociatedTokenAddressSync(
    mint.publicKey,
    attackerRecipient.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );

  // Policy values for these tests
  const PER_TX_MAX = 10n * 10n ** BigInt(decimals); // 10 tokens
  const DAILY_CAP = 50n * 10n ** BigInt(decimals); // 50 tokens
  const TOTAL_MINT = 1_000n * 10n ** BigInt(decimals); // 1000 tokens minted

  // Policy PDA
  const [policyPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("policy"), mint.publicKey.toBuffer()],
    program.programId,
  );

  it("creates mint with transfer-hook extension", async () => {
    const extensions = [ExtensionType.TransferHook];
    const mintLen = getMintLen(extensions);
    const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

    const tx = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mint.publicKey,
        space: mintLen,
        lamports,
        programId: TOKEN_2022_PROGRAM_ID,
      }),
      createInitializeTransferHookInstruction(
        mint.publicKey,
        wallet.publicKey,
        program.programId,
        TOKEN_2022_PROGRAM_ID,
      ),
      createInitializeMintInstruction(
        mint.publicKey,
        decimals,
        wallet.publicKey,
        null,
        TOKEN_2022_PROGRAM_ID,
      ),
    );

    const sig = await sendAndConfirmTransaction(connection, tx, [wallet.payer, mint]);
    console.log("  mint created:", sig);
  });

  it("creates source + 2 destination ATAs and mints supply to source", async () => {
    const tx = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        sourceTokenAccount,
        wallet.publicKey,
        mint.publicKey,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      ),
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        allowedDest,
        allowedRecipient.publicKey,
        mint.publicKey,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      ),
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        attackerDest,
        attackerRecipient.publicKey,
        mint.publicKey,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      ),
      createMintToInstruction(
        mint.publicKey,
        sourceTokenAccount,
        wallet.publicKey,
        TOTAL_MINT,
        [],
        TOKEN_2022_PROGRAM_ID,
      ),
    );

    const sig = await sendAndConfirmTransaction(connection, tx, [wallet.payer], {
      skipPreflight: true,
    });
    console.log("  ATAs + mintTo:", sig);
  });

  it("initializes ExtraAccountMetaList", async () => {
    const ix = await program.methods
      .initializeExtraAccountMetaList()
      .accounts({
        mint: mint.publicKey,
      } as any)
      .instruction();

    const tx = new Transaction().add(ix);
    const sig = await sendAndConfirmTransaction(connection, tx, [wallet.payer], {
      skipPreflight: true,
      commitment: "confirmed",
    });
    console.log("  meta list:", sig);
  });

  it("initializes Policy with allowlist=[allowedDest], per_tx=10, daily=50", async () => {
    const sig = await program.methods
      .initPolicy(
        new anchor.BN(PER_TX_MAX.toString()),
        new anchor.BN(DAILY_CAP.toString()),
        [allowedDest],
      )
      .accounts({
        authority: wallet.publicKey,
        mint: mint.publicKey,
      } as any)
      .rpc({ commitment: "confirmed" });
    console.log("  init_policy:", sig);

    const policy = await program.account.policy.fetch(policyPda);
    expect(policy.authority.toBase58()).to.eq(wallet.publicKey.toBase58());
    expect(policy.mint.toBase58()).to.eq(mint.publicKey.toBase58());
    expect(policy.perTxMax.toString()).to.eq(PER_TX_MAX.toString());
    expect(policy.dailyCap.toString()).to.eq(DAILY_CAP.toString());
    expect(policy.spentToday.toString()).to.eq("0");
    expect(policy.destinationAllowlist.length).to.eq(1);
    expect(policy.destinationAllowlist[0].toBase58()).to.eq(allowedDest.toBase58());
  });

  // ─── Happy path ──────────────────────────────────────────────────────────

  it("PASS: transfers 5 tokens to allowlisted destination", async () => {
    const amount = 5n * 10n ** BigInt(decimals);
    const ix = await createTransferCheckedWithTransferHookInstruction(
      connection,
      sourceTokenAccount,
      mint.publicKey,
      allowedDest,
      wallet.publicKey,
      amount,
      decimals,
      [],
      "confirmed",
      TOKEN_2022_PROGRAM_ID,
    );
    const tx = new Transaction().add(ix);
    const sig = await sendAndConfirmTransaction(connection, tx, [wallet.payer]);
    console.log("  pass-transfer:", sig);

    const policy = await program.account.policy.fetch(policyPda);
    expect(policy.spentToday.toString()).to.eq(amount.toString());
  });

  // ─── Negative: destination not allowlisted ───────────────────────────────

  it("FAIL: transfer to attacker dest reverts (DestinationNotAllowed 6001)", async () => {
    const amount = 1n * 10n ** BigInt(decimals);
    const ix = await createTransferCheckedWithTransferHookInstruction(
      connection,
      sourceTokenAccount,
      mint.publicKey,
      attackerDest,
      wallet.publicKey,
      amount,
      decimals,
      [],
      "confirmed",
      TOKEN_2022_PROGRAM_ID,
    );
    const tx = new Transaction().add(ix);

    let threw = false;
    try {
      await sendAndConfirmTransaction(connection, tx, [wallet.payer]);
    } catch (e: any) {
      threw = true;
      const msg = (e.transactionLogs || e.logs || [e.message]).join(" ");
      console.log("  reverted as expected (DestinationNotAllowed)");
      assert.match(msg, /DestinationNotAllowed|0x1771|6001/);
    }
    assert.isTrue(threw, "expected transfer to attacker to revert");
  });

  // ─── Negative: per-tx cap ────────────────────────────────────────────────

  it("FAIL: transfer 20 (> per_tx_max=10) reverts (ExceedsPerTxMax 6002)", async () => {
    const amount = 20n * 10n ** BigInt(decimals);
    const ix = await createTransferCheckedWithTransferHookInstruction(
      connection,
      sourceTokenAccount,
      mint.publicKey,
      allowedDest,
      wallet.publicKey,
      amount,
      decimals,
      [],
      "confirmed",
      TOKEN_2022_PROGRAM_ID,
    );
    const tx = new Transaction().add(ix);

    let threw = false;
    try {
      await sendAndConfirmTransaction(connection, tx, [wallet.payer]);
    } catch (e: any) {
      threw = true;
      const msg = (e.transactionLogs || e.logs || [e.message]).join(" ");
      console.log("  reverted as expected (ExceedsPerTxMax)");
      assert.match(msg, /ExceedsPerTxMax|0x1772|6002/);
    }
    assert.isTrue(threw, "expected per-tx-cap violation to revert");
  });

  // ─── Negative: daily cap ─────────────────────────────────────────────────

  it("FAIL: 4 more 10-token transfers + 1 more reverts (ExceedsDailyCap 6003)", async () => {
    // Already spent 5 (from happy path). Transfer 10 four more times → 5+40=45.
    // Daily cap is 50. The 5th 10-token transfer would push to 55 → revert.
    const ten = 10n * 10n ** BigInt(decimals);

    for (let i = 0; i < 4; i++) {
      const ix = await createTransferCheckedWithTransferHookInstruction(
        connection,
        sourceTokenAccount,
        mint.publicKey,
        allowedDest,
        wallet.publicKey,
        ten,
        decimals,
        [],
        "confirmed",
        TOKEN_2022_PROGRAM_ID,
      );
      const tx = new Transaction().add(ix);
      await sendAndConfirmTransaction(connection, tx, [wallet.payer]);
    }
    let policy = await program.account.policy.fetch(policyPda);
    expect(policy.spentToday.toString()).to.eq((5n * 10n ** BigInt(decimals) + 4n * ten).toString());

    // Now the next 10-token transfer pushes spent_today over daily_cap → revert
    const overIx = await createTransferCheckedWithTransferHookInstruction(
      connection,
      sourceTokenAccount,
      mint.publicKey,
      allowedDest,
      wallet.publicKey,
      ten,
      decimals,
      [],
      "confirmed",
      TOKEN_2022_PROGRAM_ID,
    );
    const overTx = new Transaction().add(overIx);
    let threw = false;
    try {
      await sendAndConfirmTransaction(connection, overTx, [wallet.payer]);
    } catch (e: any) {
      threw = true;
      const msg = (e.transactionLogs || e.logs || [e.message]).join(" ");
      console.log("  reverted as expected (ExceedsDailyCap)");
      assert.match(msg, /ExceedsDailyCap|0x1773|6003/);
    }
    assert.isTrue(threw, "expected daily-cap violation to revert");
  });

  // ─── Auth: only authority can update_policy ──────────────────────────────

  it("FAIL: non-authority cannot update_policy (Unauthorized 6005)", async () => {
    const stranger = Keypair.generate();
    // fund the stranger so they can sign
    const fundTx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: stranger.publicKey,
        lamports: 10_000_000,
      }),
    );
    await sendAndConfirmTransaction(connection, fundTx, [wallet.payer]);

    let threw = false;
    try {
      await program.methods
        .updatePolicy(new anchor.BN("1"), null, null)
        .accounts({
          authority: stranger.publicKey,
          mint: mint.publicKey,
        } as any)
        .signers([stranger])
        .rpc();
    } catch (e: any) {
      threw = true;
      console.log("  reverted as expected (Unauthorized)");
      assert.match(String(e.message || e.toString()), /Unauthorized|0x1775|6005/);
    }
    assert.isTrue(threw, "expected non-authority update to revert");
  });

  // ─── Authority can update ────────────────────────────────────────────────

  it("PASS: authority can raise daily_cap via update_policy", async () => {
    const newDaily = new anchor.BN((100n * 10n ** BigInt(decimals)).toString());
    await program.methods
      .updatePolicy(null, newDaily, null)
      .accounts({
        authority: wallet.publicKey,
        mint: mint.publicKey,
      } as any)
      .rpc();
    const policy = await program.account.policy.fetch(policyPda);
    expect(policy.dailyCap.toString()).to.eq(newDaily.toString());
  });
});
