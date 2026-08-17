"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Overview" },
  { href: "/simulate", label: "Simulate" },
  { href: "/chokepoints", label: "Choke points" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-[var(--border)] bg-[rgba(8,11,16,0.9)] backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-5 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--danger)] font-mono text-xs font-bold tracking-widest text-white">
              C
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-[0.18em] text-white">
                CASCADE
              </span>
              <span className="block text-xs text-[var(--muted)]">
                Supply chain risk
              </span>
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-1.5 transition-colors ${
                    active
                      ? "bg-[var(--card-strong)] text-white"
                      : "text-[var(--muted)] hover:bg-[var(--card)] hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8">{children}</main>
    </div>
  );
}

export function HazardBadge({ hazard }: { hazard: string }) {
  return (
    <span className={`hazard hazard-${hazard}`}>{hazard}</span>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="card p-4">
      <p className="text-xs tracking-[0.16em] text-[var(--muted)] uppercase">
        {label}
      </p>
      <p className="mt-2 font-mono text-3xl font-semibold text-white">{value}</p>
      {hint ? <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p> : null}
    </div>
  );
}

export function PageHeader({
  kicker,
  title,
  body,
}: {
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <div className="mb-8 max-w-2xl">
      <p className="text-xs tracking-[0.22em] text-[var(--accent)] uppercase">
        {kicker}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
        {title}
      </h1>
      <p className="mt-3 text-[var(--muted)] leading-relaxed">{body}</p>
    </div>
  );
}
