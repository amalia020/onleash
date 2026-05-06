"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const mono = "font-[family-name:var(--font-mono-family)]";
const display = "font-[family-name:var(--font-display-family)]";

const PRIMARY_LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/playground",   label: "Playground" },
  { href: "/integrate",    label: "Integrate" },
];

const MORE_LINKS = [
  { href: "/demo",      label: "Demo" },
  { href: "/roadmap",   label: "Roadmap" },
  { href: "/security",  label: "Security" },
  { href: "/compose",   label: "Compose" },
];

export default function Nav() {
  const path = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const isMoreActive = MORE_LINKS.some(l => path === l.href || path.startsWith(l.href + "/"));

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-[color:var(--line)] bg-[color:var(--paper)] px-6 py-0">
        <div className="mx-auto flex max-w-5xl items-center justify-between h-14">

          {/* Wordmark */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0" onClick={() => { setMobileOpen(false); setMoreOpen(false); }}>
            <span className={`${display} text-base font-black tracking-tight`}>onleash</span>
            <span className="inline-block h-[3px] w-4 bg-[color:var(--brand)] transition-all group-hover:w-6" />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {PRIMARY_LINKS.map((l) => {
              const active = path === l.href || path.startsWith(l.href + "/");
              return (
                <Link key={l.href} href={l.href}
                  onClick={() => setMoreOpen(false)}
                  className={`${mono} relative px-3 py-1.5 text-xs uppercase tracking-[0.16em] transition-colors
                    ${active ? "text-[color:var(--ink)]" : "text-[color:var(--ink-2)] hover:text-[color:var(--ink)]"}`}>
                  {l.label}
                  {active && <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[color:var(--brand)]" />}
                </Link>
              );
            })}

            {/* More dropdown */}
            <div className="relative">
              <button type="button"
                onClick={() => setMoreOpen(o => !o)}
                className={`${mono} relative px-3 py-1.5 text-xs uppercase tracking-[0.16em] transition-colors flex items-center gap-1
                  ${isMoreActive ? "text-[color:var(--ink)]" : "text-[color:var(--ink-2)] hover:text-[color:var(--ink)]"}`}>
                More
                <span className={`transition-transform ${moreOpen ? "rotate-180" : ""}`} style={{ fontSize: "8px" }}>▾</span>
                {isMoreActive && <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[color:var(--brand)]" />}
              </button>
              {moreOpen && (
                <div className="absolute top-full right-0 mt-1 w-36 border border-[color:var(--line)] bg-[color:var(--paper)] shadow-lg z-50">
                  {MORE_LINKS.map(l => {
                    const active = path === l.href || path.startsWith(l.href + "/");
                    return (
                      <Link key={l.href} href={l.href}
                        onClick={() => setMoreOpen(false)}
                        className={`${mono} block px-4 py-2.5 text-xs uppercase tracking-[0.14em] border-b border-[color:var(--line)] last:border-0 transition-colors
                          ${active ? "text-[color:var(--brand)]" : "text-[color:var(--ink-2)] hover:text-[color:var(--ink)] hover:bg-[color:var(--paper-2)]"}`}>
                        {l.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <a href="https://github.com/amalia020/onleash" target="_blank" rel="noreferrer"
              className={`${mono} hidden sm:block text-xs uppercase tracking-[0.16em] text-[color:var(--ink-2)] hover:text-[color:var(--ink)]`}>
              GitHub
            </a>
            <Link href="/#waitlist"
              className={`${mono} hidden md:block bg-[color:var(--brand)] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-[color:var(--brand-2)] transition-colors`}>
              Join waitlist
            </Link>
            {/* Hamburger */}
            <button type="button" aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => { setMobileOpen(o => !o); setMoreOpen(false); }}
              className="md:hidden flex flex-col gap-[5px] p-2 -mr-2">
              <span className={`block h-[2px] w-5 bg-[color:var(--ink)] transition-transform ${mobileOpen ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`block h-[2px] w-5 bg-[color:var(--ink)] transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block h-[2px] w-5 bg-[color:var(--ink)] transition-transform ${mobileOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-14 z-40 bg-[color:var(--paper)] border-t border-[color:var(--line)] flex flex-col px-6 py-6 gap-1">
          {[...PRIMARY_LINKS, ...MORE_LINKS].map((l) => {
            const active = path === l.href;
            return (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className={`${mono} py-3 text-sm uppercase tracking-[0.16em] border-b border-[color:var(--line)] transition-colors
                  ${active ? "text-[color:var(--brand)]" : "text-[color:var(--ink-2)] hover:text-[color:var(--ink)]"}`}>
                {l.label}
              </Link>
            );
          })}
          <a href="https://github.com/amalia020/onleash" target="_blank" rel="noreferrer"
            onClick={() => setMobileOpen(false)}
            className={`${mono} py-3 text-sm uppercase tracking-[0.16em] border-b border-[color:var(--line)] text-[color:var(--ink-2)] hover:text-[color:var(--ink)]`}>
            GitHub →
          </a>
          <Link href="/#waitlist" onClick={() => setMobileOpen(false)}
            className={`${mono} mt-4 bg-[color:var(--brand)] px-4 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white text-center hover:bg-[color:var(--brand-2)] transition-colors`}>
            Join waitlist
          </Link>
        </div>
      )}

      {/* Close More dropdown on outside click */}
      {moreOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
      )}
    </>
  );
}