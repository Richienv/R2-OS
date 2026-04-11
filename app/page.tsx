"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { APPS, digestItems, greetingFor } from "@/lib/apps";

function formatHeader(d: Date) {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const start = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil((((d.getTime() - start.getTime()) / 86400000) + start.getDay() + 1) / 7);
  const hh = d.getHours();
  const mm = d.getMinutes().toString().padStart(2, "0");
  const ampm = hh >= 12 ? "PM" : "AM";
  const h12 = ((hh + 11) % 12) + 1;
  return `WK ${week} · ${days[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()} · ${h12}:${mm} ${ampm}`;
}

export default function HubPage() {
  const [now, setNow] = useState<Date | null>(null);
  const [digestIdx, setDigestIdx] = useState(0);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const digest = useMemo(() => digestItems(APPS), []);

  useEffect(() => {
    if (digest.length <= 1) return;
    const t = setInterval(() => setDigestIdx((i) => (i + 1) % digest.length), 4000);
    return () => clearInterval(t);
  }, [digest.length]);

  const greeting = now ? greetingFor(now.getHours()) : "\u00a0";
  const headerTime = now ? formatHeader(now) : "\u00a0";
  const current = digest[digestIdx];

  return (
    <main className="flex h-[100dvh] w-full flex-col bg-bg text-text">
      <header className="flex h-20 shrink-0 items-center justify-between px-6">
        <Link href="/settings" className="font-display text-[28px] leading-none text-text">
          R2·OS
        </Link>
        <div className="font-mono text-[11px] tracking-wider text-muted">{headerTime}</div>
      </header>

      <Link
        href="/brief"
        className="flex shrink-0 flex-col gap-4 px-6 pb-6 pt-2 transition active:opacity-70"
      >
        <div className="font-display text-[32px] leading-none text-text/90">{greeting}</div>
        {current && (
          <div
            key={digestIdx}
            className="font-display text-[40px] leading-[1.05] tracking-tight sm:text-[48px]"
            style={{ color: current.color }}
          >
            {current.icon} {current.text}
          </div>
        )}
      </Link>

      <section className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-3 px-4 pb-4">
        {APPS.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </section>

      <footer className="flex h-16 shrink-0 items-center justify-between border-t border-border px-6">
        <span className="font-mono text-[10px] tracking-widest text-muted">
          R2·OS v1.0 · ALL SYSTEMS ACTIVE
        </span>
        <div className="flex items-center gap-2">
          {APPS.map((a) => (
            <span
              key={a.id}
              className="h-2 w-2 rounded-full pulse-dot"
              style={{ background: a.color }}
              aria-label={a.name}
            />
          ))}
        </div>
      </footer>
    </main>
  );
}

function AppCard({ app }: { app: (typeof APPS)[number] }) {
  const borderColor = app.alert ? app.color : "#2A2A3D";
  return (
    <Link
      href={app.url}
      className="relative flex min-h-0 flex-col justify-between rounded-xl bg-surface2 p-4 transition active:scale-[0.98]"
      style={{ border: `0.5px solid ${borderColor}` }}
    >
      <div className="flex items-start justify-between">
        <span className="text-[22px] leading-none">{app.emoji}</span>
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: app.color, boxShadow: `0 0 12px ${app.color}80` }}
        />
      </div>

      {app.alert && app.urgency === "urgent" && (
        <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-r2finance pulse-dot" />
      )}

      <div className="flex flex-col gap-1">
        <div
          className="font-display text-[30px] leading-none sm:text-[34px]"
          style={{ color: app.color }}
        >
          {app.metric}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
          {app.label}
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: app.color }} />
        <span className="font-mono text-[10px] tracking-widest text-muted">{app.name}</span>
      </div>
    </Link>
  );
}
