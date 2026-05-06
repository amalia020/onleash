import Link from "next/link";

const mono = "font-[family-name:var(--font-mono-family)]";
const display = "font-[family-name:var(--font-display-family)]";

export default function Security() {
  return (
    <main style={{ background: "var(--paper)", color: "var(--ink)" }}>

      {/* ── HEADER */}
      <section className="border-b border-[color:var(--line)] px-6 pt-14 pb-16">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>Security · Threat model</p>
          <h1 className={`${display} mt-4 max-w-3xl text-4xl font-black sm:text-6xl`}>
            What Onleash stops.<br />What it doesn&apos;t.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[color:var(--ink-2)]">
            This is the honest scope of v1. No security claims beyond what the code
            actually enforces on-chain today.
          </p>
          <div className={`${mono} mt-4 inline-flex items-center gap-2 border border-[color:var(--line-strong)] px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-[color:var(--ink-2)]`}>
            Audit status: not yet audited · devnet only
          </div>
        </div>
      </section>

      {/* ── THREAT SCENARIOS */}
      <section className="border-b border-[color:var(--line)] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>attack scenarios</p>
          <h2 className={`${display} mt-4 text-2xl font-black sm:text-3xl`}>Attacks Onleash blocks.</h2>
          <div className="mt-8 grid gap-px bg-[color:var(--line)]">
            {BLOCKED.map((s) => (
              <div key={s.attack} className="bg-[color:var(--paper)] p-6 grid sm:grid-cols-[1fr_1fr_auto] gap-4 sm:gap-8 sm:items-start">
                <div>
                  <div className={`${mono} text-[10px] uppercase tracking-[0.16em] text-red-400 mb-1`}>Attack</div>
                  <div className="font-bold text-sm">{s.attack}</div>
                  <p className="mt-1 text-xs text-[color:var(--ink-2)] leading-relaxed">{s.how}</p>
                </div>
                <div>
                  <div className={`${mono} text-[10px] uppercase tracking-[0.16em] text-[color:var(--brand)] mb-1`}>Onleash response</div>
                  <p className="text-xs text-[color:var(--ink-2)] leading-relaxed">{s.defence}</p>
                </div>
                <div className={`${mono} text-[10px] uppercase tracking-[0.14em] text-[color:var(--brand)] whitespace-nowrap`}>
                  {s.code}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT IT DOES NOT STOP */}
      <section className="border-b border-[color:var(--line)] px-6 py-16 bg-[color:var(--paper-2)]">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>honest limitations</p>
          <h2 className={`${display} mt-4 text-2xl font-black sm:text-3xl`}>What v1 does not protect.</h2>
          <p className="mt-4 max-w-2xl text-sm text-[color:var(--ink-2)]">
            These are real gaps. Knowing them lets you layer complementary defences.
          </p>
          <div className="mt-8 grid gap-px bg-[color:var(--line)] sm:grid-cols-2">
            {GAPS.map((g) => (
              <div key={g.title} className="bg-[color:var(--paper)] p-6">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-red-400 font-bold flex-shrink-0 mt-0.5">✗</span>
                  <div className="font-bold text-sm">{g.title}</div>
                </div>
                <p className="text-xs text-[color:var(--ink-2)] leading-relaxed ml-5">{g.desc}</p>
                {g.mitigation && (
                  <p className={`${mono} mt-2 text-[10px] uppercase tracking-[0.14em] text-[color:var(--ink-3)] ml-5`}>
                    Mitigation: {g.mitigation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST MODEL */}
      <section className="border-b border-[color:var(--line)] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>trust model</p>
          <h2 className={`${display} mt-4 text-2xl font-black sm:text-3xl`}>What you must trust for this to work.</h2>
          <div className="mt-8 grid gap-px bg-[color:var(--line)] sm:grid-cols-3">
            {TRUST.map((t) => (
              <div key={t.entity} className="bg-[color:var(--paper-2)] p-6">
                <div className={`${mono} text-[10px] uppercase tracking-[0.16em] text-[color:var(--brand)] mb-2`}>{t.entity}</div>
                <p className="text-xs text-[color:var(--ink-2)] leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AUDIT STATUS */}
      <section className="border-b border-[color:var(--line)] px-6 py-14 bg-[color:var(--paper-2)]">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>audit status</p>
          <h2 className={`${display} mt-4 text-2xl font-black sm:text-3xl`}>Not yet audited.</h2>
          <p className="mt-4 max-w-2xl text-sm text-[color:var(--ink-2)] leading-relaxed">
            Onleash v1 has not been audited by an independent security firm.
            The program is deployed on <strong>devnet only</strong>.
            Do not use it to protect real funds until a mainnet audit is complete.
            An OtterSec or Neodyme audit is planned before mainnet GA — see the{" "}
            <Link href="/roadmap" className="text-[color:var(--brand)] underline underline-offset-4">roadmap</Link>.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <a href="https://github.com/amalia020/onleash/blob/main/program/programs/onleash-hook/src/lib.rs"
              target="_blank" rel="noreferrer"
              className={`${mono} inline-flex items-center gap-2 border-2 border-[color:var(--line-strong)] px-4 py-3 text-xs uppercase tracking-[0.16em] text-[color:var(--ink-2)] hover:border-[color:var(--brand-line)] hover:text-[color:var(--brand)] transition-colors`}>
              Read hook program source →
            </a>
            <a href="https://github.com/amalia020/onleash/blob/main/program/tests/onleash-hook.ts"
              target="_blank" rel="noreferrer"
              className={`${mono} inline-flex items-center gap-2 border-2 border-[color:var(--line-strong)] px-4 py-3 text-xs uppercase tracking-[0.16em] text-[color:var(--ink-2)] hover:border-[color:var(--brand-line)] hover:text-[color:var(--brand)] transition-colors`}>
              Read 13 test cases →
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <div className={`${display} text-xl font-black`}>See how the checks work.</div>
            <p className="mt-1 text-sm text-[color:var(--ink-2)]">Full execution flow and policy schema on the how-it-works page.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/how-it-works"
              className={`${mono} inline-flex items-center gap-2 border-2 border-[color:var(--brand)] bg-[color:var(--brand)] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-white hover:bg-[color:var(--brand-2)] transition-colors`}>
              How it works →
            </Link>
            <Link href="/demo"
              className={`${mono} inline-flex items-center gap-2 border-2 border-[color:var(--line-strong)] px-6 py-3.5 text-sm uppercase tracking-[0.16em] text-[color:var(--ink-2)] hover:border-[color:var(--brand-line)] hover:text-[color:var(--brand)] transition-colors`}>
              Run demo →
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

const BLOCKED = [
  {
    attack: "Jailbreak — destination redirect",
    how: "Attacker tricks agent into sending to an unapproved address via prompt injection or LLM manipulation.",
    defence: "Hook checks destination against allowlist before any funds move. Transfer reverts atomically.",
    code: "6001 DestinationNotAllowed",
  },
  {
    attack: "Single oversized exfiltration",
    how: "Agent signs a single transfer for the full wallet balance in one transaction.",
    defence: "per_tx_max cap rejects any transfer above the configured ceiling.",
    code: "6002 ExceedsPerTxMax",
  },
  {
    attack: "Gradual drain across many transfers",
    how: "Agent makes many small transfers, each individually under per_tx_max, draining the wallet over time.",
    defence: "24h rolling daily_cap and max_transfers_per_day together bound total daily outflow.",
    code: "6003 / 6009",
  },
  {
    attack: "Rapid-fire micro-drain",
    how: "Agent submits hundreds of minimum-value transfers per second before daily cap is reached.",
    defence: "cooldown_secs enforces a minimum interval between transfers, regardless of amount.",
    code: "6008 CooldownActive",
  },
  {
    attack: "pay.sh / x402 payment hijack",
    how: "Jailbroken agent receives a fake HTTP 402 challenge from an attacker and routes payment there.",
    defence: "Attacker address is not in the allowlist. Hook rejects the transfer before settlement.",
    code: "6001 DestinationNotAllowed",
  },
  {
    attack: "Emergency drain after incident",
    how: "Suspicious activity detected — agent may be compromised and sending a stream of small transfers.",
    defence: "Authority sets paused=true in one transaction. All transfers halt immediately on-chain.",
    code: "6007 PolicyPaused",
  },
];

const GAPS = [
  {
    title: "Native SOL transfers",
    desc: "The hook only fires on Token-2022 transfers. A jailbroken agent holding SOL directly is not protected — it can send SOL to any address.",
    mitigation: "Hold value as policy-protected SPL tokens, not raw SOL",
  },
  {
    title: "MintTo and Burn",
    desc: "Hook does not fire on MintTo or Burn instructions. If the agent is also the mint authority, it could mint additional supply or burn tokens to zero.",
    mitigation: "Revoke mint authority after initial issuance (v2 companion guard)",
  },
  {
    title: "Legacy SPL Token mints",
    desc: "Transfer hooks are a Token-2022 extension. Existing SPL Token mints cannot be retrofitted — they need to be reissued as Token-2022.",
    mitigation: "Use deployProtectedMint to issue new Token-2022 mints",
  },
  {
    title: "Approve + delegate transfers",
    desc: "If the agent approves a delegate and that delegate initiates a transfer, the hook fires and policy applies — but the agent can grant unlimited delegate authority.",
    mitigation: "Monitor or restrict Approve instructions (v2 companion guard)",
  },
  {
    title: "CloseAccount",
    desc: "An agent can close its own token account and recover the rent lamports as SOL, bypassing the hook entirely.",
    mitigation: "Companion guard for CloseAccount (v2 roadmap)",
  },
  {
    title: "Program upgrade",
    desc: "The Onleash program currently has a single upgrade authority (deployer keypair). A compromised deployer could modify the hook logic.",
    mitigation: "Squads 2-of-3 multisig upgrade authority — in progress",
  },
];

const TRUST = [
  {
    entity: "Solana runtime",
    desc: "You trust Solana's Token-2022 program to invoke the hook correctly on every transfer. This is the foundational assumption — the hook is only as strong as the protocol that calls it.",
  },
  {
    entity: "Onleash program",
    desc: "You trust the deployed hook program implements the policy faithfully. Mitigated by open source code, 13 test cases, and a planned security audit.",
  },
  {
    entity: "Policy authority",
    desc: "You trust whoever holds the authority keypair to not maliciously update the policy. Mitigated by using a Squads multisig as authority instead of a single key.",
  },
];
