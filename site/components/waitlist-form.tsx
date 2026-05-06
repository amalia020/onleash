"use client";

import { useForm, ValidationError } from "@formspree/react";
import { useEffect, useState } from "react";

const mono = "font-[family-name:var(--font-mono-family)]";

const HIT_URL = "https://api.countapi.xyz/hit/onleash/waitlist-count";
const GET_URL = "https://api.countapi.xyz/get/onleash/waitlist-count";

export default function WaitlistForm() {
  const [state, handleSubmit] = useForm("xpqbreaw");
  const [count, setCount]     = useState<number | null>(null);

  useEffect(() => {
    fetch(GET_URL)
      .then(r => r.json())
      .then(d => setCount(d.value ?? null))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!state.succeeded) return;
    fetch(HIT_URL)
      .then(r => r.json())
      .then(d => setCount(d.value ?? null))
      .catch(() => {});
  }, [state.succeeded]);

  if (state.succeeded) {
    return (
      <div className="mt-8 border-2 border-[color:var(--brand)] bg-[color:var(--brand-soft)] p-6 max-w-xl">
        <div className={`${mono} text-[10px] uppercase tracking-[0.2em] text-[color:var(--brand)]`}>
          you&apos;re on the list
        </div>
        <p className="mt-2 text-sm text-[color:var(--ink-2)]">
          We&apos;ll email you when mainnet ships and send you the integration guide.
        </p>
        {count !== null && (
          <p className={`${mono} mt-3 text-[11px] uppercase tracking-[0.16em] text-[color:var(--brand)]`}>
            {count.toLocaleString()} builder{count === 1 ? "" : "s"} waiting
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-xl">
      {count !== null && (
        <div className={`${mono} mb-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[color:var(--brand)]`}>
          <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--brand)] animate-pulse" />
          {count.toLocaleString()} builder{count === 1 ? "" : "s"} on the waitlist
        </div>
      )}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <input
            id="email"
            type="email"
            name="email"
            required
            placeholder="your@email.com"
            disabled={state.submitting}
            className={`${mono} w-full border-2 border-[color:var(--line-strong)] bg-white px-4 py-4 text-sm outline-none focus:border-[color:var(--brand)] placeholder:text-[color:var(--ink-3)] disabled:opacity-60`}
          />
          <ValidationError
            field="email"
            prefix="Email"
            errors={state.errors}
            className={`${mono} mt-1 text-[11px] text-[color:var(--danger)]`}
          />
        </div>
        <button
          type="submit"
          disabled={state.submitting}
          className={`${mono} border-2 border-[color:var(--brand)] bg-[color:var(--brand)] px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white hover:bg-[color:var(--brand-2)] hover:border-[color:var(--brand-2)] disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {state.submitting ? "Sending..." : "Join waitlist"}
        </button>
      </div>
      <ValidationError
        errors={state.errors}
        className={`${mono} mt-2 text-[11px] text-[color:var(--danger)]`}
      />
      <p className={`${mono} mt-3 text-[11px] uppercase tracking-[0.12em] text-[color:var(--ink-3)]`}>
        No spam. Unsubscribe any time.
      </p>
    </form>
  );
}
