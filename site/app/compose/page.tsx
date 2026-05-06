"use client";

import { useState } from "react";

const mono = "font-[family-name:var(--font-mono-family)]";
const display = "font-[family-name:var(--font-display-family)]";

type Step = 1 | 2 | 3 | 4 | 5;

interface PolicyConfig {
  perTxMax: number;
  dailyCap: number;
  allowlist: string[];
  paused: boolean;
  cooldownSecs: number;
  maxTransfersPerDay: number;
  decimals: number;
}

const DEFAULT: PolicyConfig = {
  perTxMax: 100,
  dailyCap: 1000,
  allowlist: [],
  paused: false,
  cooldownSecs: 0,
  maxTransfersPerDay: 0,
  decimals: 6,
};

const U64_MAX = "18446744073709551615n";

function toRaw(tokens: number, decimals: number): string {
  if (tokens === 0) return U64_MAX; // 0 = no limit
  return `${tokens}n * ${"1" + "0".repeat(decimals)}n`;
}

function generateCode(cfg: PolicyConfig): string {
  const lines = [
    `import { Connection, Keypair } from "@solana/web3.js";`,
    `import { Wallet } from "@coral-xyz/anchor";`,
    `import { OnleashClient } from "@onleash/sdk";`,
    ``,
    `const conn   = new Connection("https://api.devnet.solana.com", "confirmed");`,
    `const wallet = new Wallet(payer); // your Keypair`,
    `const client = new OnleashClient(conn, wallet);`,
    ``,
    `const { mint } = await client.deployProtectedMint({`,
    `  decimals:  ${cfg.decimals},`,
    `  perTxMax:  ${toRaw(cfg.perTxMax, cfg.decimals)},   // ${cfg.perTxMax === 0 ? "no limit (u64::MAX)" : cfg.perTxMax.toLocaleString() + " tokens max per transfer"}`,
    `  dailyCap:  ${toRaw(cfg.dailyCap, cfg.decimals)},   // ${cfg.dailyCap === 0 ? "no limit (u64::MAX)" : cfg.dailyCap.toLocaleString() + " tokens max per 24h"}`,
    `  allowlist: [${cfg.allowlist.map(a => `new PublicKey("${a}")`).join(", ") || "/* add approved ATAs */"}],`,
  ];
  if (cfg.cooldownSecs > 0) lines.push(`  cooldownSecs: ${cfg.cooldownSecs},              // ${cfg.cooldownSecs}s between transfers`);
  if (cfg.maxTransfersPerDay > 0) lines.push(`  maxTransfersPerDay: ${cfg.maxTransfersPerDay},          // max ${cfg.maxTransfersPerDay} transfers/day`);
  if (cfg.paused) lines.push(`  // Note: deploy then call updatePolicy({ paused: true }) to pause`);
  lines.push(`});`);
  lines.push(``);
  lines.push(`console.log("Protected mint:", mint.toBase58());`);
  return lines.join("\n");
}

function generateCli(cfg: PolicyConfig): string {
  return [
    `# 1. Install`,
    `pnpm add @onleash/sdk @solana/web3.js @coral-xyz/anchor`,
    ``,
    `# 2. Set your RPC + keypair`,
    `export SOLANA_KEYPAIR=~/.config/solana/id.json`,
    `export RPC_URL=https://api.devnet.solana.com`,
    ``,
    `# 3. Deploy protected mint`,
    `# perTxMax=${cfg.perTxMax} tokens · dailyCap=${cfg.dailyCap} tokens · allowlist=[${cfg.allowlist.join(", ") || "add addresses"}]`,
    `pnpm exec tsx scripts/deploy-mint.ts`,
  ].join("\n");
}

export default function Compose() {
  const [step, setStep] = useState<Step>(1);
  const [cfg, setCfg] = useState<PolicyConfig>(DEFAULT);
  const [newAddr, setNewAddr] = useState("");
  const [copied, setCopied] = useState(false);

  function next() { setStep(s => Math.min(5, s + 1) as Step); }
  function back() { setStep(s => Math.max(1, s - 1) as Step); }

  function addAddr() {
    const a = newAddr.trim();
    if (!a || cfg.allowlist.includes(a) || cfg.allowlist.length >= 8) return;
    setCfg(c => ({ ...c, allowlist: [...c.allowlist, a] }));
    setNewAddr("");
  }

  const code = generateCode(cfg);

  async function copy() {
    await navigator.clipboard.writeText(code.replace(/\\n/g, "\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main style={{ background: "var(--paper)", color: "var(--ink)" }}>

      {/* HEADER */}
      <section className="border-b border-[color:var(--line)] px-6 pt-14 pb-12">
        <div className="mx-auto max-w-4xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>Policy composer</p>
          <h1 className={`${display} mt-4 text-4xl font-black sm:text-5xl`}>
            Set your rules in plain English.<br />
            <span className="text-[color:var(--brand)]">Get deployable code.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-[color:var(--ink-2)]">
            Answer 4 questions. We compile them to an <code className={`${mono} text-sm bg-[color:var(--paper-3)] px-1 py-0.5`}>OnleashClient.deployProtectedMint()</code> call — ready to run.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-10 grid gap-8 lg:grid-cols-[1fr_400px]">

        {/* LEFT — STEPS */}
        <div>
          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {([1,2,3,4,5] as Step[]).map(s => (
              <div key={s} className="flex items-center gap-2">
                <button type="button" onClick={() => setStep(s)}
                  className={`${mono} flex h-7 w-7 items-center justify-center text-xs font-bold border-2 transition-colors
                    ${step === s ? "border-[color:var(--brand)] bg-[color:var(--brand)] text-white" :
                      s < step ? "border-[color:var(--brand)] text-[color:var(--brand)]" :
                      "border-[color:var(--line)] text-[color:var(--ink-3)]"}`}>
                  {s < step ? "✓" : s}
                </button>
                {s < 5 && <div className={`h-[2px] w-6 ${s < step ? "bg-[color:var(--brand)]" : "bg-[color:var(--line)]"}`} />}
              </div>
            ))}
            <span className={`${mono} ml-2 text-[10px] uppercase tracking-[0.14em] text-[color:var(--ink-2)]`}>
              {["Spend limits","Daily limits","Approved addresses","Extra controls","Review"][step-1]}
            </span>
          </div>

          {/* Step 1 — per-tx */}
          {step === 1 && (
            <div className="border-2 border-[color:var(--line)] p-6">
              <h2 className={`${display} text-xl font-black mb-2`}>How much can the agent spend per transfer?</h2>
              <p className="text-sm text-[color:var(--ink-2)] mb-6">This is the single hardest limit. No single transfer can exceed it — no matter what the agent signs.</p>
              <div className="flex flex-col gap-4">
                {/* No limit option */}
                <label className={`flex items-center gap-3 border-2 p-4 cursor-pointer transition-colors ${cfg.perTxMax === 0 ? "border-[color:var(--brand)] bg-[color:var(--paper-2)]" : "border-[color:var(--line)] hover:border-[color:var(--line-strong)]"}`}>
                  <input type="radio" name="perTxMax" value={0} checked={cfg.perTxMax === 0} onChange={() => setCfg(c => ({ ...c, perTxMax: 0 }))} className="accent-[color:var(--brand)]" />
                  <div>
                    <div className="font-bold text-sm">No limit</div>
                    <div className="text-xs text-[color:var(--ink-2)] mt-0.5">Per-tx check disabled — only daily cap and allowlist apply</div>
                  </div>
                </label>
                {[10, 50, 100, 500, 1_000, 10_000, 100_000].map(v => (
                  <label key={v} className={`flex items-center gap-3 border-2 p-4 cursor-pointer transition-colors ${cfg.perTxMax === v ? "border-[color:var(--brand)] bg-[color:var(--paper-2)]" : "border-[color:var(--line)] hover:border-[color:var(--line-strong)]"}`}>
                    <input type="radio" name="perTxMax" value={v} checked={cfg.perTxMax === v} onChange={() => setCfg(c => ({ ...c, perTxMax: v }))} className="accent-[color:var(--brand)]" />
                    <div>
                      <div className="font-bold text-sm">{v.toLocaleString()} tokens per transfer</div>
                      <div className="text-xs text-[color:var(--ink-2)] mt-0.5">{toRaw(v, cfg.decimals)} raw units · error 6002 on breach</div>
                    </div>
                  </label>
                ))}
                <label className={`flex items-center gap-3 border-2 p-4 cursor-pointer transition-colors ${cfg.perTxMax > 0 && ![10,50,100,500,1_000,10_000,100_000].includes(cfg.perTxMax) ? "border-[color:var(--brand)] bg-[color:var(--paper-2)]" : "border-[color:var(--line)] hover:border-[color:var(--line-strong)]"}`}>
                  <input type="radio" name="perTxMax" checked={cfg.perTxMax > 0 && ![10,50,100,500,1_000,10_000,100_000].includes(cfg.perTxMax)} onChange={() => {}} className="accent-[color:var(--brand)]" />
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm font-bold">Custom:</span>
                    <input type="number" min={1} value={cfg.perTxMax || ""}
                      placeholder="e.g. 250"
                      onChange={e => setCfg(c => ({ ...c, perTxMax: Math.max(1, Number(e.target.value)) }))}
                      className={`${mono} w-32 border border-[color:var(--line-strong)] bg-transparent px-2 py-1 text-sm outline-none focus:border-[color:var(--brand)]`} />
                    <span className="text-sm text-[color:var(--ink-2)]">tokens</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Step 2 — daily cap */}
          {step === 2 && (
            <div className="border-2 border-[color:var(--line)] p-6">
              <h2 className={`${display} text-xl font-black mb-2`}>How much can the agent spend per day?</h2>
              <p className="text-sm text-[color:var(--ink-2)] mb-6">24h rolling window. Resets automatically — no admin action needed.</p>
              <div className="flex flex-col gap-3">
                <label className={`flex items-center gap-3 border-2 p-4 cursor-pointer transition-colors ${cfg.dailyCap === 0 ? "border-[color:var(--brand)] bg-[color:var(--paper-2)]" : "border-[color:var(--line)] hover:border-[color:var(--line-strong)]"}`}>
                  <input type="radio" name="dailyCap" value={0} checked={cfg.dailyCap === 0} onChange={() => setCfg(c => ({ ...c, dailyCap: 0 }))} className="accent-[color:var(--brand)]" />
                  <div>
                    <div className="font-bold text-sm">No daily limit</div>
                    <div className="text-xs text-[color:var(--ink-2)] mt-0.5">Daily cap disabled — only per-tx max and allowlist apply</div>
                  </div>
                </label>
                {[100, 500, 1_000, 5_000, 10_000, 100_000, 1_000_000].map(v => (
                  <label key={v} className={`flex items-center gap-3 border-2 p-4 cursor-pointer transition-colors ${cfg.dailyCap === v ? "border-[color:var(--brand)] bg-[color:var(--paper-2)]" : "border-[color:var(--line)] hover:border-[color:var(--line-strong)]"}`}>
                    <input type="radio" name="dailyCap" value={v} checked={cfg.dailyCap === v} onChange={() => setCfg(c => ({ ...c, dailyCap: v }))} className="accent-[color:var(--brand)]" />
                    <div>
                      <div className="font-bold text-sm">{v.toLocaleString()} tokens per 24h</div>
                      <div className="text-xs text-[color:var(--ink-2)] mt-0.5">
                        {cfg.perTxMax > 0 ? `${Math.floor(v / cfg.perTxMax)} max transfers at current per-tx limit · ` : ""}error 6003
                      </div>
                    </div>
                  </label>
                ))}
                <label className={`flex items-center gap-3 border-2 p-4 cursor-pointer transition-colors ${cfg.dailyCap > 0 && ![100,500,1_000,5_000,10_000,100_000,1_000_000].includes(cfg.dailyCap) ? "border-[color:var(--brand)] bg-[color:var(--paper-2)]" : "border-[color:var(--line)] hover:border-[color:var(--line-strong)]"}`}>
                  <input type="radio" name="dailyCap" checked={cfg.dailyCap > 0 && ![100,500,1_000,5_000,10_000,100_000,1_000_000].includes(cfg.dailyCap)} onChange={() => {}} className="accent-[color:var(--brand)]" />
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm font-bold">Custom:</span>
                    <input type="number" min={1} value={cfg.dailyCap || ""}
                      placeholder="e.g. 2500"
                      onChange={e => setCfg(c => ({ ...c, dailyCap: Math.max(1, Number(e.target.value)) }))}
                      className={`${mono} w-32 border border-[color:var(--line-strong)] bg-transparent px-2 py-1 text-sm outline-none focus:border-[color:var(--brand)]`} />
                    <span className="text-sm text-[color:var(--ink-2)]">tokens / 24h</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Step 3 — allowlist */}
          {step === 3 && (
            <div className="border-2 border-[color:var(--line)] p-6">
              <h2 className={`${display} text-xl font-black mb-2`}>Which addresses can receive payments?</h2>
              <p className="text-sm text-[color:var(--ink-2)] mb-6">Up to 8 approved token accounts. Anything not on this list will fail with error 6001 — atomically, on-chain.</p>
              <div className="flex flex-col gap-2 mb-4 min-h-[48px]">
                {cfg.allowlist.length === 0 && <p className={`${mono} text-xs text-[color:var(--ink-3)]`}>No addresses added yet. Add at least one.</p>}
                {cfg.allowlist.map((addr, i) => (
                  <div key={addr} className="flex items-center gap-2 bg-[color:var(--paper-2)] px-3 py-2">
                    <span className={`${mono} text-[10px] text-[color:var(--brand)] flex-shrink-0`}>{i + 1}.</span>
                    <span className={`${mono} text-xs text-[color:var(--ink)] truncate flex-1`}>{addr}</span>
                    <button type="button" onClick={() => setCfg(c => ({ ...c, allowlist: c.allowlist.filter(a => a !== addr) }))}
                      className="text-[color:var(--ink-3)] hover:text-red-400 text-sm flex-shrink-0">✕</button>
                  </div>
                ))}
              </div>
              {cfg.allowlist.length < 8 && (
                <div className="flex gap-2">
                  <input value={newAddr} onChange={e => setNewAddr(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addAddr()}
                    placeholder="Token account address (Base58)"
                    className={`${mono} flex-1 border border-[color:var(--line-strong)] bg-transparent px-3 py-2 text-xs outline-none focus:border-[color:var(--brand)]`} />
                  <button type="button" onClick={addAddr}
                    className={`${mono} border-2 border-[color:var(--brand)] px-4 py-2 text-xs font-bold text-[color:var(--brand)] hover:bg-[color:var(--brand)] hover:text-white transition-colors`}>
                    Add
                  </button>
                </div>
              )}
              <p className={`${mono} mt-2 text-[10px] text-[color:var(--ink-3)]`}>{cfg.allowlist.length}/8 addresses</p>
            </div>
          )}

          {/* Step 4 — extra controls */}
          {step === 4 && (
            <div className="border-2 border-[color:var(--line)] p-6">
              <h2 className={`${display} text-xl font-black mb-2`}>Any extra controls?</h2>
              <p className="text-sm text-[color:var(--ink-2)] mb-6">All optional. Leave at zero to disable.</p>
              <div className="flex flex-col gap-5">
                <div>
                  <label className="font-bold text-sm block mb-1">Transfer cooldown (seconds)</label>
                  <p className="text-xs text-[color:var(--ink-2)] mb-2">Minimum time between transfers. 0 = disabled.</p>
                  <div className="flex items-center gap-3">
                    <input type="range" min={0} max={3600} step={30} value={cfg.cooldownSecs}
                      onChange={e => setCfg(c => ({ ...c, cooldownSecs: Number(e.target.value) }))}
                      className="flex-1 accent-[color:var(--brand)]" />
                    <span className={`${mono} text-sm font-bold text-[color:var(--brand)] w-16 text-right`}>{cfg.cooldownSecs}s</span>
                  </div>
                </div>
                <div>
                  <label className="font-bold text-sm block mb-1">Max transfers per day</label>
                  <p className="text-xs text-[color:var(--ink-2)] mb-2">Caps the number of transfers regardless of value. 0 = unlimited.</p>
                  <div className="flex items-center gap-3">
                    <input type="range" min={0} max={100} value={cfg.maxTransfersPerDay}
                      onChange={e => setCfg(c => ({ ...c, maxTransfersPerDay: Number(e.target.value) }))}
                      className="flex-1 accent-[color:var(--brand)]" />
                    <span className={`${mono} text-sm font-bold text-[color:var(--brand)] w-16 text-right`}>{cfg.maxTransfersPerDay === 0 ? "unlimited" : cfg.maxTransfersPerDay}</span>
                  </div>
                </div>
                <div>
                  <label className="font-bold text-sm block mb-2">Token decimals</label>
                  <div className="flex gap-2">
                    {[0, 6, 9].map(d => (
                      <button key={d} type="button"
                        onClick={() => setCfg(c => ({ ...c, decimals: d }))}
                        className={`${mono} border-2 px-4 py-2 text-xs transition-colors ${cfg.decimals === d ? "border-[color:var(--brand)] bg-[color:var(--brand)] text-white" : "border-[color:var(--line)] hover:border-[color:var(--line-strong)]"}`}>
                        {d === 0 ? "0 (integer)" : d === 6 ? "6 (USDC-like)" : "9 (SOL-like)"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5 — review */}
          {step === 5 && (
            <div className="border-2 border-[color:var(--line)] p-6">
              <h2 className={`${display} text-xl font-black mb-4`}>Your policy</h2>
              <div className="grid gap-2 mb-6">
                {[
                  ["Per-tx max", cfg.perTxMax === 0 ? "not enforced" : `${cfg.perTxMax.toLocaleString()} tokens`, "6002"],
                  ["Daily cap", cfg.dailyCap === 0 ? "not enforced" : `${cfg.dailyCap.toLocaleString()} tokens / 24h`, "6003"],
                  ["Allowlist", cfg.allowlist.length === 0 ? "none (all transfers will fail)" : `${cfg.allowlist.length} address${cfg.allowlist.length !== 1 ? "es" : ""}`, "6001"],
                  ["Cooldown", cfg.cooldownSecs > 0 ? `${cfg.cooldownSecs}s between transfers` : "disabled", "6008"],
                  ["Max transfers/day", cfg.maxTransfersPerDay > 0 ? String(cfg.maxTransfersPerDay) : "unlimited", "6009"],
                  ["Decimals", String(cfg.decimals), "—"],
                ].map(([label, value, code]) => (
                  <div key={label} className="grid grid-cols-[1fr_auto] gap-4 items-center py-2 border-b border-[color:var(--line)] last:border-0">
                    <div>
                      <div className="text-sm font-bold">{label}</div>
                      <div className="text-xs text-[color:var(--ink-2)]">{value}</div>
                    </div>
                    <span className={`${mono} text-[10px] text-[color:var(--ink-3)]`}>{code}</span>
                  </div>
                ))}
              </div>
              {cfg.allowlist.length === 0 && (
                <div className="mb-4 border border-amber-500/40 bg-amber-500/5 px-4 py-3 text-xs text-amber-600">
                  Warning: no allowlist addresses set. Every transfer will fail with 6001.
                </div>
              )}
              <p className="text-sm text-[color:var(--ink-2)]">Ready to deploy. Copy the generated code →</p>
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex justify-between mt-6">
            <button type="button" onClick={back} disabled={step === 1}
              className={`${mono} border-2 border-[color:var(--line-strong)] px-5 py-2.5 text-xs uppercase tracking-[0.14em] disabled:opacity-30 hover:border-[color:var(--ink)] transition-colors`}>
              ← Back
            </button>
            {step < 5 ? (
              <button type="button" onClick={next}
                className={`${mono} border-2 border-[color:var(--brand)] bg-[color:var(--brand)] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white hover:bg-[color:var(--brand-2)] transition-colors`}>
                Next →
              </button>
            ) : (
              <button type="button" onClick={copy}
                className={`${mono} border-2 border-[color:var(--brand)] bg-[color:var(--brand)] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white hover:bg-[color:var(--brand-2)] transition-colors`}>
                {copied ? "Copied!" : "Copy code →"}
              </button>
            )}
          </div>
        </div>

        {/* RIGHT — LIVE CODE PREVIEW */}
        <div className="flex flex-col gap-4">
          <div className="border-2 border-[color:var(--line-strong)] flex-1" style={{ background: "var(--code-bg)" }}>
            <div className="border-b border-[color:var(--line-strong)] px-4 py-2.5 flex items-center justify-between">
              <span className={`${mono} text-[10px] uppercase tracking-[0.14em] text-[color:var(--ink-2)]`}>deploy.ts · live preview</span>
              <button type="button" onClick={copy}
                className={`${mono} text-[10px] uppercase tracking-[0.14em] text-[color:var(--brand)] hover:underline`}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="overflow-x-auto p-4 text-xs leading-relaxed" style={{ color: "var(--code-fg)" }}>
              <code className={mono}>{code.replace(/\\n/g, "\n")}</code>
            </pre>
          </div>
          <div className="border border-[color:var(--line)] p-4 bg-[color:var(--paper-2)]">
            <p className={`${mono} text-[10px] uppercase tracking-[0.14em] text-[color:var(--brand)] mb-2`}>Next steps</p>
            <ol className="text-xs text-[color:var(--ink-2)] space-y-1 list-decimal list-inside">
              <li>Copy the code above</li>
              <li>Run on devnet to test</li>
              <li>Mint tokens to your agent wallet</li>
              <li>Agent uses the protected mint for all payments</li>
            </ol>
          </div>
        </div>

      </div>
    </main>
  );
}
