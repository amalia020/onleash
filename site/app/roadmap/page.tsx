const mono = "font-[family-name:var(--font-mono-family)]";
const display = "font-[family-name:var(--font-display-family)]";

export default function Roadmap() {
  return (
    <main style={{ background: "var(--paper)", color: "var(--ink)" }}>

      {/* ── HEADER ───────────────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 pt-14 pb-16">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>Roadmap</p>
          <h1 className={`${display} mt-4 max-w-3xl text-4xl font-black sm:text-6xl`}>
            v1 shipped. Here&apos;s what&apos;s next.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[color:var(--ink-2)]">
            Onleash v1 is a policy primitive for Token-2022 mints. The same PDA pattern
            is backwards-compatible — v1 mints stay valid forever as we extend the protocol.
          </p>
        </div>
      </section>

      {/* ── V1 STATUS ────────────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <div className={`${mono} mb-4 inline-flex items-center gap-2 bg-[color:var(--brand)] px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-white`}>
            ✓ v1 · live on devnet
          </div>
          <h2 className={`${display} text-2xl font-black sm:text-3xl`}>What shipped</h2>
          <div className="mt-8 grid gap-px bg-[color:var(--line)] sm:grid-cols-2 lg:grid-cols-3">
            {V1_ITEMS.map(item => (
              <div key={item} className="bg-[color:var(--paper-2)] p-5 flex items-start gap-3">
                <span className="text-[color:var(--success)] font-bold mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
          <div className={`${mono} mt-6 flex flex-wrap gap-6 text-xs text-[color:var(--ink-2)]`}>
            <span><span className="text-[color:var(--brand)]">10/10</span> tests passing</span>
            <span><span className="text-[color:var(--brand)]">&lt;300</span> lines of Rust</span>
            <span><span className="text-[color:var(--brand)]">MIT</span> licensed</span>
            <span><span className="text-[color:var(--brand)]">Devnet</span> deployed</span>
          </div>
        </div>
      </section>

      {/* ── V2 ───────────────────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-14 bg-[color:var(--paper-2)]">
        <div className="mx-auto max-w-5xl">
          <div className={`${mono} mb-4 inline-flex items-center gap-2 border-2 border-[color:var(--line-strong)] px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-[color:var(--ink-2)]`}>
            v2 · in design
          </div>
          <h2 className={`${display} text-2xl font-black sm:text-3xl`}>Richer policy, same primitive</h2>
          <p className="mt-4 max-w-2xl text-sm text-[color:var(--ink-2)]">
            Same hook program, same Policy PDA pattern — just richer state and more instructions. Backwards-compatible with a version bump.
          </p>
          <div className="mt-8 grid gap-px bg-[color:var(--line)] sm:grid-cols-2">
            {V2_ITEMS.map(item => (
              <div key={item.title} className="bg-[color:var(--paper)] p-5">
                <div className="font-bold text-sm">{item.title}</div>
                <p className="mt-1.5 text-xs text-[color:var(--ink-2)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LATER ────────────────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <div className={`${mono} mb-4 inline-flex items-center gap-2 border-2 border-[color:var(--line-strong)] px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-[color:var(--ink-2)]`}>
            later
          </div>
          <h2 className={`${display} text-2xl font-black sm:text-3xl`}>Production-grade &amp; ecosystem</h2>
          <div className="mt-8 grid gap-px bg-[color:var(--line)] sm:grid-cols-2 lg:grid-cols-3">
            {LATER_ITEMS.map(item => (
              <div key={item.title} className="bg-[color:var(--paper-2)] p-5">
                <div className="font-bold text-sm">{item.title}</div>
                <p className="mt-1.5 text-xs text-[color:var(--ink-2)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEST RESULTS ─────────────────────────────────────────── */}
      <section className="px-6 py-14 bg-[color:var(--paper-2)]">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>test results · devnet · 10/10</p>
          <pre className="mt-6 overflow-x-auto border-2 border-[color:var(--line-strong)] p-5 text-xs leading-relaxed"
            style={{ background: "var(--code-bg)", color: "var(--code-fg)" }}>
            <code className={`${mono}`}>{TEST_OUTPUT}</code>
          </pre>
        </div>
      </section>

    </main>
  );
}

const V1_ITEMS = [
  "Hook program with 3 checks (allowlist, per-tx, daily cap)",
  "Per-mint Policy PDA",
  "init_policy & update_policy admin instructions",
  "TypeScript SDK — deploy / mint / transfer / fetch",
  "Zod-schema'd actions for AI agent frameworks",
  "Devnet deploy + 10/10 tests passing",
];

const V2_ITEMS = [
  { title: "Pyth USD-denominated caps",  desc: "'$10/tx, $50/day' instead of raw token units. Automatic oracle-backed conversion at transfer time." },
  { title: "Plain-English policy DSL",   desc: "\"Agent can spend up to $100/day to approved suppliers\" — compiled to on-chain Policy PDA." },
  { title: "USDC policy-wrapper mint",   desc: "Deposit USDC, get policy-USDC. Drop-in replacement for any agent already holding USDC." },
  { title: "Per-counterparty caps",      desc: "\"Max $50/day to vendor X, $200/day to vendor Y\" — granular per-destination limits." },
  { title: "Ephemeral approvals",        desc: "Time-limited one-off approvals that expire on-chain without admin action." },
  { title: "Onleash Studio",             desc: "UI to author, preview, and deploy policies before minting — no code required." },
];

const LATER_ITEMS = [
  { title: "Mainnet deployment",           desc: "Full audit by a recognized Solana security firm before mainnet GA." },
  { title: "Multisig upgrade authority",   desc: "Squads 2-of-3 instead of single deployer key." },
  { title: "solana-agent-kit upstream PR", desc: "Onleash ships as a first-class plugin in every agent built on the kit." },
  { title: "Companion guards",             desc: "Permanent-delegate, policy-gated burn, close-account guard — closes gaps in the honest scope." },
  { title: "DEX compatibility matrix",     desc: "Verified support for Orca Whirlpools, Meteora DLMM, Raydium permissionless pools." },
];

const TEST_OUTPUT = `onleash-hook
  ✔ creates mint with transfer-hook extension               (728ms)
  ✔ creates source + 2 destination ATAs and mints supply    (711ms)
  ✔ initializes ExtraAccountMetaList                        (518ms)
  ✔ initializes Policy with allowlist, per_tx=10, daily=50
  ✔ PASS: transfers 5 tokens to allowlisted destination     (909ms)
  ✔ FAIL: transfer to attacker dest → DestinationNotAllowed (6001)
  ✔ FAIL: transfer 20 > per_tx_max=10 → ExceedsPerTxMax    (6002)
  ✔ FAIL: cumulative transfers exceed daily cap             (6003)
  ✔ FAIL: non-authority update_policy → Unauthorized        (6005)
  ✔ PASS: authority raises daily_cap via update_policy

10 passing (8s)`;
