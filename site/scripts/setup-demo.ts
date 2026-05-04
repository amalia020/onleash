/**
 * One-time setup for the demo site:
 *   1. Generate a fixed "attacker" keypair (printed; persisted to env vars)
 *   2. Create its ATA on the existing protected mint (from smoke test)
 *   3. Print the env var block to paste into Vercel
 *
 * Re-running is idempotent (skips ATA creation if it already exists).
 */
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

const DEVNET = "https://api.devnet.solana.com";
const ONLEASH_PROGRAM_ID = "7vJ2fa6dr3Tnx8whNAepUMmpytAnEZxcASMyH2jAuG7v";
const DEMO_MINT = "2KkYRVS2cBnneryveAYxH5hGfnNhdFruXAc4NjeAekcZ"; // from smoke test

async function main(): Promise<void> {
  const keypairPath =
    process.env.SOLANA_KEYPAIR ?? path.join(os.homedir(), ".config/solana/id.json");
  const secret = JSON.parse(fs.readFileSync(keypairPath, "utf8"));
  const payer = Keypair.fromSecretKey(Uint8Array.from(secret));
  const conn = new Connection(DEVNET, "confirmed");

  console.log("payer:", payer.publicKey.toBase58());
  const balance = await conn.getBalance(payer.publicKey);
  console.log("balance:", balance / 1e9, "SOL");

  const mint = new PublicKey(DEMO_MINT);

  // Source ATA (deployer's ATA on the demo mint — already funded with tokens from smoke test)
  const sourceAta = getAssociatedTokenAddressSync(
    mint,
    payer.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );
  console.log("sourceAta:", sourceAta.toBase58());

  // Attacker keypair — deterministic for this demo by writing it to disk if missing
  const attackerKeyPath = path.join(os.homedir(), ".onleash-demo-attacker.json");
  let attacker: Keypair;
  if (fs.existsSync(attackerKeyPath)) {
    const raw = JSON.parse(fs.readFileSync(attackerKeyPath, "utf8"));
    attacker = Keypair.fromSecretKey(Uint8Array.from(raw));
    console.log("attacker (existing):", attacker.publicKey.toBase58());
  } else {
    attacker = Keypair.generate();
    fs.writeFileSync(attackerKeyPath, JSON.stringify(Array.from(attacker.secretKey)));
    console.log("attacker (new):", attacker.publicKey.toBase58());
    console.log("  saved to:", attackerKeyPath);
  }

  // Attacker ATA on the demo mint
  const attackerAta = getAssociatedTokenAddressSync(
    mint,
    attacker.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );
  console.log("attackerAta:", attackerAta.toBase58());

  const existing = await conn.getAccountInfo(attackerAta);
  if (!existing) {
    console.log("creating attacker ATA…");
    const tx = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        payer.publicKey,
        attackerAta,
        attacker.publicKey,
        mint,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      ),
    );
    const sig = await sendAndConfirmTransaction(conn, tx, [payer]);
    console.log("  tx:", `https://explorer.solana.com/tx/${sig}?cluster=devnet`);
  } else {
    console.log("attacker ATA already exists ✓");
  }

  console.log("\n=== ENV VARS (paste into .env.local for dev, Vercel dashboard for prod) ===");
  console.log("ONLEASH_RPC_URL=" + DEVNET);
  console.log("ONLEASH_NETWORK=devnet");
  console.log("ONLEASH_PROGRAM_ID=" + ONLEASH_PROGRAM_ID);
  console.log("ONLEASH_MINT=" + DEMO_MINT);
  console.log("ONLEASH_SOURCE_ATA=" + sourceAta.toBase58());
  console.log("ONLEASH_ATTACKER_ATA=" + attackerAta.toBase58());
  console.log("ONLEASH_PAYER_SECRET=" + JSON.stringify(Array.from(payer.secretKey)));
  console.log("ONLEASH_DECIMALS=6");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
