const mono = "font-[family-name:var(--font-mono-family)]";
const display = "font-[family-name:var(--font-display-family)]";

export default function Integrate() {
  return (
    <main style={{ background: "var(--paper)", color: "var(--ink)" }}>

      {/* ── HEADER ───────────────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 pt-14 pb-16">
        <div className="mx-auto max-w-5xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>Integration</p>
          <h1 className={`${display} mt-4 max-w-3xl text-4xl font-black sm:text-6xl`}>
            Integrate in 5 lines.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[color:var(--ink-2)]">
            <code className={`${mono} text-sm bg-[color:var(--paper-3)] px-1.5 py-0.5`}>@onleash/sdk</code> is a TypeScript SDK that wraps the Anchor program.
            Works standalone or as a solana-agent-kit plugin with Zod-schema&apos;d AI tool actions.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="https://github.com/amalia020/onleash" target="_blank" rel="noreferrer"
              className={`${mono} inline-flex items-center gap-2 border-2 border-[color:var(--line-strong)] px-4 py-2 text-xs uppercase tracking-[0.16em] text-[color:var(--ink-2)] hover:border-[color:var(--brand-line)] hover:text-[color:var(--brand)] transition-colors`}>
              GitHub →
            </a>
            <a href="https://explorer.solana.com/address/7vJ2fa6dr3Tnx8whNAepUMmpytAnEZxcASMyH2jAuG7v?cluster=devnet" target="_blank" rel="noreferrer"
              className={`${mono} inline-flex items-center gap-2 border-2 border-[color:var(--line-strong)] px-4 py-2 text-xs uppercase tracking-[0.16em] text-[color:var(--ink-2)] hover:border-[color:var(--brand-line)] hover:text-[color:var(--brand)] transition-colors`}>
              Program on devnet →
            </a>
          </div>
        </div>
      </section>

      {/* ── INSTALL ──────────────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>Install</SectionLabel>
          <Code>{`pnpm add github:amalia020/onleash @solana/web3.js @solana/spl-token`}</Code>
        </div>
      </section>

      {/* ── COMPATIBILITY ───────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-10 bg-[color:var(--paper-2)]">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between">
          <div>
            <p className="font-[family-name:var(--font-mono-family)] text-[10px] uppercase tracking-[0.2em] text-[color:var(--brand)]">✓ Orca Whirlpools compatible</p>
            <p className="mt-1 text-sm text-[color:var(--ink-2)] max-w-xl">Onleash-protected tokens work in Orca pools via TokenBadge. Policy enforcement doesn&apos;t break DeFi composability — your agent can still swap through the deepest Solana liquidity.</p>
          </div>
          <a href="https://github.com/amalia020/onleash" target="_blank" rel="noreferrer"
            className="font-[family-name:var(--font-mono-family)] flex-shrink-0 inline-flex items-center gap-2 border-2 border-[color:var(--line-strong)] px-4 py-2.5 text-xs uppercase tracking-[0.16em] text-[color:var(--ink-2)] hover:border-[color:var(--brand-line)] hover:text-[color:var(--brand)] transition-colors">
            View compatibility notes →
          </a>
        </div>
      </section>

      {/* ── QUICKSTART ───────────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-14 bg-[color:var(--paper-2)]">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>Quickstart</SectionLabel>
          <h2 className={`${display} mt-3 text-2xl font-black sm:text-3xl`}>Deploy a protected mint in 3 steps.</h2>
          <div className="mt-8 grid gap-6">
            <div>
              <StepLabel n={1}>Connect the client</StepLabel>
              <Code>{`import { Connection, Keypair } from "@solana/web3.js";
import { Wallet } from "@coral-xyz/anchor";
import { OnleashClient } from "@onleash/sdk";

const conn   = new Connection("https://api.devnet.solana.com", "confirmed");
const wallet = new Wallet(payer); // your Keypair
const client = new OnleashClient(conn, wallet);`}</Code>
            </div>
            <div>
              <StepLabel n={2}>Deploy a policy-protected mint</StepLabel>
              <Code>{`const { mint, policy, signatures } = await client.deployProtectedMint({
  decimals:  6,
  perTxMax:  10n * 1_000_000n,   // 10 tokens per transfer
  dailyCap:  50n * 1_000_000n,   // 50 tokens per 24h rolling window
  allowlist: [approvedPoolATA],  // up to 8 approved destinations
});
// Every transfer of this mint now runs the on-chain hook.`}</Code>
            </div>
            <div>
              <StepLabel n={3}>Send a transfer — hook validates automatically</StepLabel>
              <Code>{`// This throws if the policy is violated. The chain reverts atomically.
await client.transfer({
  mint,
  source:      sourceATA,
  destination: approvedPoolATA,
  owner:       payer,
  amount:      5n * 1_000_000n,
  decimals:    6,
});`}</Code>
            </div>
          </div>
        </div>
      </section>


      {/* ── ERROR HANDLING ───────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>Error handling</SectionLabel>
          <h2 className={`${display} mt-3 text-2xl font-black sm:text-3xl`}>
            Every policy violation throws a typed error.
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-[color:var(--ink-2)]">
            The chain reverts atomically — funds never move. Parse the error code from the
            transaction logs to give your users a clear message.
          </p>
          <Code>{`import { OnleashClient, OnleashError } from "@onleash/sdk";

try {
  await client.transfer({
    mint,
    source:      sourceATA,
    destination: someATA,
    owner:       payer,
    amount:      5n * 1_000_000n,
    decimals:    6,
  });
} catch (err: any) {
  const msg = err?.message ?? String(err);

  if (/6001|DestinationNotAllowed/.test(msg)) {
    // destination not in allowlist — check your allowlist or add the ATA
    console.error("Blocked: destination not approved");
  } else if (/6002|ExceedsPerTxMax/.test(msg)) {
    // single transfer too large — split into smaller amounts
    console.error("Blocked: amount exceeds per-tx cap");
  } else if (/6003|ExceedsDailyCap/.test(msg)) {
    // daily budget exhausted — wait for the 24h window to roll over
    console.error("Blocked: daily cap reached");
  } else if (/6007|PolicyPaused/.test(msg)) {
    // authority paused the policy — contact the mint authority
    console.error("Blocked: policy is paused");
  } else if (/6008|CooldownActive/.test(msg)) {
    // too soon after last transfer — respect the cooldown_secs interval
    console.error("Blocked: cooldown active, retry later");
  } else if (/6009|ExceedsTransferCount/.test(msg)) {
    // daily transfer count limit hit — wait for window to reset
    console.error("Blocked: daily transfer count exceeded");
  } else {
    throw err; // unexpected — rethrow
  }
}`}</Code>
          <div className="mt-6 border-2 border-[color:var(--line)] p-5 bg-[color:var(--paper-2)]">
            <p className={`${mono} text-[10px] uppercase tracking-[0.16em] text-[color:var(--brand)] mb-3`}>tip · pre-flight check</p>
            <p className="text-sm text-[color:var(--ink-2)] leading-relaxed">
              Call <code className={`${mono} text-xs bg-[color:var(--paper-3)] px-1 py-0.5`}>client.fetchPolicy(mint)</code> before
              sending to read current caps, allowlist, and <code className={`${mono} text-xs bg-[color:var(--paper-3)] px-1 py-0.5`}>spentToday</code>.
              The chain enforces anyway — this just gives you a clearer error message before the transaction lands.
            </p>
          </div>
        </div>
      </section>

      {/* ── AI AGENT ACTIONS ─────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>AI agent actions</SectionLabel>
          <h2 className={`${display} mt-3 text-2xl font-black sm:text-3xl`}>Drop into solana-agent-kit, Vercel AI, or LangChain.</h2>
          <p className="mt-4 max-w-2xl text-sm text-[color:var(--ink-2)]">
            <code className={`${mono} text-xs bg-[color:var(--paper-3)] px-1.5 py-0.5`}>createOnleashActions(client)</code> returns four
            Zod-schema&apos;d tool actions ready for any LLM framework.
          </p>
          <Code>{`import { createOnleashActions } from "@onleash/sdk";

// solana-agent-kit
const tools = createVercelAITools(agent, [...createOnleashActions(client)]);

// LangChain
const tools = createLangchainTools(agent, [...createOnleashActions(client)]);`}</Code>
          <div className="mt-8 grid gap-px bg-[color:var(--line)] sm:grid-cols-2">
            {ACTIONS.map(a => (
              <div key={a.name} className="bg-[color:var(--paper)] p-5">
                <code className={`${mono} text-xs text-[color:var(--brand)]`}>{a.name}</code>
                <p className="mt-2 text-sm text-[color:var(--ink-2)]">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── API REFERENCE ────────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-14 bg-[color:var(--paper-2)]">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>API reference · OnleashClient</SectionLabel>
          <div className="mt-6 grid gap-px bg-[color:var(--line)]">
            {API_METHODS.map(m => (
              <div key={m.method} className="bg-[color:var(--paper)] p-5 grid gap-3 sm:grid-cols-[180px_1fr] sm:gap-6 sm:items-start">
                <code className={`${mono} text-sm text-[color:var(--brand)] break-all`}>{m.method}</code>
                <p className="text-sm text-[color:var(--ink-2)]">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POLICY SCHEMA ────────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>Policy schema</SectionLabel>
          <p className="mt-3 text-sm text-[color:var(--ink-2)]">PDA seeds: <code className={`${mono} text-xs bg-[color:var(--paper-3)] px-1.5 py-0.5`}>[b&quot;policy&quot;, mint.key().as_ref()]</code></p>
          <div className="mt-6 border-2 border-[color:var(--line)] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[color:var(--line)] bg-[color:var(--paper-2)]">
                  <th className={`${mono} p-3 text-left text-[10px] uppercase tracking-[0.16em] text-[color:var(--ink-2)]`}>Field</th>
                  <th className={`${mono} p-3 text-left text-[10px] uppercase tracking-[0.16em] text-[color:var(--ink-2)]`}>Type</th>
                  <th className="p-3 text-left text-[10px] uppercase tracking-[0.16em] text-[color:var(--ink-2)]">Notes</th>
                </tr>
              </thead>
              <tbody>
                {POLICY_FIELDS.map((f, i) => (
                  <tr key={f.field} className={i < POLICY_FIELDS.length - 1 ? "border-b border-[color:var(--line)]" : ""}>
                    <td className={`${mono} p-3 text-xs text-[color:var(--brand)]`}>{f.field}</td>
                    <td className={`${mono} p-3 text-xs text-[color:var(--ink-2)]`}>{f.type}</td>
                    <td className="p-3 text-xs text-[color:var(--ink-2)]">{f.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── ERROR CODES ──────────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-14 bg-[color:var(--paper-2)]">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>Error codes</SectionLabel>
          <div className="mt-6 border-2 border-[color:var(--line)] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[color:var(--line)] bg-[color:var(--paper-3)]">
                  <th className={`${mono} p-3 text-left text-[10px] uppercase tracking-[0.16em] text-[color:var(--ink-2)]`}>Code</th>
                  <th className={`${mono} p-3 text-left text-[10px] uppercase tracking-[0.16em] text-[color:var(--ink-2)]`}>Name</th>
                  <th className="p-3 text-left text-[10px] uppercase tracking-[0.16em] text-[color:var(--ink-2)]">Meaning</th>
                </tr>
              </thead>
              <tbody>
                {ERROR_CODES.map((e, i) => (
                  <tr key={e.code} className={i < ERROR_CODES.length - 1 ? "border-b border-[color:var(--line)]" : ""}>
                    <td className={`${mono} p-3 text-sm text-[color:var(--brand)]`}>{e.code}</td>
                    <td className={`${mono} p-3 text-xs text-[color:var(--ink)]`}>{e.name}</td>
                    <td className="p-3 text-xs text-[color:var(--ink-2)]">{e.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>


      {/* ── SPEND-LOG WEBHOOK ────────────────────────────────────── */}
      <section className="border-b border-[color:var(--line)] px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>Spend-log webhook</SectionLabel>
          <h2 className={`${display} mt-3 text-2xl font-black sm:text-3xl`}>
            Get notified on every policy violation.
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-[color:var(--ink-2)]">
            <code className={`${mono} text-xs bg-[color:var(--paper-3)] px-1.5 py-0.5`}>client.watchViolations()</code> subscribes
            to on-chain logs and POSTs a structured payload to any URL you configure — your Slack bot,
            PagerDuty, custom dashboard, or serverless function. No polling. Fires within one slot of the rejected transaction.
          </p>
          <Code>{`import { OnleashClient } from "@onleash/sdk";

const client = new OnleashClient(connection, wallet);

// Watch a specific mint — fires on every policy violation for that mint
const unsub = client.watchViolations({
  mint:       myMint,
  webhookUrl: "https://your-server.com/onleash-webhook",
  onViolation: (v) => console.log("blocked:", v.errorName, v.signature),
});

// Watch ALL onleash mints (omit mint param)
const unsubAll = client.watchViolations({
  webhookUrl: "https://your-server.com/onleash-webhook",
});

// Stop listening
unsub();`}</Code>

          <div className="mt-8 border-2 border-[color:var(--line)] overflow-x-auto">
            <div className="border-b border-[color:var(--line)] px-5 py-3 bg-[color:var(--paper-2)]">
              <p className={`${mono} text-[10px] uppercase tracking-[0.16em] text-[color:var(--ink-2)]`}>Webhook payload · ViolationEvent</p>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {WEBHOOK_FIELDS.map((f, i) => (
                  <tr key={f.field} className={i < WEBHOOK_FIELDS.length - 1 ? "border-b border-[color:var(--line)]" : ""}>
                    <td className={`${mono} p-3 text-xs text-[color:var(--brand)] whitespace-nowrap`}>{f.field}</td>
                    <td className={`${mono} p-3 text-xs text-[color:var(--ink-2)] whitespace-nowrap`}>{f.type}</td>
                    <td className="p-3 text-xs text-[color:var(--ink-2)]">{f.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 border-2 border-[color:var(--line)] p-5 bg-[color:var(--paper-2)]">
            <p className={`${mono} text-[10px] uppercase tracking-[0.16em] text-[color:var(--brand)] mb-2`}>Example payload</p>
            <Code>{`{
  "signature":    "5KtP...q8Wz",
  "errorCode":    6001,
  "errorName":    "DestinationNotAllowed",
  "errorMessage": "Destination not in allowlist",
  "slot":         312847291,
  "observedAt":   "2026-05-06T14:22:01.483Z"
}`}</Code>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="border border-[color:var(--line)] p-5">
              <p className="font-bold text-sm mb-2">Slack alert example</p>
              <Code>{`// In your webhook receiver
app.post("/onleash-webhook", async (req, res) => {
  const v = req.body;
  await slack.chat.postMessage({
    channel: "#agent-alerts",
    text: \`Onleash blocked \${v.errorName} (\${v.errorCode})
\` +
          \`Tx: \${v.signature}\`,
  });
  res.sendStatus(200);
});`}</Code>
            </div>
            <div className="border border-[color:var(--line)] p-5">
              <p className="font-bold text-sm mb-2">Vercel serverless example</p>
              <Code>{`// app/api/onleash-webhook/route.ts
export async function POST(req: Request) {
  const v = await req.json();
  // log to your DB, alert system, etc.
  console.log(\`[\${v.errorName}] \${v.signature}\`);
  await db.violations.insert(v);
  return Response.json({ ok: true });
}`}</Code>
            </div>
          </div>
        </div>
      </section>

      {/* ── BUILD FROM SOURCE ────────────────────────────────────── */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>Build from source</SectionLabel>
          <Code>{`git clone https://github.com/amalia020/onleash.git
cd onleash && pnpm install

# Anchor program (Rust)
cd program && anchor build
anchor test --provider.cluster devnet --skip-local-validator

# SDK (TypeScript)
cd ../sdk && pnpm build
SOLANA_KEYPAIR=~/.config/solana/id.json pnpm smoke`}</Code>
          <p className="mt-4 text-sm text-[color:var(--ink-2)]">
            Requirements: Rust 1.79+, Solana CLI 3.1+, Anchor 1.0.2, Node 22+, pnpm 9+
          </p>
        </div>
      </section>

    </main>
  );
}

const WEBHOOK_FIELDS = [
  { field: "signature",    type: "string", desc: "Transaction signature of the reverted transfer — link to Solana Explorer" },
  { field: "errorCode",   type: "number", desc: "Numeric Anchor error code (6001–6009)" },
  { field: "errorName",   type: "string", desc: "Human-readable name e.g. DestinationNotAllowed" },
  { field: "errorMessage",type: "string", desc: "Full error message from the program" },
  { field: "slot",        type: "number", desc: "Solana slot the violation was observed in" },
  { field: "observedAt",  type: "string", desc: "ISO 8601 timestamp of off-chain observation" },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-[family-name:var(--font-mono-family)] text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]">{children}</p>;
}

function StepLabel({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="flex h-6 w-6 items-center justify-center bg-[color:var(--brand)] text-white text-xs font-bold flex-shrink-0">{n}</span>
      <span className="font-bold text-sm">{children}</span>
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre className="mt-4 overflow-x-auto border-2 border-[color:var(--line-strong)] p-5 text-xs leading-relaxed"
      style={{ background: "var(--code-bg)", color: "var(--code-fg)" }}>
      <code className="font-[family-name:var(--font-mono-family)]">{children}</code>
    </pre>
  );
}

const ACTIONS = [
  { name: "onleash_deploy_protected_mint", desc: "Create a new Token-2022 mint with the Onleash hook and initialize its on-chain Policy." },
  { name: "onleash_update_policy",         desc: "Update caps or allowlist on an existing Policy. Only the authority can call this." },
  { name: "onleash_get_policy",            desc: "Fetch the on-chain Policy for a mint. Returns caps, allowlist, and today's spend." },
  { name: "onleash_protected_transfer",    desc: "Send a hooked transfer. Chain validates allowlist + caps atomically before settling." },
];

const API_METHODS = [
  { method: "deployProtectedMint(params)",          desc: "Create a Token-2022 mint + ExtraAccountMetaList + Policy in three transactions. Returns mint address, policy PDA, and signatures." },
  { method: "mintTo({ mint, destinationOwner, amount })", desc: "Mint tokens to an ATA, creating the account if missing. Caller must be mint authority." },
  { method: "transfer({ mint, source, destination, owner, amount, decimals })", desc: "Send a hooked transfer via createTransferCheckedWithTransferHookInstruction. Throws on policy violation." },
  { method: "fetchPolicy(mint)",                    desc: "Read the on-chain Policy PDA. Returns authority, caps, allowlist, and spentToday." },
  { method: "ixInitPolicy(params)",                 desc: "Build the initPolicy instruction without sending. Useful for composing with other instructions." },
  { method: "ixUpdatePolicy(params)",               desc: "Build the updatePolicy instruction. Pass null fields to leave them unchanged." },
  { method: "policyPda(mint)",                      desc: "Derive the Policy PDA address for a given mint (seeds: [\"policy\", mint])." },
];

const POLICY_FIELDS = [
  { field: "authority",             type: "Pubkey",       notes: "Only this key can call update_policy" },
  { field: "mint",                  type: "Pubkey",       notes: "Bound at init — policy PDA is per-mint" },
  { field: "per_tx_max",            type: "u64",          notes: "Per-single-transfer cap, raw units" },
  { field: "daily_cap",             type: "u64",          notes: "Per 24h rolling window cap, raw units" },
  { field: "day_start_unix",        type: "i64",          notes: "Window anchor — auto-rolls when ≥86400s elapsed" },
  { field: "spent_today",           type: "u64",          notes: "Mutated atomically inside the hook" },
  { field: "transfers_today",       type: "u32",          notes: "Count of transfers in current 24h window" },
  { field: "destination_allowlist", type: "Vec<Pubkey>",  notes: "Up to 8 approved destination token accounts" },
  { field: "paused",                type: "bool",         notes: "true = all transfers halted; set via update_policy" },
  { field: "cooldown_secs",         type: "i64",          notes: "Min seconds between transfers; 0 = disabled" },
  { field: "last_transfer_unix",    type: "i64",          notes: "Timestamp of last successful transfer" },
  { field: "max_transfers_per_day", type: "u32",          notes: "Max transfer count per 24h window; 0 = unlimited" },
];

const ERROR_CODES = [
  { code: "6000", name: "NotTransferring",       meaning: "Hook called outside a transfer context" },
  { code: "6001", name: "DestinationNotAllowed", meaning: "Destination ATA not in destination_allowlist" },
  { code: "6002", name: "ExceedsPerTxMax",       meaning: "amount > per_tx_max" },
  { code: "6003", name: "ExceedsDailyCap",       meaning: "spent_today + amount > daily_cap" },
  { code: "6004", name: "AllowlistTooLong",      meaning: "Tried to set more than 8 allowlist entries" },
  { code: "6005", name: "Unauthorized",          meaning: "Non-authority called update_policy" },
  { code: "6006", name: "Overflow",              meaning: "u64 overflow in spent_today math" },
  { code: "6007", name: "PolicyPaused",          meaning: "paused=true — authority has halted all transfers" },
  { code: "6008", name: "CooldownActive",        meaning: "now < last_transfer_unix + cooldown_secs" },
  { code: "6009", name: "ExceedsTransferCount",  meaning: "transfers_today >= max_transfers_per_day" },
];
