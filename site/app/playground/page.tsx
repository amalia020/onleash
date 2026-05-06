"use client";

import { useState } from "react";

const mono = "font-[family-name:var(--font-mono-family)]";
const display = "font-[family-name:var(--font-display-family)]";

interface Policy {
  perTxMax: number;
  dailyCap: number;
  maxTransfersPerDay: number;
  cooldownSecs: number;
  paused: boolean;
  allowlist: string[];
}

interface Transfer {
  id: number;
  destination: string;
  amount: number;
  result: "pass" | "fail";
  errorCode: number | null;
  errorName: string | null;
  ts: number;
}

const DEFAULT_POLICY: Policy = {
  perTxMax: 10,
  dailyCap: 50,
  maxTransfersPerDay: 5,
  cooldownSecs: 0,
  paused: false,
  allowlist: ["ApprovedVaultAAA", "ApprovedPoolBBB"],
};

const PRESETS = [
  {
    label: "Conservative",
    policy: { perTxMax: 5, dailyCap: 20, maxTransfersPerDay: 3, cooldownSecs: 60, paused: false, allowlist: ["ApprovedVaultAAA"] },
  },
  {
    label: "Balanced",
    policy: { perTxMax: 10, dailyCap: 50, maxTransfersPerDay: 5, cooldownSecs: 0, paused: false, allowlist: ["ApprovedVaultAAA", "ApprovedPoolBBB"] },
  },
  {
    label: "Open",
    policy: { perTxMax: 100, dailyCap: 500, maxTransfersPerDay: 0, cooldownSecs: 0, paused: false, allowlist: ["ApprovedVaultAAA", "ApprovedPoolBBB", "ApprovedDexCCC"] },
  },
];

const ATTACK_SCENARIOS = [
  { label: "Approved transfer (5 tokens)", destination: "ApprovedVaultAAA", amount: 5 },
  { label: "Attacker redirect (5 tokens)", destination: "AttackerWallet999", amount: 5 },
  { label: "Oversized transfer (20 tokens)", destination: "ApprovedVaultAAA", amount: 20 },
  { label: "Daily cap buster (40 tokens)", destination: "ApprovedVaultAAA", amount: 40 },
  { label: "Custom transfer", destination: "", amount: 0 },
];

function simulate(policy: Policy, transfers: Transfer[], destination: string, amount: number, lastTs: number): { result: "pass" | "fail"; errorCode: number | null; errorName: string | null } {
  if (policy.paused) return { result: "fail", errorCode: 6007, errorName: "PolicyPaused" };
  if (!policy.allowlist.includes(destination)) return { result: "fail", errorCode: 6001, errorName: "DestinationNotAllowed" };
  if (amount > policy.perTxMax) return { result: "fail", errorCode: 6002, errorName: "ExceedsPerTxMax" };

  const now = Date.now();
  const windowStart = now - 86_400_000;
  const recent = transfers.filter(t => t.ts > windowStart && t.result === "pass");
  const spentToday = recent.reduce((s, t) => s + t.amount, 0);
  if (spentToday + amount > policy.dailyCap) return { result: "fail", errorCode: 6003, errorName: "ExceedsDailyCap" };

  if (policy.maxTransfersPerDay > 0 && recent.length >= policy.maxTransfersPerDay) return { result: "fail", errorCode: 6009, errorName: "ExceedsTransferCount" };

  if (policy.cooldownSecs > 0 && lastTs > 0) {
    const elapsed = (now - lastTs) / 1000;
    if (elapsed < policy.cooldownSecs) return { result: "fail", errorCode: 6008, errorName: "CooldownActive" };
  }

  return { result: "pass", errorCode: null, errorName: null };
}

export default function Playground() {
  const [policy, setPolicy] = useState<Policy>(DEFAULT_POLICY);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [counter, setCounter] = useState(0);
  const [customDest, setCustomDest] = useState("ApprovedVaultAAA");
  const [customAmount, setCustomAmount] = useState(5);
  const [newAddr, setNewAddr] = useState("");

  const lastPassTs = transfers.filter(t => t.result === "pass").at(-1)?.ts ?? 0;
  const windowStart = Date.now() - 86_400_000;
  const recent = transfers.filter(t => t.ts > windowStart && t.result === "pass");
  const spentToday = recent.reduce((s, t) => s + t.amount, 0);

  function fire(destination: string, amount: number) {
    if (!destination || amount <= 0) return;
    const r = simulate(policy, transfers, destination, amount, lastPassTs);
    const tx: Transfer = { id: counter, destination, amount, ...r, ts: Date.now() };
    setTransfers(prev => [tx, ...prev].slice(0, 20));
    setCounter(c => c + 1);
  }

  function addToAllowlist() {
    const a = newAddr.trim();
    if (!a || policy.allowlist.includes(a)) return;
    setPolicy(p => ({ ...p, allowlist: [...p.allowlist, a] }));
    setNewAddr("");
  }

  return (
    <main style={{ background: "var(--paper)", color: "var(--ink)" }}>

      {/* HEADER */}
      <section className="border-b border-[color:var(--line)] px-6 pt-14 pb-12">
        <div className="mx-auto max-w-6xl">
          <p className={`${mono} text-xs uppercase tracking-[0.2em] text-[color:var(--ink-2)]`}>Playground · no install required</p>
          <h1 className={`${display} mt-4 text-4xl font-black sm:text-5xl`}>
            Configure a policy. Fire transfers. See what the chain would do.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-[color:var(--ink-2)]">
            This simulator runs the exact same 6-check logic as the on-chain hook — in your browser.
            No Rust, no Anchor, no wallet needed.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {PRESETS.map(p => (
              <button key={p.label} type="button"
                onClick={() => { setPolicy(p.policy); setTransfers([]); setCounter(0); }}
                className={`${mono} border border-[color:var(--line-strong)] px-3 py-1.5 text-xs uppercase tracking-[0.14em] hover:border-[color:var(--brand)] hover:text-[color:var(--brand)] transition-colors`}>
                {p.label} preset
              </button>
            ))}
            <button type="button"
              onClick={() => { setTransfers([]); setCounter(0); }}
              className={`${mono} border border-[color:var(--line)] px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-[color:var(--ink-3)] hover:text-[color:var(--ink-2)] transition-colors`}>
              Reset log
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-10 grid gap-8 lg:grid-cols-[380px_1fr]">

        {/* LEFT — POLICY CONFIG */}
        <div className="flex flex-col gap-6">

          {/* Pause toggle */}
          <div className="border-2 border-[color:var(--line)] p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-sm">Emergency pause</div>
                <p className="text-xs text-[color:var(--ink-2)] mt-0.5">Halt all transfers instantly</p>
              </div>
              <button type="button"
                onClick={() => setPolicy(p => ({ ...p, paused: !p.paused }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${policy.paused ? "bg-red-500" : "bg-[color:var(--line-strong)]"}`}>
                <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${policy.paused ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
            {policy.paused && <p className={`${mono} mt-3 text-[10px] uppercase tracking-[0.14em] text-red-400`}>● All transfers will fail with 6007</p>}
          </div>

          {/* Numeric params */}
          {([
            { key: "perTxMax", label: "Per-tx max", unit: "tokens", min: 1, max: 200, errorCode: 6002 },
            { key: "dailyCap", label: "Daily cap", unit: "tokens/24h", min: 1, max: 1000, errorCode: 6003 },
            { key: "maxTransfersPerDay", label: "Max transfers/day", unit: "transfers (0=unlimited)", min: 0, max: 50, errorCode: 6009 },
            { key: "cooldownSecs", label: "Cooldown", unit: "seconds (0=disabled)", min: 0, max: 300, errorCode: 6008 },
          ] as const).map(({ key, label, unit, min, max, errorCode }) => (
            <div key={key} className="border-2 border-[color:var(--line)] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-sm">{label}</div>
                <span className={`${mono} text-[10px] text-[color:var(--brand)]`}>err {errorCode}</span>
              </div>
              <input type="range" min={min} max={max}
                value={policy[key]}
                onChange={e => setPolicy(p => ({ ...p, [key]: Number(e.target.value) }))}
                className="w-full accent-[color:var(--brand)]" />
              <div className="mt-2 flex items-center justify-between">
                <span className={`${mono} text-xs text-[color:var(--ink-2)]`}>{unit}</span>
                <span className={`${mono} text-sm font-bold text-[color:var(--brand)]`}>{policy[key]}</span>
              </div>
            </div>
          ))}

          {/* Allowlist */}
          <div className="border-2 border-[color:var(--line)] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="font-bold text-sm">Allowlist</div>
              <span className={`${mono} text-[10px] text-[color:var(--brand)]`}>err 6001</span>
            </div>
            <div className="flex flex-col gap-1.5 mb-3">
              {policy.allowlist.map(addr => (
                <div key={addr} className="flex items-center justify-between gap-2 bg-[color:var(--paper-2)] px-3 py-1.5">
                  <span className={`${mono} text-xs text-[color:var(--brand)] truncate`}>{addr}</span>
                  <button type="button"
                    onClick={() => setPolicy(p => ({ ...p, allowlist: p.allowlist.filter(a => a !== addr) }))}
                    className="text-[color:var(--ink-3)] hover:text-red-400 text-xs flex-shrink-0">✕</button>
                </div>
              ))}
              {policy.allowlist.length === 0 && <p className={`${mono} text-[10px] text-red-400`}>No approved destinations — all transfers will fail</p>}
            </div>
            <div className="flex gap-2">
              <input value={newAddr} onChange={e => setNewAddr(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addToAllowlist()}
                placeholder="AddressOrLabel"
                className={`${mono} flex-1 border border-[color:var(--line-strong)] bg-transparent px-2 py-1.5 text-xs outline-none focus:border-[color:var(--brand)]`} />
              <button type="button" onClick={addToAllowlist}
                className={`${mono} border border-[color:var(--brand)] px-3 py-1.5 text-xs text-[color:var(--brand)] hover:bg-[color:var(--brand)] hover:text-white transition-colors`}>
                Add
              </button>
            </div>
          </div>

          {/* Daily spend meter */}
          <div className="border-2 border-[color:var(--line)] p-5">
            <div className="font-bold text-sm mb-3">Daily spend meter</div>
            <div className="h-3 bg-[color:var(--paper-2)] border border-[color:var(--line)] overflow-hidden">
              <div className="h-full bg-[color:var(--brand)] transition-all"
                style={{ width: `${Math.min(100, (spentToday / Math.max(policy.dailyCap, 1)) * 100)}%` }} />
            </div>
            <div className={`${mono} mt-2 flex justify-between text-[10px] text-[color:var(--ink-2)]`}>
              <span>{spentToday} spent</span>
              <span>{policy.dailyCap} cap</span>
            </div>
            <div className={`${mono} mt-1 text-[10px] text-[color:var(--ink-3)]`}>
              {recent.length} transfer{recent.length !== 1 ? "s" : ""} this window
              {policy.maxTransfersPerDay > 0 && ` · limit ${policy.maxTransfersPerDay}`}
            </div>
          </div>
        </div>

        {/* RIGHT — FIRE TRANSFERS + LOG */}
        <div className="flex flex-col gap-6">

          {/* Scenario buttons */}
          <div className="border-2 border-[color:var(--line)] p-5">
            <div className="font-bold text-sm mb-4">Fire a transfer</div>
            <div className="grid gap-2 sm:grid-cols-2">
              {ATTACK_SCENARIOS.slice(0, -1).map(s => (
                <button key={s.label} type="button"
                  onClick={() => fire(s.destination, s.amount)}
                  className={`${mono} border border-[color:var(--line-strong)] px-4 py-3 text-left text-xs uppercase tracking-[0.12em] hover:border-[color:var(--brand)] hover:text-[color:var(--brand)] transition-colors`}>
                  {s.label}
                </button>
              ))}
            </div>
            {/* Custom */}
            <div className="mt-4 border-t border-[color:var(--line)] pt-4">
              <div className={`${mono} text-[10px] uppercase tracking-[0.14em] text-[color:var(--ink-2)] mb-3`}>Custom transfer</div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input value={customDest} onChange={e => setCustomDest(e.target.value)}
                  placeholder="Destination address"
                  className={`${mono} flex-1 border border-[color:var(--line-strong)] bg-transparent px-3 py-2 text-xs outline-none focus:border-[color:var(--brand)]`} />
                <input type="number" min={1} value={customAmount} onChange={e => setCustomAmount(Number(e.target.value))}
                  className={`${mono} w-24 border border-[color:var(--line-strong)] bg-transparent px-3 py-2 text-xs outline-none focus:border-[color:var(--brand)]`} />
                <button type="button" onClick={() => fire(customDest, customAmount)}
                  className={`${mono} border-2 border-[color:var(--brand)] bg-[color:var(--brand)] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white hover:bg-[color:var(--brand-2)] transition-colors`}>
                  Fire →
                </button>
              </div>
            </div>
          </div>

          {/* Transaction log */}
          <div className="border-2 border-[color:var(--line)] flex-1">
            <div className="border-b border-[color:var(--line)] px-5 py-3 flex items-center justify-between">
              <span className={`${mono} text-[10px] uppercase tracking-[0.16em] text-[color:var(--ink-2)]`}>Transaction log</span>
              <span className={`${mono} text-[10px] text-[color:var(--ink-3)]`}>{transfers.length} tx</span>
            </div>
            {transfers.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <p className={`${mono} text-xs text-[color:var(--ink-3)] uppercase tracking-[0.16em]`}>No transactions yet</p>
                <p className="mt-2 text-sm text-[color:var(--ink-2)]">Fire a transfer above to see the hook evaluate it.</p>
              </div>
            ) : (
              <div className="divide-y divide-[color:var(--line)]">
                {transfers.map(tx => (
                  <div key={tx.id} className={`px-5 py-3 flex items-start gap-4 ${tx.result === "pass" ? "" : "bg-red-500/5"}`}>
                    <div className={`${mono} text-xs font-bold flex-shrink-0 mt-0.5 ${tx.result === "pass" ? "text-[color:var(--success)]" : "text-red-400"}`}>
                      {tx.result === "pass" ? "PASS" : "FAIL"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`${mono} text-xs truncate text-[color:var(--ink)]`}>{tx.destination}</div>
                      <div className={`${mono} text-[10px] text-[color:var(--ink-3)] mt-0.5`}>
                        {tx.amount} tokens
                        {tx.errorName && <span className="text-red-400 ml-2">· {tx.errorName} ({tx.errorCode})</span>}
                      </div>
                    </div>
                    <div className={`${mono} text-[10px] text-[color:var(--ink-3)] flex-shrink-0`}>#{tx.id}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Callout */}
          <div className="border border-[color:var(--brand-line)] bg-[color:var(--paper-2)] p-4">
            <p className={`${mono} text-[10px] uppercase tracking-[0.14em] text-[color:var(--brand)] mb-1`}>This is a simulator</p>
            <p className="text-xs text-[color:var(--ink-2)] leading-relaxed">
              Logic mirrors the on-chain hook exactly. To run a real transaction on Solana devnet,
              use the <a href="/demo" className="text-[color:var(--brand)] underline underline-offset-2">demo page</a> or
              install the <a href="/integrate" className="text-[color:var(--brand)] underline underline-offset-2">SDK</a>.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
