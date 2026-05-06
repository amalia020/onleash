"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const mono = "font-[family-name:var(--font-mono-family)]";
const display = "font-[family-name:var(--font-display-family)]";

const LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/demo",         label: "Demo" },
  { href: "/integrate",    label: "Integrate" },
  { href: "/roadmap",      label: "Roadmap" },
];

export default function Nav() {
  const path = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-[color:var(--line)] bg-[color:var(--paper)] px-6 py-0">
      <div className="mx-auto flex max-w-5xl items-center justify-between h-14">

        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className={`${display} text-base font-black tracking-tight`}>onleash</span>
          <span className="inline-block h-[3px] w-4 bg-[color:var(--brand)] transition-all group-hover:w-6" />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => {
            const active = path === l.href || path.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`${mono} relative px-3 py-1.5 text-xs uppercase tracking-[0.16em] transition-colors
                  ${active
                    ? "text-[color:var(--ink)]"
                    : "text-[color:var(--ink-2)] hover:text-[color:var(--ink)]"
                  }`}
              >
                {l.label}
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[color:var(--brand)]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/amalia020/onleash"
            target="_blank"
            rel="noreferrer"
            className={`${mono} hidden sm:block text-xs uppercase tracking-[0.16em] text-[color:var(--ink-2)] hover:text-[color:var(--ink)]`}
          >
            GitHub
          </a>
          <Link
            href="/#waitlist"
            className={`${mono} bg-[color:var(--brand)] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-[color:var(--brand-2)] transition-colors`}
          >
            Join waitlist
          </Link>
        </div>

      </div>
    </nav>
  );
}
