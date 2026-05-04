---
noteId: "7685bd2047cd11f19fe9dd518d27468c"
tags: []

---

# Onleash

> **Token-2022 transfer hook for AI agent wallets.** Spending policy enforced at the mint layer, not in middleware. A jailbroken agent can sign anything — the chain refuses to clear it.

[![Devnet](https://img.shields.io/badge/devnet-deployed-success)](https://explorer.solana.com/address/7vJ2fa6dr3Tnx8whNAepUMmpytAnEZxcASMyH2jAuG7v?cluster=devnet)
[![Tests](https://img.shields.io/badge/tests-10%2F10%20passing-success)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()

```ts
import { OnleashClient } from "@onleash/sdk";

const client = new OnleashClient(connection, wallet);
await client.deployProtectedMint({
  decimals: 6,
  perTxMax: 10_000_000n,        // 10 tokens per transfer
  dailyCap: 50_000_000n,         // 50 tokens per 24h rolling window
  allowlist: [approvedPoolATA],  // up to 8 approved destinations
});
```

That's it. Every subsequent transfer of this mint goes through the on-chain hook, which validates against the policy. Violations revert the entire transaction atomically.

---

## Why

AI agents that hold real wallets are getting drained. Freysa Act I ($47K, Nov 2024). aixbt × Simulacrum ($106K, Mar 2025). ElizaOS × Princeton (mainnet ETH drained, Mar 2025). LLM router replacement attack ($500K, Apr 2026).

Existing defenses — Turnkey, Privy, Coinbase AgentKit, Lit, Squads — all enforce policy at the **wallet** or **signer** layer. Middleware gets bypassed. Once the agent has a key, it can sign anything.

Onleash moves the policy into the **token itself**, via Solana's Token-2022 transfer hook extension. The chain runs the hook on every transfer; the agent doesn't get a vote.

> _Signer-layer policy trusts the agent. Asset-layer policy doesn't have to._

---

## Architecture

```
Agent wallet ──signs transfer──► Token-2022 program ──CPI──► Onleash hook program
                                                               │
                                                               ├─ load Policy PDA (seeds: ["policy", mint])
                                                               ├─ check: amount ≤ per_tx_max
                                                               ├─ check: spent_today + amount ≤ daily_cap (24h rolling)
                                                               ├─ check: destination ∈ allowlist (up to 8)
                                                               └─ ok → return; violation → revert
```

The hook is invoked on `Transfer`, `TransferChecked`, and `TransferCheckedWithFee`. See [§ Honest scope](#honest-scope) for what it does *not* cover.

---

## On-chain artifacts

| | Devnet | Mainnet |
|---|---|---|
| **Program ID** | [`7vJ2fa6dr3Tnx8whNAepUMmpytAnEZxcASMyH2jAuG7v`](https://explorer.solana.com/address/7vJ2fa6dr3Tnx8whNAepUMmpytAnEZxcASMyH2jAuG7v?cluster=devnet) | _pending_ |
| **Sample protected mint** | [`2KkYRVS2cBnneryveAYxH5hGfnNhdFruXAc4NjeAekcZ`](https://explorer.solana.com/address/2KkYRVS2cBnneryveAYxH5hGfnNhdFruXAc4NjeAekcZ?cluster=devnet) | _pending_ |
| **Live revert demo** | [DestinationNotAllowed tx](https://explorer.solana.com/tx/17S5zBJmeFQMift4aBSGG7TkF4UCnfWz5k7H2FeGfcmeNkYYG3ZZfPf9Hz2nFA5RMwLjWHdYuzynTepKmnPGyna?cluster=devnet) (the happy-path success) | _pending_ |

---

## Repo layout

```
onleash/
├── program/    Anchor program (Rust)        — the transfer hook
├── sdk/        @onleash/sdk (TypeScript)    — client + AI agent actions
├── site/       Next.js demo (TBD)            — public live-attack site
└── README.md
```

`program/` is a Cargo workspace. `sdk/` is a pnpm workspace package. `site/` (when added) joins the pnpm workspace.

---

## Quickstart (consume the SDK)

```bash
pnpm add @onleash/sdk @solana/web3.js @solana/spl-token
```

```ts
import { Connection, Keypair } from "@solana/web3.js";
import { Wallet } from "@coral-xyz/anchor";
import { OnleashClient } from "@onleash/sdk";

const conn = new Connection("https://api.devnet.solana.com", "confirmed");
const wallet = new Wallet(payer); // your Keypair
const client = new OnleashClient(conn, wallet);

// 1. Deploy a protected mint with policy
const { mint, signatures } = await client.deployProtectedMint({
  decimals: 6,
  perTxMax: 10n * 1_000_000n,
  dailyCap: 50n * 1_000_000n,
  allowlist: [approvedPoolATA],
});

// 2. Mint supply to your wallet
await client.mintTo({ mint, destinationOwner: payer.publicKey, amount: 100n * 1_000_000n });

// 3. Send a transfer — the hook validates before settling
await client.transfer({ mint, source, destination: approvedPoolATA, owner: payer, amount: 5n * 1_000_000n, decimals: 6 });

// 4. Read on-chain policy state
const policy = await client.fetchPolicy(mint);
```

`createOnleashActions(client)` returns four Zod-schema'd actions ready to drop into solana-agent-kit, Vercel AI SDK, or LangChain tool arrays.

---

## Build from source

```bash
git clone https://github.com/amalia020/onleash.git
cd onleash
pnpm install

# Program (Rust / Anchor)
cd program
anchor build
anchor test --provider.cluster devnet --skip-local-validator

# SDK (TypeScript)
cd ../sdk
pnpm build
SOLANA_KEYPAIR=~/.config/solana/id.json pnpm smoke   # runs against devnet
```

Requirements: Rust 1.79+, Solana CLI 3.1+, Anchor 1.0.2, Node 22+, pnpm 9+.

---

## Test results (devnet, 10/10 passing)

```
onleash-hook
  ✔ creates mint with transfer-hook extension                    (728ms)
  ✔ creates source + 2 destination ATAs and mints supply         (711ms)
  ✔ initializes ExtraAccountMetaList                             (518ms)
  ✔ initializes Policy with allowlist=[allowedDest], per_tx=10, daily=50
  ✔ PASS: transfers 5 tokens to allowlisted destination          (909ms)
  ✔ FAIL: transfer to attacker dest reverts (DestinationNotAllowed 6001)
  ✔ FAIL: transfer 20 (> per_tx_max=10) reverts (ExceedsPerTxMax 6002)
  ✔ FAIL: 4 more 10-token transfers + 1 more reverts (ExceedsDailyCap 6003)
  ✔ FAIL: non-authority cannot update_policy (Unauthorized 6005)
  ✔ PASS: authority can raise daily_cap via update_policy

10 passing (8s)
```

---

## Policy schema

| Field | Type | Notes |
|---|---|---|
| `authority` | Pubkey | Only this key can call `update_policy` |
| `mint` | Pubkey | Bound at init — policy PDA is per-mint |
| `per_tx_max` | u64 | Per-single-transfer cap, raw units |
| `daily_cap` | u64 | Per 24h rolling window cap, raw units |
| `day_start_unix` | i64 | Window anchor (auto-rolls when ≥86400s elapsed) |
| `spent_today` | u64 | Mutated atomically inside the hook |
| `destination_allowlist` | Vec\<Pubkey\> | Up to 8 approved destination token accounts |

Policy PDA seeds: `[b"policy", mint.key().as_ref()]`.

## Error codes

| Code | Name | Meaning |
|---|---|---|
| `6000` | `NotTransferring` | Hook called outside a transfer context |
| `6001` | `DestinationNotAllowed` | Destination ATA not in `destination_allowlist` |
| `6002` | `ExceedsPerTxMax` | `amount > per_tx_max` |
| `6003` | `ExceedsDailyCap` | `spent_today + amount > daily_cap` |
| `6004` | `AllowlistTooLong` | Tried to set >8 entries |
| `6005` | `Unauthorized` | Non-authority called `update_policy` |
| `6006` | `Overflow` | u64 overflow in `spent_today` math |

---

## Honest scope

The hook fires on, and only on:

- ✅ `Transfer`
- ✅ `TransferChecked`
- ✅ `TransferCheckedWithFee`
- ✅ CPI transfers (DEX, vaults, programs)
- ✅ Delegate-initiated transfers

It does **not** fire on:

- ❌ `MintTo`, `Burn`
- ❌ `Approve`, `Revoke`
- ❌ `CloseAccount`, `FreezeAccount`
- ❌ Native SOL transfers
- ❌ Legacy SPL-Token (only Token-2022 mints)

Roadmap will pair the hook with companion guards (permanent-delegate, policy-gated burn, close-account guard) to close the adjacent gaps. Today, **Onleash is a policy primitive for Token-2022 mints, not a drop-in security wrapper for every existing wallet.**

---

## Roadmap

- [x] Hook program with 3 checks (allowlist, per-tx, daily cap)
- [x] Per-mint Policy PDA
- [x] init / update_policy admin instructions
- [x] TypeScript SDK with deploy / mint / transfer / fetch
- [x] Zod-schema'd actions for AI agent frameworks
- [x] Devnet deploy + 10/10 tests passing
- [ ] Mainnet deploy
- [ ] Public live-attack demo site
- [ ] Companion guards (permanent-delegate, burn-policy, close-guard)
- [ ] solana-agent-kit upstream PR
- [ ] DEX compatibility matrix (Orca whirlpools first)

---

## Acknowledgements

The Anchor program is forked from [solana-developers/program-examples](https://github.com/solana-developers/program-examples/tree/main/tokens/token-2022/transfer-hook/whitelist/anchor) (the whitelist transfer-hook variant). The `ExtraAccountMetaList` setup and `transfer-hook-interface` discriminator wiring are kept verbatim from that audited reference; only the policy logic is original.

## License

MIT.
