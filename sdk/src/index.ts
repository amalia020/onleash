/**
 * @onleash/sdk — Token-2022 transfer-hook policy for AI agent wallets.
 *
 * Public surface:
 *   - OnleashClient   ─ Anchor-backed client (deploy mint, init/update policy, transfer)
 *   - PolicyAccount   ─ on-chain policy state
 *   - ONLEASH_PROGRAM_ID, policyPda, metaListPda
 *   - createOnleashActions  ─ Zod-schema'd actions for solana-agent-kit
 */

export {
  OnleashClient,
  ONLEASH_PROGRAM_ID,
  policyPda,
  metaListPda,
  POLICY_SEED,
  META_LIST_SEED,
  type PolicyAccount,
  type DeployProtectedMintParams,
  type DeployProtectedMintResult,
} from "./client";

export { createOnleashActions } from "./actions";
