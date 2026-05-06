import Link from "next/link";
import WaitlistForm from "@/components/waitlist-form";

const mono = "font-[family-name:var(--font-mono-family)]";
const display = "font-[family-name:var(--font-display-family)]";

const PROGRAM_ID  = "7vJ2fa6dr3Tnx8whNAepUMmpytAnEZxcASMyH2jAuG7v";
const SAMPLE_MINT = "2KkYRVS2cBnneryveAYxH5hGfnNhdFruXAc4NjeAekcZ";

export default function Home() {
  return (
    <main style={{ background: "var(--paper)", color: "var(--ink)" }}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="mx-auto max-w-5xl">
          <div className={`${mono} mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)] animate-fade-up`}>
            <span className="inline-block h-[3px] w-6 bg-[color:var(--brand)]" />
            Token-2022 · Solana · Open source · MIT
          </div>
          <h1 className={`${display} animate-fade-up-delay-1 max-w-4xl font-black tracking-tight text-5xl leading-[1.02] sm:text-7xl`}>
            Every AI agent with a wallet is one prompt away from getting rugged.
          </h1>
          <div className="mt-4 h-1 w-32 bg-[color:var(--brand)] animate-fade-up-delay-2" />
          <p className="mt-7 max-w-2xl text-xl font-semibold leading-snug text-[color:var(--ink)] animate-fade-up-delay-2">
            Onleash gives your AI agent a prepaid card instead of a credit card.
          </p>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[color:var(--ink-2)] animate-fade-up-delay-2">
            Spending policy lives <em>inside the token itself</em> via Token-2022 transfer hooks — enforced
            by the Solana network on every transfer. A jailbroken agent can sign anything.
            The chain refuses to clear it.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center animate-fade-up-delay-3">
            <Link href="/demo"
              className={`${mono} inline-flex items-center gap-3 border-2 border-[color:var(--brand)] bg-[color:var(--brand)] px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white hover:bg-[color:var(--brand-2)] hover:border-[color:var(--brand-2)] transition-colors`}>
              Run attack on devnet →
            </Link>
            <Link href="/how-it-works"
              className={`${mono} inline-flex items-center gap-2 border-2 border-[color:var(--line-strong)] px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[color:var(--ink-2)] hover:border-[color:var(--brand-line)] hover:text-[color:var(--ink)] transition-colors`}>
              How it works
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] bg-[color:var(--paper-2)] px-6 py-6">
        <div className="mx-auto max-w-5xl grid grid-cols-2 gap-6 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className={`${display} text-2xl font-black text-[color:var(--brand)] sm:text-3xl`}>{s.value}</div>
              <div className={`${mono} mt-1 text-[10px] uppercase tracking-[0.16em] text-[color:var(--ink-2)]`}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROBLEM ──────────────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>the problem</p>
          <h2 className={`${display} mt-4 max-w-3xl text-3xl font-black sm:text-5xl`}>
            AI agents have wallets. They&apos;re getting drained.
          </h2>
          <div className="mt-10 grid gap-px bg-[color:var(--line)] sm:grid-cols-2 lg:grid-cols-4">
            {INCIDENTS.map((i) => (
              <article key={i.title} className="bg-[color:var(--paper)] p-6 hover:bg-[color:var(--paper-2)] transition-colors">
                <div className={`${mono} text-[10px] uppercase tracking-[0.2em] text-[color:var(--brand)]`}>{i.date}</div>
                <div className={`${display} mt-2 text-3xl font-black`}>{i.amount}</div>
                <div className="mt-3 text-sm font-bold">{i.title}</div>
                <p className="mt-2 text-xs leading-relaxed text-[color:var(--ink-2)]">{i.summary}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm text-[color:var(--ink-2)] max-w-2xl">
            Every existing solution operates at the{" "}
            <span className="font-semibold text-[color:var(--ink)]">signer layer</span> — revocable custody, multisig, middleware.
            A jailbroken agent can bypass all of them.{" "}
            <span className="font-semibold text-[color:var(--ink)]">Onleash operates at the asset layer.</span>
          </p>
        </div>
      </section>

      {/* ── SOLUTION OVERVIEW ────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-20 bg-[color:var(--paper-2)]">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>the solution</p>
          <h2 className={`${display} mt-4 max-w-3xl text-3xl font-black sm:text-5xl`}>
            Policy lives in the token, not the wallet.
          </h2>
          <p className="mt-6 max-w-2xl text-base text-[color:var(--ink-2)]">
            Solana&apos;s Token-2022 transfer-hook extension lets a mint specify a program
            that runs on every transfer — including CPIs from DEXes and vaults.
            Onleash is that program.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SOLUTION_PILLARS.map((p) => (
              <div key={p.title} className="border-2 border-[color:var(--line)] bg-[color:var(--paper)] p-6">
                <div className="flex h-8 w-8 items-center justify-center bg-[color:var(--brand)] text-white text-sm font-bold mb-4">
                  {p.num}
                </div>
                <div className="font-bold">{p.title}</div>
                <p className="mt-2 text-sm text-[color:var(--ink-2)] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/how-it-works"
              className={`${mono} inline-flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-[color:var(--brand)] hover:underline underline-offset-4`}>
              See full mechanism →
            </Link>
          </div>
        </div>
      </section>

      {/* ── DEMO TEASER ──────────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-20">
        <div className="mx-auto max-w-5xl grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>live · devnet</p>
            <h2 className={`${display} mt-4 text-3xl font-black sm:text-4xl`}>
              Watch the chain reject an attack right now.
            </h2>
            <p className="mt-5 text-base text-[color:var(--ink-2)]">
              Real Token-2022 transfer. Real Solana devnet. Real on-chain rejection in under a second. No mocks.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/demo"
                className={`${mono} inline-flex items-center gap-3 border-2 border-[color:var(--brand)] bg-[color:var(--brand)] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-white hover:bg-[color:var(--brand-2)] transition-colors`}>
                Run attack →
              </Link>
              <a href={`https://explorer.solana.com/address/${PROGRAM_ID}?cluster=devnet`}
                target="_blank" rel="noreferrer"
                className={`${mono} inline-flex items-center gap-2 border-2 border-[color:var(--line-strong)] px-6 py-3.5 text-xs uppercase tracking-[0.16em] text-[color:var(--ink-2)] hover:border-[color:var(--brand-line)] hover:text-[color:var(--brand)] transition-colors`}>
                Explorer →
              </a>
            </div>
          </div>
          {/* Error card preview */}
          <div className="border-2 border-[color:var(--brand)] bg-[color:var(--paper-2)] p-6">
            <div className={`${mono} text-[10px] uppercase tracking-[0.2em] text-[color:var(--brand)]`}>
              ✓ transaction rejected on chain · attack blocked
            </div>
            <div className={`${display} mt-3 text-2xl font-black`}>
              DestinationNotAllowed <span className="text-[color:var(--brand)]">(6001)</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--ink-2)]">
              Transfer to a destination NOT on the allowlist. The Onleash hook
              rejected the transaction atomically — funds preserved.
            </p>
            <div className={`${mono} mt-5 grid gap-2 text-xs`}>
              <div className="grid grid-cols-[80px_1fr] gap-2">
                <span className="text-[color:var(--ink-3)]">program</span>
                <span className="break-all text-[color:var(--ink)]">{PROGRAM_ID.slice(0,20)}…</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-2">
                <span className="text-[color:var(--ink-3)]">network</span>
                <span className="text-[color:var(--ink)]">devnet</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTEGRATE TEASER ─────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-20 bg-[color:var(--paper-2)]">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>integration · 5 lines</p>
          <h2 className={`${display} mt-4 text-3xl font-black sm:text-4xl`}>
            Drop into any solana-agent-kit agent.
          </h2>
          <pre className="mt-8 overflow-x-auto border-2 border-[color:var(--line-strong)] p-6 text-xs leading-relaxed sm:text-sm"
            style={{ background: "var(--code-bg)", color: "var(--code-fg)" }}>
            <code className={mono}>
              <span className="opacity-40">{"// pnpm add @onleash/sdk"}</span>{"\n"}
              <span style={{color:"var(--brand)"}}>import</span>{" { OnleashClient } "}<span style={{color:"var(--brand)"}}>from</span>{" "}<span className="text-emerald-400">"@onleash/sdk"</span>;{"\n\n"}
              <span style={{color:"var(--brand)"}}>const</span>{" client = "}<span style={{color:"var(--brand)"}}>new</span>{" OnleashClient(connection, wallet);\n"}
              <span style={{color:"var(--brand)"}}>await</span>{" client.deployProtectedMint({\n"}
              {"  perTxMax: "}<span className="text-amber-300">{"10n * 1_000_000n"}</span>{",\n"}
              {"  dailyCap: "}<span className="text-amber-300">{"50n * 1_000_000n"}</span>{",\n"}
              {"  allowlist: [approvedPoolATA],\n"}
              {"});"}
            </code>
          </pre>
          <Link href="/integrate"
            className={`${mono} mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-[color:var(--brand)] hover:underline underline-offset-4`}>
            Full integration guide →
          </Link>
        </div>
      </section>

      {/* ── ON-CHAIN PROOF ───────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>on-chain · devnet</p>
          <h2 className={`${display} mt-4 text-2xl font-black sm:text-3xl`}>Verifiable, right now.</h2>
          <div className="mt-6 grid gap-3">
            <ChainRow label="Hook program"        value={PROGRAM_ID}  href={`https://explorer.solana.com/address/${PROGRAM_ID}?cluster=devnet`} />
            <ChainRow label="Sample protected mint" value={SAMPLE_MINT} href={`https://explorer.solana.com/address/${SAMPLE_MINT}?cluster=devnet`} />
          </div>
        </div>
      </section>


      {/* ── PAY.SH INTEGRATION ───────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>
            pay.sh · x402 · new
          </p>
          <h2 className={`${display} mt-4 text-3xl font-black sm:text-4xl`}>
            Agents that pay for API calls.<br />
            <span className="text-[color:var(--brand)]">Safely.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base text-[color:var(--ink-2)]">
            pay.sh lets AI agents pay for API calls autonomously via HTTP 402 / x402.
            Powerful — but a jailbroken agent can be coerced into redirecting that payment
            to an attacker instead of the real provider. Onleash closes this gap:
            only approved pay.sh provider addresses can receive payments.
            The chain blocks everything else.
          </p>
          <div className="mt-10 grid gap-px bg-[color:var(--line)] sm:grid-cols-2">
            {/* without */}
            <div className="bg-[color:var(--paper)] p-6">
              <p className={`${mono} text-[10px] uppercase tracking-[0.2em] text-red-400`}>without onleash</p>
              <p className="mt-3 text-sm text-[color:var(--ink-2)] leading-relaxed">
                Agent receives a fake 402 challenge from an attacker.<br />
                Agent signs payment to attacker address.<br />
                <span className="text-red-400 font-bold">Funds gone. Agent never knew.</span>
              </p>
            </div>
            {/* with */}
            <div className="bg-[color:var(--paper)] p-6">
              <p className={`${mono} text-[10px] uppercase tracking-[0.2em] text-[color:var(--brand)]`}>with onleash</p>
              <p className="mt-3 text-sm text-[color:var(--ink-2)] leading-relaxed">
                Agent signs the same payment to the attacker address.<br />
                Onleash hook runs on-chain. Destination not in allowlist.<br />
                <span className="text-[color:var(--brand)] font-bold">DestinationNotAllowed (6001). Funds preserved.</span>
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="https://github.com/sendaifun/solana-agent-kit/pull/565"
              target="_blank" rel="noreferrer"
              className={`${mono} inline-flex items-center gap-2 border border-[color:var(--brand)] px-4 py-2 text-xs uppercase tracking-[0.16em] text-[color:var(--brand)] hover:bg-[color:var(--brand)] hover:text-black transition-colors`}>
              view PR — solana-agent-kit #565 →
            </a>
            <a href="https://pay.sh" target="_blank" rel="noreferrer"
              className={`${mono} inline-flex items-center gap-2 border border-[color:var(--line-strong)] px-4 py-2 text-xs uppercase tracking-[0.16em] text-[color:var(--ink-2)] hover:text-[color:var(--ink)] transition-colors`}>
              pay.sh →
            </a>
          </div>
        </div>
      </section>


      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-20 bg-[color:var(--paper-2)]">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>faq</p>
          <h2 className={`${display} mt-4 text-3xl font-black sm:text-4xl`}>Why not X?</h2>
          <div className="mt-10 grid gap-px bg-[color:var(--line)] sm:grid-cols-2">
            {FAQ.map((q) => (
              <article key={q.q} className="bg-[color:var(--paper)] p-7">
                <div className={`${display} font-black text-base mb-3`}>{q.q}</div>
                <p className="text-sm leading-relaxed text-[color:var(--ink-2)]">{q.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── WAITLIST ─────────────────────────────────────────────── */}
      <section id="waitlist" className="border-b border-[color:var(--line)] px-6 py-24 bg-[color:var(--paper-2)]">
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
            <p className="mt-5 text-base text-[color:var(--ink-2)]">
              Get notified when mainnet ships. We&apos;ll send you the integration guide and a sample agent wallet setup.
            </p>
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className={`${display} text-lg font-black`}>onleash</span>
            <span className="inline-block h-[3px] w-5 bg-[color:var(--brand)]" />
            <span className={`${mono} text-[11px] uppercase tracking-[0.2em] text-[color:var(--ink-3)]`}>MIT · open source</span>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            {[{href:"/how-it-works",l:"How it works"},{href:"/demo",l:"Demo"},{href:"/integrate",l:"Integrate"},{href:"/roadmap",l:"Roadmap"},{href:"/security",l:"Security"},{href:"/playground",l:"Playground"},{href:"/compose",l:"Compose"}].map(({href,l})=>(
              <Link key={href} href={href} className={`${mono} text-xs uppercase tracking-[0.16em] text-[color:var(--ink-2)] hover:text-[color:var(--ink)]`}>{l}</Link>
            ))}
            <a href="https://github.com/amalia020/onleash" target="_blank" rel="noreferrer"
              className={`${mono} text-xs uppercase tracking-[0.16em] text-[color:var(--ink-2)] hover:text-[color:var(--ink)]`}>GitHub</a>
          </div>
          <span className={`${mono} text-xs text-[color:var(--ink-3)]`}>Colosseum Frontier · Amsterdam · 2026</span>
        </div>
      </footer>

    </main>
  );
}

const FAQ = [
  {
    q: "Why not Squads multisig?",
    a: "Multisig requires a quorum to approve every transfer — that kills autonomous agent operation. Onleash lets the agent sign freely; the chain enforces the policy without any human in the loop. You get safety without sacrificing autonomy.",
  },
  {
    q: "Why not Privy or Turnkey?",
    a: "Custody solutions control who can sign. A jailbroken agent already has signing authority — the attacker just coerces it into signing the wrong thing. Onleash operates after the signature, at the asset layer. Even a fully compromised agent can't route funds to an unapproved address.",
  },
  {
    q: "Why not prompt guards or middleware?",
    a: "Prompt guards are your first line of defence — keep them. But they run in software you control, which can be bypassed. Onleash is a second, independent layer enforced by the Solana network itself. Defence in depth: break both to drain anything.",
  },
  {
    q: "Why not build this on Ethereum?",
    a: "Ethereum has no native transfer hook. You'd need a custom ERC-20 wrapper, meaning every token is a new deployment, every DEX integration breaks, and the gas cost of a policy check per transfer is $5+. Token-2022 makes this a protocol primitive on Solana — one program, any mint, sub-cent enforcement.",
  },
];

function ChainRow({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer"
      className="group grid gap-2 border border-[color:var(--line)] p-4 transition-colors hover:border-[color:var(--brand-line)] hover:bg-[color:var(--paper-2)] sm:grid-cols-[200px_1fr_auto] sm:items-center sm:gap-6">
      <span className="font-[family-name:var(--font-mono-family)] text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-2)]">{label}</span>
      <span className="break-all font-[family-name:var(--font-mono-family)] text-xs text-[color:var(--ink)] sm:text-sm">{value}</span>
      <span className="font-[family-name:var(--font-mono-family)] text-xs text-[color:var(--brand)] opacity-70 group-hover:opacity-100">explorer →</span>
    </a>
  );
}

const STATS = [
  { value: "$653K",  label: "Drained in documented attacks" },
  { value: "$77M",   label: "Agent wallet TVL today" },
  { value: "13/13",  label: "Tests passing on devnet" },
  { value: "PR #565", label: "solana-agent-kit plugin open" },
];

const INCIDENTS = [
  { date: "Nov 2024", amount: "$47K",    title: "Freysa Act I",        summary: "User redefined approveTransfer via prompt injection." },
  { date: "Mar 2025", amount: "$106K",   title: "aixbt × Simulacrum",  summary: "Pipeline injection via operator dashboard." },
  { date: "Mar 2025", amount: "mainnet", title: "ElizaOS × Princeton", summary: "Memory injection, real ETH drained on mainnet." },
  { date: "Apr 2026", amount: "$500K",   title: "LLM router drain",    summary: "9 of 428 routers silently replaced recipients." },
];

const SOLUTION_PILLARS = [
  { num: "1", title: "Allowlist",       desc: "Up to 8 approved destination accounts. Anything else, the chain rejects — error 6001." },
  { num: "2", title: "Per-tx cap",      desc: "Hard ceiling on a single transfer. No oversized exfiltration — error 6002." },
  { num: "3", title: "Daily cap",       desc: "24h rolling window. Self-resets on the next transfer after the window expires — error 6003." },
  { num: "4", title: "Emergency pause", desc: "Authority can halt all transfers instantly. One flag, on-chain, effective on the next block — error 6007." },
  { num: "5", title: "Cooldown",        desc: "Minimum interval between transfers. Throttles rapid-fire drains — error 6008." },
  { num: "6", title: "Transfer count",  desc: "Daily limit on number of transfers, not just value. Blocks high-frequency micro-drain patterns — error 6009." },
];
