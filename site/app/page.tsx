import Link from "next/link";
import WaitlistForm from "@/components/waitlist-form";

const PROGRAM_ID = "7vJ2fa6dr3Tnx8whNAepUMmpytAnEZxcASMyH2jAuG7v";
const SAMPLE_MINT = "2KkYRVS2cBnneryveAYxH5hGfnNhdFruXAc4NjeAekcZ";

const mono = "font-[family-name:var(--font-mono-family)]";
const display = "font-[family-name:var(--font-display-family)]";

export default function Landing() {
  return (
    <main style={{ background: "var(--paper)", color: "var(--ink)" }}>

      {/* ── NAV ─────────────────────────────────────────────────── */}
      <nav className="border-b border-[color:var(--line)] px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`${display} text-lg font-black`}>onleash</span>
            <span className="inline-block h-[3px] w-5 bg-[color:var(--brand)]" />
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/amalia020/onleash"
              target="_blank"
              rel="noreferrer"
              className={`${mono} text-xs uppercase tracking-[0.18em] text-[color:var(--ink-2)] hover:text-[color:var(--ink)]`}
            >
              GitHub
            </a>
            <Link
              href="/demo"
              className={`${mono} inline-flex items-center gap-2 bg-[color:var(--brand)] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white hover:bg-[color:var(--brand-2)]`}
            >
              Try demo →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 pt-20 pb-28 sm:pt-28 sm:pb-36">
        <div className="mx-auto max-w-5xl">
          <div className={`${mono} mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)] animate-fade-up`}>
            <span className="inline-block h-[3px] w-6 bg-[color:var(--brand)]" />
            Token-2022 · Solana · Open source
          </div>
          <h1 className={`${display} animate-fade-up-delay-1 max-w-4xl font-black tracking-tight text-5xl leading-[1.02] sm:text-7xl lg:text-8xl`}>
            Every AI agent with a wallet is one prompt away from getting rugged.
          </h1>
          <div className="mt-4 h-1 w-32 bg-[color:var(--brand)] animate-fade-up-delay-2" />
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[color:var(--ink-2)] animate-fade-up-delay-2">
            Onleash puts spending policy <em>inside the token itself</em> via Token-2022 transfer hooks — so a jailbroken AI agent cannot exit the mint regardless of which key it signs with or which program it calls.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center animate-fade-up-delay-3">
            <Link
              href="/demo"
              className={`${mono} inline-flex items-center justify-center gap-3 border-2 border-[color:var(--brand)] bg-[color:var(--brand)] px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[color:var(--brand-2)] hover:border-[color:var(--brand-2)]`}
            >
              Run attack on devnet →
            </Link>
            <a
              href="https://github.com/amalia020/onleash"
              target="_blank"
              rel="noreferrer"
              className={`${mono} text-sm uppercase tracking-[0.18em] text-[color:var(--ink-2)] underline-offset-4 hover:text-[color:var(--ink)] hover:underline`}
            >
              Star on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ── PROOF: REAL INCIDENTS ───────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>
            the problem
          </p>
          <h2 className={`${display} mt-4 max-w-3xl text-3xl font-black sm:text-5xl`}>
            AI agents have wallets. They&apos;re getting drained.
          </h2>
          <div className="mt-12 grid gap-px bg-[color:var(--line)] sm:grid-cols-2 lg:grid-cols-4">
            {INCIDENTS.map((i) => (
              <article key={i.title} className="bg-[color:var(--paper)] p-6 hover:bg-[color:var(--paper-2)] transition-colors">
                <div className={`${mono} text-[10px] uppercase tracking-[0.2em] text-[color:var(--brand)]`}>{i.date}</div>
                <div className={`${display} mt-2 text-3xl font-black`}>{i.amount}</div>
                <div className="mt-3 text-sm font-bold">{i.title}</div>
                <p className="mt-2 text-xs leading-relaxed text-[color:var(--ink-2)]">{i.summary}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm text-[color:var(--ink-2)]">
            Every existing solution trusts the agent. Revocable custody, Squads multisig, hand-rolled middleware — all operate at the{" "}
            <span className="font-semibold text-[color:var(--ink)]">signer layer</span>. A jailbroken agent can bypass them.{" "}
            <span className="font-semibold text-[color:var(--ink)]">Onleash operates at the asset layer.</span>
          </p>
        </div>
      </section>

      {/* ── MECHANISM ───────────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>
            how it works
          </p>
          <h2 className={`${display} mt-4 max-w-3xl text-3xl font-black sm:text-5xl`}>
            Policy lives in the token, not the wallet.
          </h2>
          <p className="mt-6 max-w-2xl text-base text-[color:var(--ink-2)] sm:text-lg">
            Solana&apos;s Token-2022 transfer-hook extension lets a mint specify a program that runs on every transfer. Onleash is that program. Three checks; any failure reverts the entire atomic transaction.
          </p>

          {/* flow diagram */}
          <div className="mt-12 flex flex-col items-start gap-0 sm:flex-row sm:items-stretch">
            {FLOW.map((step, i) => (
              <div key={step.label} className="flex sm:flex-col sm:flex-1 items-center sm:items-start">
                <div className="flex sm:flex-col items-center sm:items-start gap-0 w-full">
                  <div className="border border-[color:var(--line)] bg-[color:var(--paper-2)] p-5 sm:w-full">
                    <div className={`${mono} text-[10px] uppercase tracking-[0.16em] text-[color:var(--brand)]`}>Step {i + 1}</div>
                    <div className="mt-2 font-bold text-sm">{step.label}</div>
                    <p className="mt-1 text-xs text-[color:var(--ink-2)] leading-relaxed">{step.desc}</p>
                  </div>
                  {i < FLOW.length - 1 && (
                    <div className={`${mono} px-3 py-2 text-[color:var(--brand)] text-lg font-bold hidden sm:block`}>→</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 3 checks */}
          <div className="mt-12 grid gap-px bg-[color:var(--line)] lg:grid-cols-3">
            {CHECKS.map((c, i) => (
              <article key={c.title} className="bg-[color:var(--paper)] p-6">
                <div className={`${mono} text-[10px] uppercase tracking-[0.2em] text-[color:var(--brand)]`}>Check {i + 1}</div>
                <div className="mt-3 text-base font-bold">{c.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">{c.summary}</p>
                <div className={`${mono} mt-4 text-[11px] text-[color:var(--ink-3)]`}>
                  Error code <span className="text-[color:var(--brand)]">{c.code}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE DEMO CTA ───────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-20 bg-[color:var(--paper-2)]">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>
            live · devnet
          </p>
          <h2 className={`${display} mt-4 max-w-2xl text-3xl font-black sm:text-5xl`}>
            Watch the chain reject an attack in real time.
          </h2>
          <p className="mt-6 max-w-xl text-base text-[color:var(--ink-2)]">
            We submit a real Token-2022 transfer to a destination NOT on the allowlist. Solana&apos;s Token-2022 program runs the Onleash hook on-chain. The hook reverts the transaction atomically. Funds preserved.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Link
              href="/demo"
              className={`${mono} inline-flex items-center gap-3 border-2 border-[color:var(--brand)] bg-[color:var(--brand)] px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white hover:bg-[color:var(--brand-2)] hover:border-[color:var(--brand-2)]`}
            >
              Run attack on devnet →
            </Link>
            <a
              href={`https://explorer.solana.com/address/${PROGRAM_ID}?cluster=devnet`}
              target="_blank"
              rel="noreferrer"
              className={`${mono} inline-flex items-center gap-2 border border-[color:var(--line-strong)] px-4 py-4 text-xs uppercase tracking-[0.18em] text-[color:var(--ink-2)] hover:border-[color:var(--brand-line)] hover:text-[color:var(--brand)]`}
            >
              View program on explorer →
            </a>
          </div>
          {/* error card preview */}
          <div className="mt-12 max-w-2xl border-2 border-[color:var(--brand)] bg-white p-6">
            <div className={`${mono} text-[10px] uppercase tracking-[0.2em] text-[color:var(--brand)]`}>
              ✓ transaction rejected on chain · attack blocked
            </div>
            <div className={`${display} mt-3 text-2xl font-black`}>
              DestinationNotAllowed <span className="text-[color:var(--brand)]">(6001)</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--ink-2)]">
              We submitted a real Token-2022 transfer of <code className={`${mono} text-[color:var(--ink)]`}>1 token</code> to a destination NOT on the policy allowlist. The hook rejected the transfer atomically — funds preserved.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHY THIS WORKS ──────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>
            the thesis
          </p>
          <h2 className={`${display} mt-4 max-w-3xl text-3xl font-black sm:text-5xl`}>
            Signer-gates verify the agent didn&apos;t get jailbroken. Asset-gates work even if it did.
          </h2>
          <div className="mt-12 grid gap-px bg-[color:var(--line)] sm:grid-cols-2">
            <div className="bg-[color:var(--paper)] p-8">
              <div className={`${mono} text-[10px] uppercase tracking-[0.2em] text-[color:var(--ink-3)]`}>other solutions</div>
              <div className={`${display} mt-3 text-xl font-black`}>Signer layer</div>
              <ul className="mt-4 space-y-3 text-sm text-[color:var(--ink-2)]">
                {["Middleware agents can ignore", "Squads multisig kills autonomy", "Privy / Turnkey custody is off-chain", "Hand-rolled guards bypassed by OWASP LLM01"].map(t => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="text-[color:var(--danger)] mt-0.5">✗</span> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[color:var(--paper-2)] p-8 border-l-2 border-[color:var(--brand)]">
              <div className={`${mono} text-[10px] uppercase tracking-[0.2em] text-[color:var(--brand)]`}>onleash</div>
              <div className={`${display} mt-3 text-xl font-black`}>Asset layer</div>
              <ul className="mt-4 space-y-3 text-sm text-[color:var(--ink-2)]">
                {["Policy is in the mint — not in the agent", "Enforced by Solana's Token-2022 program", "Hook fires on every transfer, no exceptions", "Jailbroken agent can sign — chain still refuses"].map(t => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="text-[color:var(--success)] mt-0.5">✓</span> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY SOLANA ──────────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>
            why solana
          </p>
          <h2 className={`${display} mt-4 max-w-3xl text-3xl font-black sm:text-5xl`}>
            The primitive only exists here.
          </h2>
          <div className="mt-12 grid gap-px bg-[color:var(--line)] lg:grid-cols-3">
            {WHY_SOLANA.map((w) => (
              <div key={w.title} className="bg-[color:var(--paper)] p-6">
                <div className={`${mono} text-[10px] uppercase tracking-[0.2em] text-[color:var(--brand)]`}>{w.label}</div>
                <div className="mt-3 font-bold">{w.title}</div>
                <p className="mt-2 text-sm text-[color:var(--ink-2)] leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5-LINE INTEGRATION ──────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>
            integration · 5 lines
          </p>
          <h2 className={`${display} mt-4 max-w-3xl text-3xl font-black sm:text-4xl`}>
            Drop into any solana-agent-kit agent.
          </h2>
          <pre
            className="mt-8 overflow-x-auto border-2 border-[color:var(--line-strong)] p-6 text-xs leading-relaxed sm:text-sm"
            style={{ background: "var(--code-bg)", color: "var(--code-fg)" }}
          >
            <code className={mono}>
              <span className="opacity-40">{"// pnpm add @onleash/sdk"}</span>{"\n"}
              <span style={{color:"var(--brand)"}}>import</span>{" { OnleashClient } "}<span style={{color:"var(--brand)"}}>from</span>{" "}<span className="text-emerald-400">"@onleash/sdk"</span>;{"\n\n"}
              <span style={{color:"var(--brand)"}}>const</span>{" client = "}<span style={{color:"var(--brand)"}}>new</span>{" OnleashClient(connection, wallet);\n"}
              <span style={{color:"var(--brand)"}}>await</span>{" client.deployProtectedMint({\n"}
              {"  decimals: "}<span className="text-amber-300">6</span>{",\n"}
              {"  perTxMax: "}<span className="text-amber-300">{"10n * 1_000_000n"}</span>{",\n"}
              {"  dailyCap: "}<span className="text-amber-300">{"50n * 1_000_000n"}</span>{",\n"}
              {"  allowlist: [approvedPoolATA],\n"}
              {"});"}
            </code>
          </pre>
        </div>
      </section>


      {/* ── ON-CHAIN PROOF ──────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>
            on-chain · devnet
          </p>
          <h2 className={`${display} mt-4 text-3xl font-black sm:text-4xl`}>Verifiable, right now.</h2>
          <div className="mt-8 grid gap-3">
            <ChainRow label="Hook program" value={PROGRAM_ID} href={`https://explorer.solana.com/address/${PROGRAM_ID}?cluster=devnet`} />
            <ChainRow label="Sample protected mint" value={SAMPLE_MINT} href={`https://explorer.solana.com/address/${SAMPLE_MINT}?cluster=devnet`} />
          </div>
        </div>
      </section>

      {/* ── ROADMAP ─────────────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>roadmap</p>
          <h2 className={`${display} mt-4 text-3xl font-black sm:text-4xl`}>v1 shipped. Here&apos;s what&apos;s next.</h2>
          <div className="mt-10 grid gap-px bg-[color:var(--line)] sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-[color:var(--brand)] p-6">
              <div className={`${mono} text-[10px] uppercase tracking-[0.16em] text-white/80`}>v1 · live now</div>
              <div className="mt-2 font-bold text-white">3 checks + 8-allowlist</div>
              <p className="mt-2 text-xs text-white/80">Allowlist · per-tx cap · daily rolling cap. Deployed on Solana devnet. MIT licensed.</p>
            </div>
            {ROADMAP.map((r) => (
              <div key={r.title} className="bg-[color:var(--paper)] p-6">
                <div className={`${mono} text-[10px] uppercase tracking-[0.16em] text-[color:var(--ink-3)]`}>{r.label}</div>
                <div className="mt-2 font-bold text-sm">{r.title}</div>
                <p className="mt-2 text-xs text-[color:var(--ink-2)]">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WAITLIST ────────────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-24 bg-[color:var(--paper-2)]">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-xl">
            <div className={`${mono} mb-3 inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>
              <span className="inline-block h-[3px] w-6 bg-[color:var(--brand)]" />
              Early access
            </div>
            <h2 className={`${display} text-4xl font-black sm:text-5xl`}>
              Agents unleashed.<br />
              <span className="text-[color:var(--brand)]">Wallets on leash.</span>
            </h2>
            <p className="mt-6 text-base text-[color:var(--ink-2)]">
              Get notified when mainnet ships. We&apos;ll also send you the integration guide and a sample agent wallet setup.
            </p>
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="px-6 py-12">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className={`${display} text-lg font-black`}>onleash</span>
            <span className="inline-block h-[3px] w-5 bg-[color:var(--brand)]" />
            <span className={`${mono} text-[11px] uppercase tracking-[0.2em] text-[color:var(--ink-3)]`}>MIT · open source</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com/amalia020/onleash" target="_blank" rel="noreferrer"
              className={`${mono} text-xs uppercase tracking-[0.18em] text-[color:var(--ink-2)] hover:text-[color:var(--ink)]`}>
              GitHub
            </a>
            <Link href="/demo"
              className={`${mono} text-xs uppercase tracking-[0.18em] text-[color:var(--ink-2)] hover:text-[color:var(--ink)]`}>
              Live demo
            </Link>
            <span className={`${mono} text-xs text-[color:var(--ink-3)]`}>Colosseum Frontier · Amsterdam · 2026</span>
          </div>
        </div>
      </footer>

    </main>
  );
}

// ── Sub-components ──────────────────────────────────────────────

function ChainRow({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer"
      className="group grid gap-2 border border-[color:var(--line)] p-4 transition-colors hover:border-[color:var(--brand-line)] hover:bg-[color:var(--paper-2)] sm:grid-cols-[200px_1fr_auto] sm:items-center sm:gap-6"
    >
      <span className="font-[family-name:var(--font-mono-family)] text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-2)]">{label}</span>
      <span className="break-all font-[family-name:var(--font-mono-family)] text-xs text-[color:var(--ink)] sm:text-sm">{value}</span>
      <span className="font-[family-name:var(--font-mono-family)] text-xs text-[color:var(--brand)] opacity-70 group-hover:opacity-100">explorer →</span>
    </a>
  );
}

// ── Data ────────────────────────────────────────────────────────

const INCIDENTS = [
  { date: "Nov 22, 2024", amount: "$47K",    title: "Freysa Act I",         summary: "User redefined approveTransfer via prompt injection." },
  { date: "Mar 18, 2025", amount: "$106K",   title: "aixbt × Simulacrum",   summary: "Pipeline injection via operator dashboard." },
  { date: "Mar 2025",     amount: "mainnet", title: "ElizaOS × Princeton",  summary: "Memory injection, real ETH drained on mainnet." },
  { date: "Apr 2026",     amount: "$500K",   title: "LLM router drain",     summary: "9 of 428 routers silently replaced recipients." },
];

const FLOW = [
  { label: "Agent signs tx",         desc: "AI agent constructs a Token-2022 transfer and signs with its key." },
  { label: "Token-2022 calls hook",  desc: "Solana's Token-2022 program invokes the Onleash hook program on every transfer." },
  { label: "3 checks run on-chain",  desc: "Allowlist · per-tx cap · daily cap. All three must pass." },
  { label: "Approve or revert",      desc: "Pass → transfer clears. Fail → entire transaction reverts atomically." },
];

const CHECKS = [
  { title: "Destination allowlist", summary: "Up to 8 approved destination accounts per mint. Anything else, the chain rejects.", code: 6001 },
  { title: "Per-tx maximum",        summary: "Hard ceiling on a single transfer amount. No oversized exfiltration.",            code: 6002 },
  { title: "Daily cap (24h rolling)",summary: "Cumulative limit per rolling window. Self-resets after 24h on next transfer.",  code: 6003 },
];

const WHY_SOLANA = [
  { label: "Primitive",  title: "Token-2022 transfer hooks",     desc: "The only blockchain with a native hook extension that fires atomically on every token transfer — unbypassable at the protocol level." },
  { label: "Economics",  title: "Sub-cent per transfer",         desc: "Hook CPI costs ~5,000 compute units. At current fees, policy enforcement costs less than $0.001 per transaction." },
  { label: "Ecosystem",  title: "ElizaOS · solana-agent-kit",   desc: "The two dominant AI agent frameworks on Solana. Onleash ships as a plugin PR — 5-line integration for any agent built on the kit." },
];

const ROADMAP = [
  { label: "v2",    title: "Pyth USD-denominated caps",    desc: "'$10/tx, $50/day' instead of raw token units. Automatic oracle-backed conversion." },
  { label: "v2",    title: "Plain-English policy DSL",     desc: "\"Agent can spend up to $100/day to approved suppliers\" — compiled to on-chain policy PDA." },
  { label: "v2",    title: "USDC policy-wrapper mint",     desc: "Deposit USDC, get policy-USDC. Drop-in replacement for any agent that already holds USDC." },
  { label: "v2",    title: "Per-counterparty caps",        desc: "\"Max $50/day to vendor X, $200/day to vendor Y\" — granular per-destination limits." },
  { label: "later", title: "Multisig upgrade authority",  desc: "Squads 2-of-3 instead of single deployer key. Required before mainnet GA." },
];
