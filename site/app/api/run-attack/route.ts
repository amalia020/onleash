/**
 * POST /api/run-attack
 *
 * Submits a real Token-2022 transfer to the deployed Onleash hook program on
 * devnet/mainnet. The destination is a fixed "attacker" ATA that is NOT in the
 * mint's policy allowlist, so the on-chain hook always rejects with
 * `DestinationNotAllowed` (error code 6001) and the entire transfer reverts
 * atomically.
 *
 * Returns a real Solana Explorer link to the failed tx — proof that the
 * mechanism works on a real network, not a simulation.
 *
 * Rate-limited: 1 request per IP per 30 seconds (in-memory; resets on cold
 * start). Sufficient for a demo; replace with a real limiter for production.
 */
import {
  createTransferCheckedWithTransferHookInstruction,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Connection,
  Transaction,
} from "@solana/web3.js";
import { NextResponse } from "next/server";

import { explorerTxUrl, getServerConfig } from "@/lib/onleash-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ─── In-memory rate limit (best effort; resets on cold start) ────────────
const ipLastHit = new Map<string, number>();
const RL_WINDOW_MS = 30_000;

function rateLimit(req: Request): { allowed: boolean; retryInMs: number } {
  const ip =
    (req.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const last = ipLastHit.get(ip) ?? 0;
  const now = Date.now();
  if (now - last < RL_WINDOW_MS) {
    return { allowed: false, retryInMs: RL_WINDOW_MS - (now - last) };
  }
  ipLastHit.set(ip, now);
  // garbage-collect stale entries
  if (ipLastHit.size > 1000) {
    for (const [k, v] of ipLastHit) {
      if (now - v > RL_WINDOW_MS * 4) ipLastHit.delete(k);
    }
  }
  return { allowed: true, retryInMs: 0 };
}

// ─── Parse the on-chain reject reason from tx logs ───────────────────────
const ERROR_NAMES: Record<number, string> = {
  6000: "NotTransferring",
  6001: "DestinationNotAllowed",
  6002: "ExceedsPerTxMax",
  6003: "ExceedsDailyCap",
  6004: "AllowlistTooLong",
  6005: "Unauthorized",
  6006: "Overflow",
};

function parseErrorFromLogs(logs: string[] | null | undefined): {
  code: number | null;
  name: string | null;
  rawLine: string | null;
} {
  if (!logs) return { code: null, name: null, rawLine: null };
  for (const line of logs) {
    // Anchor logs custom errors as: "Program log: AnchorError ... Error Code: ... Error Number: 6001"
    // or sometimes: "Program log: Error Number: 6001"
    const m1 = line.match(/Error Number:\s*(\d+)/);
    if (m1) {
      const code = Number.parseInt(m1[1]!, 10);
      return { code, name: ERROR_NAMES[code] ?? null, rawLine: line };
    }
    // Or via raw `0x` custom error: "Program ... failed: custom program error: 0x1771"
    const m2 = line.match(/custom program error:\s*0x([0-9a-fA-F]+)/);
    if (m2) {
      const code = Number.parseInt(m2[1]!, 16);
      return { code, name: ERROR_NAMES[code] ?? null, rawLine: line };
    }
  }
  return { code: null, name: null, rawLine: null };
}

export async function POST(req: Request): Promise<Response> {
  const rl = rateLimit(req);
  if (!rl.allowed) {
    return NextResponse.json(
      {
        ok: false,
        rateLimited: true,
        retryInMs: rl.retryInMs,
        message: `Slow down — try again in ${Math.ceil(rl.retryInMs / 1000)}s.`,
      },
      { status: 429 },
    );
  }

  let cfg;
  try {
    cfg = getServerConfig();
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "config", message: e?.message ?? String(e) },
      { status: 500 },
    );
  }

  const conn = new Connection(cfg.rpcUrl, "confirmed");

  // Build the attack transfer: 1 token to a NON-allowlisted destination.
  // The transfer-hook will reject this on-chain with DestinationNotAllowed.
  const amount = 1n * BigInt(10 ** cfg.decimals);

  let ix;
  try {
    ix = await createTransferCheckedWithTransferHookInstruction(
      conn,
      cfg.sourceAta,
      cfg.mint,
      cfg.attackerAta,
      cfg.payer.publicKey,
      amount,
      cfg.decimals,
      [],
      "confirmed",
      TOKEN_2022_PROGRAM_ID,
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "build_ix", message: e?.message ?? String(e) },
      { status: 500 },
    );
  }

  const tx = new Transaction().add(ix);
  tx.feePayer = cfg.payer.publicKey;
  const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash("confirmed");
  tx.recentBlockhash = blockhash;
  tx.lastValidBlockHeight = lastValidBlockHeight;
  tx.sign(cfg.payer);

  // Submit with skipPreflight so the failed tx LANDS on chain and gets a real
  // signature. Without this the RPC's preflight simulator would catch the
  // revert and refuse to broadcast — which is exactly the wrong demo behavior.
  let signature: string;
  try {
    signature = await conn.sendRawTransaction(tx.serialize(), {
      skipPreflight: true,
      maxRetries: 3,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "send", message: e?.message ?? String(e) },
      { status: 502 },
    );
  }

  // Confirm and pull logs. We expect the tx to fail (revert) — that's the demo.
  let logs: string[] = [];
  let err: unknown = null;
  try {
    const result = await conn.confirmTransaction(
      { signature, blockhash, lastValidBlockHeight },
      "confirmed",
    );
    err = result.value.err ?? null;
  } catch {
    /* ignore — fetch logs anyway below */
  }
  try {
    const status = await conn.getTransaction(signature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    });
    logs = status?.meta?.logMessages ?? [];
    if (err == null && status?.meta?.err) err = status.meta.err;
  } catch {
    /* ignore */
  }

  const reverted = err != null;
  const parsed = parseErrorFromLogs(logs);

  return NextResponse.json({
    ok: true,
    network: cfg.network,
    signature,
    explorerUrl: explorerTxUrl(signature),
    reverted,
    error: parsed.code
      ? {
          code: parsed.code,
          name: parsed.name,
          rawLine: parsed.rawLine,
        }
      : null,
    rawErr: err ? JSON.stringify(err) : null,
    amount: amount.toString(),
    mint: cfg.mint.toBase58(),
    source: cfg.sourceAta.toBase58(),
    destination: cfg.attackerAta.toBase58(),
    programId: cfg.programId.toBase58(),
    logTail: logs.slice(-10),
  });
}
