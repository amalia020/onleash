const mono = "font-[family-name:var(--font-mono-family)]";
const display = "font-[family-name:var(--font-display-family)]";

export default function Roadmap() {
  return (
    <main style={{ background: "var(--paper)", color: "var(--ink)" }}>

      {/* ── HEADER */}
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
          <div className="mt-6 flex flex-wrap gap-4">
            <div className={`${mono} inline-flex items-center gap-2 bg-[color:var(--brand)] px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-white`}>
              13/13 tests · devnet
            </div>
            <div className={`${mono} inline-flex items-center gap-2 border-2 border-[color:var(--brand-line)] px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-[color:var(--brand)]`}>
              Mainnet target · Q3 2026
            </div>
          </div>
        </div>
      </section>

      {/* ── 3-COLUMN TABLE */}
      <section className="border-b border-[color:var(--line)] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-px bg-[color:var(--line)] sm:grid-cols-3">

            <div className="bg-[color:var(--paper)]">
              <div className="border-b border-[color:var(--line)] px-5 py-4 flex items-center gap-2">
                <span className="text-[color:var(--success)] font-bold">✓</span>
                <span className={`${mono} text-xs uppercase tracking-[0.16em] font-bold`}>Done</span>
              </div>
              <div className="divide-y divide-[color:var(--line)]">
                {DONE.map(item => (
                  <div key={item.title} className="px-5 py-4">
                    <div className="text-sm font-bold leading-snug">{item.title}</div>
                    <p className="mt-1 text-xs text-[color:var(--ink-2)] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[color:var(--paper-2)]">
              <div className="border-b border-[color:var(--line)] px-5 py-4 flex items-center gap-2">
                <span className="text-[color:var(--brand)] font-bold">●</span>
                <span className={`${mono} text-xs uppercase tracking-[0.16em] font-bold text-[color:var(--brand)]`}>In progress</span>
              </div>
              <div className="divide-y divide-[color:var(--line)]">
                {IN_PROGRESS.map(item => (
                  <div key={item.title} className="px-5 py-4">
                    <div className="text-sm font-bold leading-snug">{item.title}</div>
                    <p className="mt-1 text-xs text-[color:var(--ink-2)] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[color:var(--paper)]">
              <div className="border-b border-[color:var(--line)] px-5 py-4 flex items-center gap-2">
                <span className="text-[color:var(--ink-3)] font-bold">○</span>
                <span className={`${mono} text-xs uppercase tracking-[0.16em] font-bold text-[color:var(--ink-2)]`}>Planned</span>
              </div>
              <div className="divide-y divide-[color:var(--line)]">
                {PLANNED.map(item => (
                  <div key={item.title} className="px-5 py-4">
                    <div className="text-sm font-bold leading-snug">{item.title}</div>
                    <p className="mt-1 text-xs text-[color:var(--ink-2)] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── MAINNET ETA */}
      <section className="border-b border-[color:var(--line)] px-6 py-14 bg-[color:var(--paper-2)]">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>mainnet timeline</p>
          <h2 className={`${display} mt-4 text-2xl font-black sm:text-3xl`}>What gates mainnet GA.</h2>
          <div className="mt-8 grid gap-px bg-[color:var(--line)] sm:grid-cols-3">
            {MAINNET_GATES.map((g, i) => (
              <div key={g.label} className="bg-[color:var(--paper)] p-6">
                <div className={`${mono} text-[10px] uppercase tracking-[0.16em] text-[color:var(--brand)] mb-2`}>Gate {i + 1}</div>
                <div className="font-bold text-sm">{g.label}</div>
                <p className="mt-2 text-xs text-[color:var(--ink-2)] leading-relaxed">{g.desc}</p>
                <div className={`${mono} mt-3 text-[10px] uppercase tracking-[0.14em] ${g.done ? "text-[color:var(--success)]" : "text-[color:var(--ink-3)]"}`}>
                  {g.done ? "✓ complete" : g.eta}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEST RESULTS */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>test results · devnet · 13/13</p>
          <pre className="mt-6 overflow-x-auto border-2 border-[color:var(--line-strong)] p-5 text-xs leading-relaxed"
            style={{ background: "var(--code-bg)", color: "var(--code-fg)" }}>
            <code className={`${mono}`}>{TEST_OUTPUT}</code>
          </pre>
        </div>
      </section>

    </main>
  );
}

const DONE = [
  { title: "Hook program — 6 checks",     desc: "Allowlist, per-tx cap, daily cap, pause, cooldown, transfer count. All atomic." },
  { title: "Per-mint Policy PDA",          desc: 'Seeds: ["policy", mint]. One policy per mint, authority-controlled.' },
  { title: "init_policy + update_policy",  desc: "Admin instructions. All 6 policy fields updatable in one tx." },
  { title: "TypeScript SDK",               desc: "deployProtectedMint, mintTo, transfer, fetchPolicy, ixInitPolicy, ixUpdatePolicy." },
  { title: "AI agent actions",             desc: "5 Zod-schema actions for solana-agent-kit, Vercel AI, LangChain." },
  { title: "pay.sh x402 integration",      desc: "ONLEASH_PAY_SH_PAYMENT action — blocks payment hijack via 402 redirect." },
  { title: "solana-agent-kit PR #565",     desc: "Plugin open for review. Drop-in for every agent on the kit." },
  { title: "Devnet deploy — 13/13 tests",  desc: "Program ID: 7vJ2fa6dr3Tnx8whNAepUMmpytAnEZxcASMyH2jAuG7v" },
  { title: "Orca Whirlpools compatible",   desc: "Protected tokens work in Orca pools via TokenBadge." },
];

const IN_PROGRESS = [
  { title: "Mainnet deployment",        desc: "Anchor deploy to mainnet-beta. Smoke test: 1 pass + 1 revert tx on Explorer." },
  { title: "Squads upgrade authority",  desc: "Moving from single deployer key to 2-of-3 multisig before GA." },
  { title: "Security threat model",     desc: "Documented attack scenarios, honest scope, and v1 limitations." },
  { title: "Live demo — /demo page",    desc: "Real devnet reverts end-to-end, no mocks, <10s round trip." },
];

const PLANNED = [
  { title: "OtterSec / Neodyme audit",        desc: "Full program audit before mainnet GA recommendation to projects." },
  { title: "Spend-log webhook",               desc: "POST to dev-configured URL on every TransferHookViolation." },
  { title: "Pyth USD-denominated caps",       desc: "'$10/tx, $50/day' instead of raw token units. Oracle-backed at transfer time." },
  { title: "Per-counterparty caps",           desc: "Granular per-destination limits within the same policy." },
  { title: "Ephemeral time-locked approvals", desc: "One-off approvals that expire on-chain without admin action." },
  { title: "Policy composer UI",              desc: "Plain-English rule compiled to Policy PDA. No code required." },
  { title: "Companion guards",               desc: "Policy-gated burn, close-account guard — closes honest scope gaps." },
  { title: "CI/CD + SDK publish",            desc: "GitHub Actions: Anchor test on PR, SDK publish on tag." },
];

const MAINNET_GATES = [
  { label: "13/13 devnet tests", desc: "All 6 policy checks verified with real on-chain transactions on devnet.", done: true,  eta: "" },
  { label: "Mainnet smoke test", desc: "1 passing + 1 reverting transfer on mainnet-beta, both signatures on Explorer.", done: false, eta: "ETA: Q2 2026" },
  { label: "Security audit",     desc: "OtterSec or Neodyme review of the hook program before GA recommendation.", done: false, eta: "ETA: Q3 2026" },
];

const TEST_OUTPUT = `onleash-hook
  13 passing (11s)
  ✔ creates mint with transfer-hook extension
  ✔ creates source + destination ATAs and mints supply
  ✔ initializes ExtraAccountMetaList
  ✔ initializes Policy
  ✔ PASS: transfer to allowlisted destination
  ✔ FAIL: attacker dest → DestinationNotAllowed (6001)
  ✔ FAIL: amount > per_tx_max → ExceedsPerTxMax (6002)
  ✔ FAIL: cumulative > daily_cap → ExceedsDailyCap (6003)
  ✔ FAIL: non-authority update → Unauthorized (6005)
  ✔ PASS: authority raises daily_cap
  ✔ FAIL: paused → PolicyPaused (6007)
  ✔ FAIL: too soon → CooldownActive (6008)
  ✔ FAIL: count exceeded → ExceedsTransferCount (6009)`;
