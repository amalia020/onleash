import Link from "next/link";

const mono = "font-[family-name:var(--font-mono-family)]";
const display = "font-[family-name:var(--font-display-family)]";

export default function HowItWorks() {
  return (
    <main style={{ background: "var(--paper)", color: "var(--ink)" }}>

      {/* ── PAGE HEADER ──────────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 pt-14 pb-16">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>How it works</p>
          <h1 className={`${display} mt-4 max-w-3xl text-4xl font-black sm:text-6xl`}>
            Policy lives in the token, not the wallet.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[color:var(--ink-2)]">
            Solana&apos;s Token-2022 transfer-hook extension lets a mint specify a program
            that runs on every transfer — including CPIs from DEXes and vaults.
            Onleash is that program. Six checks run atomically — any failure reverts the entire transaction.
          </p>
        </div>
      </section>

      {/* ── 4-STEP FLOW ──────────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>execution flow</p>
          <h2 className={`${display} mt-4 text-2xl font-black sm:text-3xl`}>Every transfer runs this path.</h2>

          <div className="mt-10 hidden sm:grid sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-stretch gap-0">
            {FLOW.map((step, i) => (
              <>
                <div key={step.label} className="border-2 border-[color:var(--line)] bg-[color:var(--paper-2)] p-5 flex flex-col">
                  <div className={`${mono} text-[10px] uppercase tracking-[0.16em] text-[color:var(--brand)]`}>0{i + 1}</div>
                  <div className={`${display} mt-3 text-base font-black leading-tight`}>{step.label}</div>
                  <p className="mt-2 text-xs text-[color:var(--ink-2)] leading-relaxed flex-1">{step.desc}</p>
                </div>
                {i < FLOW.length - 1 && (
                  <div key={`arr-${i}`} className="flex items-center justify-center px-2">
                    <span className={`${mono} text-xl font-bold text-[color:var(--brand)]`}>→</span>
                  </div>
                )}
              </>
            ))}
          </div>

          {/* Mobile-only stacked flow */}
          <div className="mt-6 flex flex-col gap-0 sm:hidden">
            {FLOW.map((step, i) => (
              <div key={step.label} className="border-2 border-[color:var(--line)] bg-[color:var(--paper-2)] p-4 flex gap-4 items-start border-b-0 last:border-b-2">
                <div className="flex-shrink-0 flex flex-col items-center gap-1 pt-0.5">
                  <span className="font-[family-name:var(--font-mono-family)] text-[10px] uppercase tracking-[0.16em] text-[color:var(--brand)]">0{i + 1}</span>
                  {i < FLOW.length - 1 && <span className="text-[color:var(--brand)] text-lg leading-none mt-1">↓</span>}
                </div>
                <div>
                  <div className="font-[family-name:var(--font-display-family)] font-black text-sm leading-tight">{step.label}</div>
                  <p className="mt-1 text-xs text-[color:var(--ink-2)] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3 CHECKS ─────────────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-20 bg-[color:var(--paper-2)]">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>the six checks</p>
          <h2 className={`${display} mt-4 text-2xl font-black sm:text-3xl`}>All six must pass. Any failure reverts.</h2>
          <div className="mt-10 grid gap-0 border-2 border-[color:var(--line)] sm:grid-cols-2 lg:grid-cols-3">
            {CHECKS.map((c, i) => (
              <article key={c.title}
                className={`bg-[color:var(--paper)] p-6 flex flex-col gap-3 ${i % 3 !== 2 ? "lg:border-r-2 lg:border-[color:var(--line)]" : ""} ${i % 2 !== 0 ? "sm:border-l-2 sm:border-[color:var(--line)]" : ""} ${i > 0 ? "border-t-2 border-[color:var(--line)] sm:border-t-0" : ""}`}>
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center bg-[color:var(--brand)] text-white text-sm font-bold flex-shrink-0">{i + 1}</span>
                  <div className={`${display} font-black text-base`}>{c.title}</div>
                </div>
                <p className="text-sm leading-relaxed text-[color:var(--ink-2)]">{c.desc}</p>
                <div className={`${mono} text-[11px] text-[color:var(--ink-3)] mt-auto`}>
                  error <span className="text-[color:var(--brand)]">{c.code}</span> · {c.name}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── SIGNER VS ASSET ──────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>the thesis</p>
          <h2 className={`${display} mt-4 max-w-3xl text-3xl font-black sm:text-4xl`}>
            Signer-gates verify the agent didn&apos;t get jailbroken.<br />
            Asset-gates work even if it did.
          </h2>
          <div className="mt-10 grid gap-0 border-2 border-[color:var(--line)] sm:grid-cols-2">
            <div className="bg-[color:var(--paper)] p-8">
              <div className={`${mono} mb-4 text-[10px] uppercase tracking-[0.2em] text-[color:var(--ink-3)]`}>other solutions · signer layer</div>
              <ul className="space-y-3 text-sm text-[color:var(--ink-2)]">
                {["Hand-rolled middleware — agents can ignore it","Squads multisig — kills agent autonomy","Privy / Turnkey custody — off-chain, revocable by issuer","Stripe / Brex — opaque, fiat-only, no Solana","All bypass-able via OWASP LLM01 prompt injection"].map(t=>(
                  <li key={t} className="flex items-start gap-2"><span className="text-[color:var(--danger)] mt-0.5 flex-shrink-0">✗</span>{t}</li>
                ))}
              </ul>
            </div>
            <div className="bg-[color:var(--paper-2)] p-8 border-t-2 border-[color:var(--line)] sm:border-t-0 sm:border-l-2 sm:border-[color:var(--brand)]">
              <div className={`${mono} mb-4 text-[10px] uppercase tracking-[0.2em] text-[color:var(--brand)]`}>onleash · asset layer</div>
              <ul className="space-y-3 text-sm text-[color:var(--ink-2)]">
                {["Policy is sealed inside the mint — not in the agent","Enforced by Solana's Token-2022 program, not your code","Fires on every transfer including CPI (DEXes, vaults)","Jailbroken agent can sign — the chain still refuses","Atomic revert — no partial transfers, no race conditions"].map(t=>(
                  <li key={t} className="flex items-start gap-2"><span className="text-[color:var(--success)] mt-0.5 flex-shrink-0">✓</span>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY SOLANA ───────────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-20 bg-[color:var(--paper-2)]">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>why solana</p>
          <h2 className={`${display} mt-4 text-2xl font-black sm:text-3xl`}>The primitive only exists here.</h2>
          <div className="mt-10 grid gap-px bg-[color:var(--line)] lg:grid-cols-3">
            {WHY_SOLANA.map((w) => (
              <div key={w.title} className="bg-[color:var(--paper)] p-6">
                <div className={`${mono} text-[10px] uppercase tracking-[0.2em] text-[color:var(--brand)]`}>{w.label}</div>
                <div className={`${display} mt-3 font-black`}>{w.title}</div>
                <p className="mt-2 text-sm text-[color:var(--ink-2)] leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HONEST SCOPE ─────────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>honest scope</p>
          <h2 className={`${display} mt-4 text-2xl font-black sm:text-3xl`}>What v1 covers — and what it doesn&apos;t.</h2>
          <p className="mt-4 max-w-2xl text-sm text-[color:var(--ink-2)]">
            The hook fires on Transfer, TransferChecked, and TransferCheckedWithFee — including all CPI calls. It does not fire on MintTo, Burn, Approve, or CloseAccount. Those are companion-guard territory (v2 roadmap).
          </p>
          <div className="mt-8 grid gap-0 border-2 border-[color:var(--line)] sm:grid-cols-2">
            <div className="p-6">
              <div className={`${mono} mb-3 text-[10px] uppercase tracking-[0.16em] text-[color:var(--success)]`}>✓ fires on</div>
              <ul className={`${mono} space-y-1.5 text-xs text-[color:var(--ink-2)]`}>
                {["Transfer","TransferChecked","TransferCheckedWithFee","CPI transfers (DEX, vaults, programs)","Delegate-initiated transfers"].map(t=><li key={t}>{t}</li>)}
              </ul>
            </div>
            <div className="p-6 border-t-2 border-[color:var(--line)] sm:border-t-0 sm:border-l-2">
              <div className={`${mono} mb-3 text-[10px] uppercase tracking-[0.16em] text-[color:var(--danger)]`}>✗ does not fire on</div>
              <ul className={`${mono} space-y-1.5 text-xs text-[color:var(--ink-2)]`}>
                {["MintTo, Burn","Approve, Revoke","CloseAccount, FreezeAccount","Native SOL transfers","Legacy SPL-Token mints"].map(t=><li key={t}>{t}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="px-6 py-16 bg-[color:var(--paper-2)]">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <div className={`${display} text-xl font-black`}>Ready to try it?</div>
            <p className="mt-1 text-sm text-[color:var(--ink-2)]">Run a real on-chain attack rejection on devnet — takes 5 seconds.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/demo"
              className={`${mono} inline-flex items-center gap-2 border-2 border-[color:var(--brand)] bg-[color:var(--brand)] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-white hover:bg-[color:var(--brand-2)] transition-colors`}>
              Try demo →
            </Link>
            <Link href="/integrate"
              className={`${mono} inline-flex items-center gap-2 border-2 border-[color:var(--line-strong)] px-6 py-3.5 text-sm uppercase tracking-[0.16em] text-[color:var(--ink-2)] hover:border-[color:var(--brand-line)] hover:text-[color:var(--brand)] transition-colors`}>
              Integrate →
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

const FLOW = [
  { label: "Agent signs tx",        desc: "AI agent constructs a Token-2022 transfer and signs with its keypair." },
  { label: "Token-2022 calls hook", desc: "Solana's Token-2022 program invokes the Onleash hook on every transfer." },
  { label: "6 checks run",          desc: "Allowlist · per-tx cap · daily cap · pause · cooldown · count. All six must pass atomically." },
  { label: "Approve or revert",     desc: "Pass → transfer clears. Fail → entire transaction reverts. No partials." },
];

const CHECKS = [
  { title: "Destination allowlist", desc: "Up to 8 approved destination token accounts per mint. Any other destination causes an immediate revert. The agent cannot route funds anywhere else.", code: 6001, name: "DestinationNotAllowed" },
  { title: "Per-tx maximum",        desc: "Hard ceiling on a single transfer amount. Prevents a single oversized exfiltration even if the daily cap has headroom.", code: 6002, name: "ExceedsPerTxMax" },
  { title: "24h rolling cap",       desc: "Cumulative spend limit per rolling 24h window. Auto-resets on the first transfer after the window expires — no admin action needed.", code: 6003, name: "ExceedsDailyCap" },
  { title: "Emergency pause",       desc: "Authority sets paused=true and all transfers halt immediately. One on-chain flag, effective on the next block. No multisig, no off-chain coordination.", code: 6007, name: "PolicyPaused" },
  { title: "Transfer cooldown",     desc: "Minimum seconds between transfers. Throttles rapid-fire drain attempts — even if each is under the per-tx cap and daily limit.", code: 6008, name: "CooldownActive" },
  { title: "Daily count limit",     desc: "Max number of transfers per 24h window. Blocks micro-drain patterns where many small transfers individually pass value caps but collectively exfiltrate the wallet.", code: 6009, name: "ExceedsTransferCount" },
];

const WHY_SOLANA = [
  { label: "Primitive",  title: "Token-2022 transfer hooks",   desc: "The only chain with a native hook that fires atomically on every token transfer — unbypassable at the protocol level, not your application code." },
  { label: "Economics",  title: "Sub-cent per transfer",       desc: "On Ethereum, a policy check per transfer would cost $5+ in gas — making it economically unviable. On Solana it costs $0.001. That's the difference between a protocol primitive and a theoretical idea." },
  { label: "Ecosystem",  title: "ElizaOS · solana-agent-kit", desc: "Draft PR #565 open to sendaifun/solana-agent-kit — the main Solana AI agent framework. ElizaOS and Griffain both build on it. 5-line drop-in for any existing agent." },
];
