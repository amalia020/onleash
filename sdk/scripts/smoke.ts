/**
 * SDK smoke test — drives @onleash/sdk against the deployed devnet program.
 *
 * Run from repo root with the deployer keypair on devnet:
 *   pnpm --filter @onleash/sdk smoke
 *
 * Expected output: 1 success transfer + 1 expected revert with explorer links.
 */
import {
  AnchorProvider,
  Wallet,
} from "@coral-xyz/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

import { OnleashClient } from "../src/index";

const DEVNET = "https://api.devnet.solana.com";
const DECIMALS = 6;
const UNIT = 1_000_000n; // 10^6
const PER_TX_MAX = 10n * UNIT;
const DAILY_CAP = 50n * UNIT;

function explorer(sig: string): string {
  return `https://explorer.solana.com/tx/${sig}?cluster=devnet`;
}

async function main(): Promise<void> {
  const keypairPath =
    process.env.SOLANA_KEYPAIR ?? path.join(os.homedir(), ".config/solana/id.json");
  const secret = JSON.parse(fs.readFileSync(keypairPath, "utf8"));
  const payer = Keypair.fromSecretKey(Uint8Array.from(secret));
  const wallet = new Wallet(payer);
  const conn = new Connection(DEVNET, "confirmed");

  console.log("deployer:", payer.publicKey.toBase58());
  const balance = await conn.getBalance(payer.publicKey);
  console.log("balance:", balance / 1e9, "SOL");
  if (balance < 0.5 * 1e9) {
    throw new Error("deployer needs >= 0.5 SOL on devnet");
  }

  const client = new OnleashClient(conn, wallet);

  // Generate two fresh recipient wallets — one allowed, one attacker
  const allowedOwner = Keypair.generate();
  const attackerOwner = Keypair.generate();

  // We need the allowed destination ATA address up front so we can put it on the
  // allowlist when deploying the mint. The mint isn't created yet — we pre-compute
  // the mint pubkey too.
  const mintKp = Keypair.generate();
  const allowedDestAta = getAssociatedTokenAddressSync(
    mintKp.publicKey,
    allowedOwner.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );
  const attackerDestAta = getAssociatedTokenAddressSync(
    mintKp.publicKey,
    attackerOwner.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );

  console.log("\n[1] deployProtectedMint…");
  const deploy = await client.deployProtectedMint({
    decimals: DECIMALS,
    perTxMax: PER_TX_MAX,
    dailyCap: DAILY_CAP,
    allowlist: [allowedDestAta],
    mintKeypair: mintKp,
  });
  console.log("    mint:    ", deploy.mint.toBase58());
  console.log("    policy:  ", deploy.policy.toBase58());
  console.log("    metaList:", deploy.metaList.toBase58());
  console.log("    txs:");
  console.log("      createMint   ", explorer(deploy.signatures.createMint));
  console.log("      initMetaList ", explorer(deploy.signatures.initMetaList));
  console.log("      initPolicy   ", explorer(deploy.signatures.initPolicy));

  console.log("\n[2] mintTo deployer (100 tokens)…");
  const mintTo = await client.mintTo({
    mint: deploy.mint,
    destinationOwner: payer.publicKey,
    amount: 100n * UNIT,
  });
  const sourceAta = mintTo.destination;
  console.log("    sourceAta:", sourceAta.toBase58());
  console.log("    tx:       ", explorer(mintTo.signature));

  console.log("\n[3] create allowed + attacker destination ATAs…");
  const createAtas = new Transaction().add(
    createAssociatedTokenAccountInstruction(
      payer.publicKey,
      allowedDestAta,
      allowedOwner.publicKey,
      deploy.mint,
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    ),
    createAssociatedTokenAccountInstruction(
      payer.publicKey,
      attackerDestAta,
      attackerOwner.publicKey,
      deploy.mint,
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    ),
  );
  const ataSig = await sendAndConfirmTransaction(conn, createAtas, [payer]);
  console.log("    tx:", explorer(ataSig));

  console.log("\n[4] HAPPY: transfer 5 tokens → allowedDestAta (in allowlist)…");
  const ok = await client.transfer({
    mint: deploy.mint,
    source: sourceAta,
    destination: allowedDestAta,
    owner: payer,
    amount: 5n * UNIT,
    decimals: DECIMALS,
  });
  console.log("    ✅ SUCCESS:", explorer(ok.signature));

  console.log("\n[5] ATTACK: transfer 1 token → attackerDestAta (NOT in allowlist)…");
  let attackerErr: any = null;
  try {
    await client.transfer({
      mint: deploy.mint,
      source: sourceAta,
      destination: attackerDestAta,
      owner: payer,
      amount: 1n * UNIT,
      decimals: DECIMALS,
    });
    throw new Error("EXPECTED REVERT BUT TRANSFER SUCCEEDED");
  } catch (e: any) {
    attackerErr = e;
    const msg = (e.transactionLogs || e.logs || [e.message]).join(" ");
    if (/DestinationNotAllowed|0x1771|6001/.test(msg)) {
      console.log("    ✅ REVERTED as expected (DestinationNotAllowed 6001)");
    } else {
      console.log("    ⚠️  reverted but with unexpected error:", msg.slice(0, 200));
    }
  }

  console.log("\n[6] read on-chain Policy…");
  const policy = await client.fetchPolicy(deploy.mint);
  console.log("    perTxMax:        ", policy.perTxMax.toString());
  console.log("    dailyCap:        ", policy.dailyCap.toString());
  console.log("    spentToday:      ", policy.spentToday.toString());
  console.log("    allowlist:       ", policy.destinationAllowlist.map((p: PublicKey) => p.toBase58()));

  console.log("\n=== ONLEASH SDK SMOKE TEST: COMPLETE ===");
  console.log("program ID:", client.programId.toBase58());
  console.log("mint:      ", deploy.mint.toBase58());
  if (!attackerErr) {
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error("smoke test failed:", e);
  process.exit(1);
});
