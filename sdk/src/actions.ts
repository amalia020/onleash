import { PublicKey } from "@solana/web3.js";
import { z } from "zod";

import { OnleashClient } from "./client";

/**
 * Zod-schema'd actions intended for use as AI-agent tools (Vercel AI SDK,
 * LangChain, OpenAI Tools, solana-agent-kit Plugin). Each action has:
 *   - name        ─ stable id
 *   - description ─ for LLM tool selection
 *   - schema      ─ Zod schema for input validation
 *   - handler     ─ async function executed by the framework
 *
 * The shape mirrors solana-agent-kit's `Action` interface so that consumers can
 * pass these straight into `createVercelAITools(agent, [...createOnleashActions(client)])`.
 */
export interface OnleashAction {
  name: string;
  description: string;
  schema: z.ZodType<any>;
  handler: (input: any) => Promise<unknown>;
}

const pubkey = z
  .string()
  .min(32)
  .max(64)
  .describe("Base58-encoded Solana public key");

const u64 = z
  .union([z.string(), z.number()])
  .transform((v) => BigInt(v))
  .describe("Unsigned 64-bit integer (raw token units, NOT human decimals)");

export function createOnleashActions(client: OnleashClient): OnleashAction[] {
  const deployProtectedMintAction: OnleashAction = {
    name: "onleash_deploy_protected_mint",
    description:
      "Create a new Token-2022 mint with the Onleash transfer hook attached and " +
      "initialize its on-chain Policy. Returns the mint address, policy PDA, and " +
      "transaction signatures. Use when spinning up a new policy-protected token " +
      "for an AI agent. Caller (wallet) becomes mint authority and policy authority.",
    schema: z.object({
      decimals: z.number().int().min(0).max(9).describe("Mint decimals (0–9)"),
      perTxMax: u64.describe(
        "Maximum amount per single transfer in raw units (e.g. 10_000_000 = 10 tokens at 6 dp)",
      ),
      dailyCap: u64.describe("Maximum cumulative spend per 24h window in raw units"),
      allowlist: z
        .array(pubkey)
        .max(8)
        .describe("Up to 8 destination token-account pubkeys allowed to receive transfers"),
    }),
    handler: async (input) => {
      const result = await client.deployProtectedMint({
        decimals: input.decimals,
        perTxMax: input.perTxMax,
        dailyCap: input.dailyCap,
        allowlist: input.allowlist.map((s: string) => new PublicKey(s)),
      });
      return {
        mint: result.mint.toBase58(),
        policy: result.policy.toBase58(),
        metaList: result.metaList.toBase58(),
        signatures: result.signatures,
      };
    },
  } as OnleashAction;

  const updatePolicyAction: OnleashAction = {
    name: "onleash_update_policy",
    description:
      "Update an existing Onleash Policy. Pass null/omit a field to leave it " +
      "unchanged. Only the policy authority can call this (revert otherwise). " +
      "Use to raise/lower caps or rotate the destination allowlist.",
    schema: z.object({
      mint: pubkey.describe("Mint address whose policy should be updated"),
      perTxMax: u64.optional().describe("New per-tx max, or omit to leave unchanged"),
      dailyCap: u64.optional().describe("New daily cap, or omit to leave unchanged"),
      allowlist: z
        .array(pubkey)
        .max(8)
        .optional()
        .describe("New full allowlist, or omit to leave unchanged"),
    }),
    handler: async (input) => {
      const ix = await client.ixUpdatePolicy({
        authority: client.wallet.publicKey,
        mint: new PublicKey(input.mint),
        perTxMax: input.perTxMax ?? null,
        dailyCap: input.dailyCap ?? null,
        allowlist: input.allowlist
          ? input.allowlist.map((s: string) => new PublicKey(s))
          : null,
      });
      const { Transaction, sendAndConfirmTransaction } = await import(
        "@solana/web3.js"
      );
      const tx = new Transaction().add(ix);
      const sig = await sendAndConfirmTransaction(
        client.connection,
        tx,
        [(client.wallet as any).payer],
      );
      return { signature: sig };
    },
  } as OnleashAction;

  const getPolicyAction: OnleashAction = {
    name: "onleash_get_policy",
    description:
      "Fetch the on-chain Policy for a given mint. Returns null if no policy " +
      "exists. Use to inspect current caps, allowlist, and today's spend.",
    schema: z.object({
      mint: pubkey.describe("Mint address whose policy to read"),
    }),
    handler: async (input) => {
      const policy = await client.tryFetchPolicy(new PublicKey(input.mint));
      if (!policy) return null;
      return {
        authority: policy.authority.toBase58(),
        mint: policy.mint.toBase58(),
        perTxMax: policy.perTxMax.toString(),
        dailyCap: policy.dailyCap.toString(),
        dayStartUnix: policy.dayStartUnix.toString(),
        spentToday: policy.spentToday.toString(),
        destinationAllowlist: policy.destinationAllowlist.map((p) => p.toBase58()),
      };
    },
  } as OnleashAction;

  const protectedTransferAction: OnleashAction = {
    name: "onleash_protected_transfer",
    description:
      "Send a Token-2022 transfer that goes through the Onleash hook. The chain " +
      "automatically validates against the destination allowlist, per-tx max, and " +
      "daily cap — any violation reverts the entire transaction atomically. Use this " +
      "instead of standard SPL transfer when sending policy-protected mints.",
    schema: z.object({
      mint: pubkey,
      source: pubkey.describe("Source token account"),
      destination: pubkey.describe("Destination token account"),
      amount: u64.describe("Raw token units to transfer"),
      decimals: z.number().int().min(0).max(9),
    }),
    handler: async (input) => {
      const result = await client.transfer({
        mint: new PublicKey(input.mint),
        source: new PublicKey(input.source),
        destination: new PublicKey(input.destination),
        owner: (client.wallet as any).payer,
        amount: input.amount,
        decimals: input.decimals,
      });
      return result;
    },
  } as OnleashAction;

  return [
    deployProtectedMintAction,
    updatePolicyAction,
    getPolicyAction,
    protectedTransferAction,
  ];
}
