"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { APPS, getMostUrgent, greetingFor, greetingLabel } from "@/lib/apps";
import type { AppSummary } from "@/lib/apps";

function formatHeader(d: Date) {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const hh = d.getHours();
  const mm = d.getMinutes().toString().padStart(2, "0");
  const ampm = hh >= 12 ? "PM" : "AM";
  const h12 = ((hh + 11) % 12) + 1;
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}  ·  ${h12}:${mm} ${ampm}`;
}

export default function HubPage() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const greeting = now ? greetingFor(now.getHours()) : "\u00a0";
  const label = now ? greetingLabel(now.getHours()) : "\u00a0";
  const headerTime = now ? formatHeader(now) : "\u00a0";
  const urgent = getMostUrgent(APPS);
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;

  return (
    <main className="flex h-[100dvh] w-full flex-col" style={{ background: "var(--bg)" }}>
      {/* ─── HEADER ─── */}
      <header
        className="flex h-20 shrink-0 items-center justify-between border-b px-6 md:px-12"
        style={{ borderColor: "var(--border)" }}
      >
        <Link href="/settings" className="font-serif text-[20px]" style={{ color: "var(--text)" }}>
          R2·OS
        </Link>
        <span className="font-label">{headerTime}</span>
      </header>

      {/* ─── GREETING ─── */}
      <Link
        href="/brief"
        className="flex shrink-0 flex-col items-center justify-center border-b py-8 md:py-12 transition-colors"
        style={{ borderColor: "var(--border)" }}
      >
        <span className="font-label text-[9px] animate-fade-in">{label}</span>
        <span
          className="font-serif text-[36px] md:text-[52px] leading-[1.1] mt-3 animate-fade-in-delay"
          style={{ color: "var(--text)" }}
        >
          {greeting}
        </span>
      </Link>

      {/* ─── INTELLIGENCE STRIP ─── */}
      <div
        className="flex h-16 shrink-0 items-center border-b px-6 md:px-12"
        style={{ borderColor: "var(--border)" }}
      >
        {urgent ? (
          <div className="flex w-full items-center justify-between">
            <span
              className="font-label text-[9px]"
              style={{
                color:
                  urgent.urgency === "urgent"
                    ? "var(--r2finance)"
                    : urgent.urgency === "warning"
                      ? "#C49A2A"
                      : "var(--text-muted)",
              }}
            >
              {urgent.urgency.toUpperCase()}
            </span>
            <span
              className="font-serif italic text-[16px] md:text-[18px] animate-fade-in"
              style={{ color: "var(--text)" }}
            >
              {urgent.alertMessage}
            </span>
            <span className="flex items-center gap-2">
              <span className="font-label text-[9px]">{urgent.name}</span>
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: urgent.colorVar }}
              />
            </span>
          </div>
        ) : (
          <span className="font-label text-[9px] mx-auto">// ALL CLEAR</span>
        )}
      </div>

      {/* ─── APP GRID ─── */}
      <section className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2">
        {APPS.map((app, i) => (
          <AppCell key={app.id} app={app} index={i} isDesktop={isDesktop} />
        ))}
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        className="flex h-12 shrink-0 items-center justify-between border-t px-6 md:px-12"
        style={{ borderColor: "var(--border)" }}
      >
        <span className="font-label text-[9px]">R2·OS v1.0</span>
        <div className="flex items-center gap-3">
          {APPS.map((a) => (
            <span
              key={a.id}
              className="h-2 w-2 rounded-full"
              style={{ background: a.colorVar }}
            />
          ))}
        </div>
        <span className="font-label text-[9px]">ALL SYSTEMS ACTIVE</span>
      </footer>

      {/* ─── MOBILE NAV ─── */}
      <nav
        className="flex h-14 shrink-0 items-center justify-around border-t md:hidden"
        style={{ borderColor: "var(--border)", background: "var(--bg)" }}
      >
        <span className="font-label text-[8px]" style={{ color: "var(--text)" }}>HOME</span>
        <Link href="/brief" className="font-label text-[8px]">BRIEF</Link>
        <span className="font-label text-[8px]">APPS</span>
        <Link href="/settings" className="font-label text-[8px]">SET</Link>
      </nav>
    </main>
  );
}

function AppCell({ app, index, isDesktop }: { app: AppSummary; index: number; isDesktop: boolean }) {
  const isRight = index % 2 === 1;
  const isBottom = index >= 2;

  const borders: React.CSSProperties = {
    borderRight: isRight ? "none" : "0.5px solid var(--border)",
    borderBottom: isBottom ? "none" : "0.5px solid var(--border)",
  };

  const urgentBorder: React.CSSProperties =
    app.alert && app.urgency === "urgent"
      ? { borderTop: `1px solid ${app.colorVar}` }
      : {};

  return (
    <a
      href={app.url}
      target={isDesktop ? "_blank" : "_self"}
      rel="noopener"
      className="group relative flex flex-col justify-between p-5 md:p-8 transition-colors duration-150"
      style={{
        ...borders,
        ...urgentBorder,
        background: "var(--bg)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "var(--surface)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "var(--bg)";
      }}
    >
      {app.alert && app.urgency === "urgent" && (
        <div
          className="absolute inset-x-0 top-0 h-px border-pulse"
          style={{ background: app.colorVar }}
        />
      )}

      <div className="flex items-center gap-2">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: app.colorVar }}
        />
        <span className="font-label text-[9px]">{app.name}</span>
      </div>

      <div className="flex flex-col gap-1 mt-auto mb-auto">
        <span
          className="font-serif text-[36px] md:text-[48px] leading-none"
          style={{ color: app.alert && app.urgency === "urgent" ? app.colorVar : "var(--text)" }}
        >
          {app.metric}
        </span>
        <span className="font-label text-[9px] mt-1">{app.unit}</span>
      </div>

      <div className="flex justify-end">
        <span className="font-label text-[10px] opacity-0 transition-opacity duration-150 group-hover:opacity-100 md:opacity-30">
          → OPEN
        </span>
      </div>
    </a>
  );
}
