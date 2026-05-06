"use client";

import { useState } from "react";

interface AttackResult {
  ok: boolean;
  rateLimited?: boolean;
  retryInMs?: number;
  message?: string;
  network?: string;
  signature?: string;
  explorerUrl?: string;
  reverted?: boolean;
  error?: { code: number; name: string | null; rawLine: string | null } | null;
  amount?: string;
  source?: string;
  destination?: string;
  mint?: string;
  programId?: string;
  logTail?: string[];
}

const PROGRAM_ID = "7vJ2fa6dr3Tnx8whNAepUMmpytAnEZxcASMyH2jAuG7v";
const SAMPLE_MINT = "2KkYRVS2cBnneryveAYxH5hGfnNhdFruXAc4NjeAekcZ";

export default function Home() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<AttackResult | null>(null);

  async function runAttack() {
    setPending(true);
    setResult(null);
    try {
      const res = await fetch("/api/run-attack", { method: "POST" });
      const json = (await res.json()) as AttackResult;
      setResult(json);
    } catch (e: unknown) {
      setResult({ ok: false, message: e instanceof Error ? e.message : String(e) });
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#FAFAF7] selection:bg-[#FF6B35] selection:text-black">
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="border-b border-white/10 px-6 pt-16 pb-20 sm:pt-24 sm:pb-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-white/50">
            <span className="inline-block h-1 w-6 bg-[#FF6B35]" />
            DEVNET · LIVE
          </div>
          <h1 className="font-black tracking-tight text-5xl leading-[1.05] sm:text-7xl">
            Onleash
          </h1>
          <div className="mt-3 h-1 w-24 bg-[#FF6B35]" />
          <p className="mt-8 max-w-2xl text-2xl font-bold leading-tight sm:text-4xl">
            Agents unleashed.{" "}
            <span className="text-[#FF6B35]">Wallets on leash.</span>
          </p>
          <p className="mt-6 max-w-2xl text-base text-white/70 sm:text-lg">
            Token-2022 transfer hook for AI agent wallets. Spending policy
            enforced at the mint layer, not in middleware. A jailbroken agent
            can sign anything — the chain refuses to clear it.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={runAttack}
              disabled={pending}
              className="group inline-flex items-center justify-center gap-3 border-2 border-[#FF6B35] bg-[#FF6B35] px-7 py-4 font-mono text-sm font-bold uppercase tracking-[0.18em] text-black transition-all hover:bg-transparent hover:text-[#FF6B35] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? (
                <>
                  <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-current" />
                  submitting…
                </>
              ) : (
                <>Run attack on devnet →</>
              )}
            </button>
            <a
              href="https://github.com/amalia020/onleash"
              target="_blank"
              rel="noreferrer"
              className="font-mono text-sm uppercase tracking-[0.18em] text-white/60 underline-offset-4 hover:text-[#FAFAF7] hover:underline"
            >
              github
            </a>
          </div>

          {/* Result panel */}
          {result && <ResultPanel result={result} />}
        </div>
      </section>

      {/* ─── THE PROBLEM ─────────────────────────────────────────── */}
      <section className="border-b border-white/10 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
            the problem
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-black sm:text-5xl">
            AI agents have wallets. They&apos;re getting drained.
          </h2>
          <div className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {INCIDENTS.map((i) => (
              <article
                key={i.title}
                className="bg-[#0A0A0A] p-6 transition-colors hover:bg-white/[0.03]"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#FF6B35]">
                  {i.date}
                </div>
                <div className="mt-2 text-3xl font-black">{i.amount}</div>
                <div className="mt-3 text-sm font-bold">{i.title}</div>
                <p className="mt-2 text-xs leading-relaxed text-white/60">
                  {i.summary}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────────────────── */}
      <section className="border-b border-white/10 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
            how it works
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-black sm:text-5xl">
            Policy lives in the token, not the wallet.
          </h2>
          <p className="mt-6 max-w-2xl text-base text-white/70 sm:text-lg">
            Solana&apos;s Token-2022 transfer-hook extension lets a mint specify
            a program that runs on every transfer. Onleash is that program.
            Three checks; any failure reverts the entire atomic transaction.
          </p>

          <div className="mt-12 grid gap-px bg-white/10 lg:grid-cols-3">
            {CHECKS.map((c, i) => (
              <article key={c.title} className="bg-[#0A0A0A] p-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#FF6B35]">
                  Check {i + 1}
                </div>
                <div className="mt-3 text-base font-bold">{c.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {c.summary}
                </p>
                <div className="mt-4 font-mono text-[11px] text-white/40">
                  Error code <span className="text-[#FF6B35]">{c.code}</span>
                </div>
              </article>
            ))}
          </div>

          {/* Code snippet */}
          <div className="mt-16">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
              integration · 5 lines
            </p>
            <pre className="mt-4 overflow-x-auto border-2 border-white/15 bg-black p-6 text-xs leading-relaxed sm:text-sm">
              <code className="font-mono">
                <span className="text-white/40">// pnpm add @onleash/sdk</span>
                {"\n"}
                <span className="text-[#FF6B35]">import</span> {"{ "}OnleashClient{" }"}{" "}
                <span className="text-[#FF6B35]">from</span>{" "}
                <span className="text-emerald-400">&quot;@onleash/sdk&quot;</span>;
                {"\n"}
                {"\n"}
                <span className="text-[#FF6B35]">const</span> client ={" "}
                <span className="text-[#FF6B35]">new</span> OnleashClient(connection,
                wallet);{"\n"}
                <span className="text-[#FF6B35]">await</span>{" "}
                client.deployProtectedMint({"{"}
                {"\n  "}decimals: <span className="text-amber-300">6</span>,{"\n  "}
                perTxMax: <span className="text-amber-300">10n * 1_000_000n</span>,
                {"\n  "}dailyCap: <span className="text-amber-300">50n * 1_000_000n</span>
                ,{"\n  "}allowlist: [approvedPoolATA],{"\n"}
                {"}"});
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* ─── ON-CHAIN ARTIFACTS ─────────────────────────────────── */}
      <section className="border-b border-white/10 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
            on-chain · devnet
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-black sm:text-5xl">
            Verifiable, right now.
          </h2>
          <div className="mt-10 grid gap-3">
            <ChainRow
              label="Program"
              value={PROGRAM_ID}
              href={`https://explorer.solana.com/address/${PROGRAM_ID}?cluster=devnet`}
            />
            <ChainRow
              label="Sample protected mint"
              value={SAMPLE_MINT}
              href={`https://explorer.solana.com/address/${SAMPLE_MINT}?cluster=devnet`}
            />
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────── */}
      <footer className="px-6 py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black">onleash</span>
            <span className="h-[2px] w-6 bg-[#FF6B35]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
              MIT · open source
            </span>
          </div>
          <a
            href="https://github.com/amalia020/onleash"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs uppercase tracking-[0.2em] text-white/50 hover:text-[#FAFAF7]"
          >
            github.com/amalia020/onleash
          </a>
        </div>
      </footer>
    </main>
  );
}

// ─── Subcomponents ──────────────────────────────────────────────

function ResultPanel({ result }: { result: AttackResult }) {
  if (!result.ok && result.rateLimited) {
    return (
      <div className="mt-8 border-2 border-amber-500/40 bg-amber-500/5 p-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-400">
          rate-limited
        </div>
        <p className="mt-2 text-sm text-white/80">{result.message}</p>
      </div>
    );
  }
  if (!result.ok) {
    return (
      <div className="mt-8 border-2 border-red-500/40 bg-red-500/5 p-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-400">
          server error
        </div>
        <p className="mt-2 text-sm text-white/80">{result.message}</p>
      </div>
    );
  }
  if (result.reverted) {
    return (
      <div className="mt-8 border-2 border-[#FF6B35] bg-[#FF6B35]/5 p-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#FF6B35]">
          ✓ transaction rejected on chain · attack blocked
        </div>
        <div className="mt-3 text-2xl font-black">
          {result.error?.name ?? "Reverted"}{" "}
          <span className="text-[#FF6B35]">
            ({result.error?.code ?? "?"})
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          We submitted a real Token-2022 transfer of{" "}
          <span className="font-mono text-white">1 token</span> from a source
          ATA to a destination NOT on the policy allowlist. Solana&apos;s
          Token-2022 program ran the Onleash hook program on chain. The hook
          rejected the transfer atomically — funds preserved.
        </p>
        <div className="mt-4 grid gap-2 font-mono text-xs">
          <KV k="signature" v={result.signature ?? ""} />
          <KV k="destination" v={result.destination ?? ""} />
          <KV k="program" v={result.programId ?? ""} />
        </div>
        {result.explorerUrl && (
          <a
            href={result.explorerUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 border border-[#FF6B35] px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-black"
          >
            view on explorer →
          </a>
        )}
      </div>
    );
  }
  // Unexpected: tx succeeded (shouldn't happen in this demo)
  return (
    <div className="mt-8 border-2 border-emerald-500/40 bg-emerald-500/5 p-6">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400">
        unexpected · tx confirmed
      </div>
      <p className="mt-2 text-sm text-white/80">
        Transfer succeeded — this should not happen in the demo. Check the
        attacker ATA hasn&apos;t been added to the allowlist.
      </p>
      {result.explorerUrl && (
        <a
          href={result.explorerUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block font-mono text-xs underline"
        >
          {result.signature?.slice(0, 16)}… on explorer
        </a>
      )}
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 text-white/70">
      <span className="text-white/40">{k}</span>
      <span className="break-all text-white/90">{v}</span>
    </div>
  );
}

function ChainRow({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group grid gap-2 border border-white/10 p-4 transition-colors hover:border-[#FF6B35]/40 hover:bg-white/[0.02] sm:grid-cols-[200px_1fr_auto] sm:items-center sm:gap-6"
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
        {label}
      </span>
      <span className="break-all font-mono text-xs text-white/90 sm:text-sm">{value}</span>
      <span className="font-mono text-xs text-[#FF6B35] opacity-60 group-hover:opacity-100">
        explorer →
      </span>
    </a>
  );
}

const INCIDENTS = [
  {
    date: "Nov 22, 2024",
    amount: "$47K",
    title: "Freysa Act I",
    summary: "User redefined approveTransfer via prompt injection.",
  },
  {
    date: "Mar 18, 2025",
    amount: "$106K",
    title: "aixbt × Simulacrum",
    summary: "Pipeline injection via operator dashboard.",
  },
  {
    date: "Mar 2025",
    amount: "mainnet",
    title: "ElizaOS × Princeton",
    summary: "Memory injection, real ETH drained on mainnet.",
  },
  {
    date: "Apr 2026",
    amount: "$500K",
    title: "LLM router drain",
    summary: "9 of 428 routers silently replaced recipients.",
  },
];

const CHECKS = [
  {
    title: "Destination allowlist",
    summary:
      "Up to 8 approved destination token accounts per mint. Anything else, the chain rejects.",
    code: 6001,
  },
  {
    title: "Per-tx maximum",
    summary:
      "Hard ceiling on a single transfer amount. No oversized exfiltration.",
    code: 6002,
  },
  {
    title: "Daily cap (24h rolling)",
    summary:
      "Cumulative limit per rolling window. Self-resets after 24h on the next transfer.",
    code: 6003,
  },
];
