import { Connection, Keypair, PublicKey } from "@solana/web3.js";

/**
 * Server-only Onleash config. Reads from env vars set by `scripts/setup-demo.ts`
 * (locally in `.env.local`, on Vercel via dashboard env vars).
 *
 * NEVER import this from a client component — it carries the deployer secret key.
 */
export interface OnleashServerConfig {
  rpcUrl: string;
  network: "devnet" | "mainnet-beta";
  programId: PublicKey;
  mint: PublicKey;
  sourceAta: PublicKey;
  attackerAta: PublicKey;
  payer: Keypair;
  decimals: number;
  explorerCluster: string;
}

let cached: OnleashServerConfig | null = null;

export function getServerConfig(): OnleashServerConfig {
  if (cached) return cached;
  const env = process.env;
  const required = [
    "ONLEASH_RPC_URL",
    "ONLEASH_PROGRAM_ID",
    "ONLEASH_MINT",
    "ONLEASH_SOURCE_ATA",
    "ONLEASH_ATTACKER_ATA",
    "ONLEASH_PAYER_SECRET",
  ] as const;
  for (const k of required) {
    if (!env[k]) {
      throw new Error(
        `[onleash/site] missing env var: ${k}. Run \`pnpm exec tsx scripts/setup-demo.ts\` and copy the output to .env.local (or Vercel dashboard).`,
      );
    }
  }
  const network = (env.ONLEASH_NETWORK as "devnet" | "mainnet-beta") ?? "devnet";
  const secret = JSON.parse(env.ONLEASH_PAYER_SECRET!) as number[];
  cached = {
    rpcUrl: env.ONLEASH_RPC_URL!,
    network,
    programId: new PublicKey(env.ONLEASH_PROGRAM_ID!),
    mint: new PublicKey(env.ONLEASH_MINT!),
    sourceAta: new PublicKey(env.ONLEASH_SOURCE_ATA!),
    attackerAta: new PublicKey(env.ONLEASH_ATTACKER_ATA!),
    payer: Keypair.fromSecretKey(Uint8Array.from(secret)),
    decimals: Number.parseInt(env.ONLEASH_DECIMALS ?? "6", 10),
    explorerCluster: network === "mainnet-beta" ? "" : `?cluster=${network}`,
  };
  return cached;
}

export function explorerTxUrl(signature: string): string {
  const cfg = getServerConfig();
  return `https://explorer.solana.com/tx/${signature}${cfg.explorerCluster}`;
}

export function explorerAddrUrl(addr: string): string {
  const cfg = getServerConfig();
  return `https://explorer.solana.com/address/${addr}${cfg.explorerCluster}`;
}
