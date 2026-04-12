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
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setNow(new Date());
    setIsMobile(window.innerWidth < 768);
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const greeting = now ? greetingFor(now.getHours()) : "\u00a0";
  const label = now ? greetingLabel(now.getHours()) : "\u00a0";
  const headerTime = now ? formatHeader(now) : "\u00a0";
  const urgent = getMostUrgent(APPS);

  return (
    <main className="flex h-[100dvh] w-full flex-col" style={{ background: "var(--bg)" }}>
      {/* Header — 52px */}
      <header
        className="flex h-[52px] shrink-0 items-center justify-between px-6"
        style={{ borderBottom: "0.5px solid var(--border)" }}
      >
        <Link href="/settings" className="font-serif text-[18px]" style={{ color: "var(--fg)" }}>
          R2·OS
        </Link>
        <span className="font-label text-[9px]" style={{ color: "var(--muted)" }}>
          {headerTime}
        </span>
      </header>

      {/* Greeting — centered, tappable to brief */}
      <Link
        href="/brief"
        className="flex shrink-0 flex-col items-center justify-center px-6 py-5 md:py-8"
        style={{ borderBottom: "0.5px solid var(--border)" }}
      >
        <span
          className="font-label text-[9px] animate-fade-in"
          style={{ color: "var(--muted)", letterSpacing: "0.2em" }}
        >
          {label}
        </span>
        <span
          className="font-serif text-[36px] md:text-[52px] leading-[1.1] mt-2 animate-fade-in-delay"
          style={{ color: "var(--fg)" }}
        >
          {greeting}
        </span>
      </Link>

      {/* Urgent strip — 48px, only if urgent */}
      {urgent && (
        <div
          className="flex h-12 shrink-0 items-center justify-between px-6"
          style={{
            borderTop: "1.5px solid var(--fg)",
            borderBottom: "0.5px solid var(--border)",
          }}
        >
          <span className="font-label text-[8px]" style={{ color: "var(--dim)" }}>
            {urgent.urgency.toUpperCase()}
          </span>
          <span
            className="font-serif italic text-[15px] animate-fade-in"
            style={{ color: "var(--fg)" }}
          >
            {urgent.alertMessage}
          </span>
          <span className="font-label text-[8px]" style={{ color: "var(--muted)" }}>
            {urgent.name}
          </span>
        </div>
      )}

      {!urgent && (
        <div
          className="flex h-12 shrink-0 items-center justify-center px-6"
          style={{ borderBottom: "0.5px solid var(--border)" }}
        >
          <span className="font-label text-[9px]" style={{ color: "var(--muted)" }}>
            // ALL CLEAR
          </span>
        </div>
      )}

      {/* App grid — 2×2 fills remaining */}
      <section className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2">
        {APPS.map((app, i) => (
          <AppCell key={app.id} app={app} index={i} isMobile={isMobile} />
        ))}
      </section>

      {/* Footer — 40px */}
      <footer
        className="flex h-10 shrink-0 items-center justify-between px-6"
        style={{ borderTop: "0.5px solid var(--border)" }}
      >
        <span className="font-label text-[8px]" style={{ color: "var(--faint)" }}>
          R2·OS V1.0
        </span>
        <div className="flex items-center gap-3">
          {APPS.map((a) => (
            <span
              key={a.id}
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--fg)" }}
            />
          ))}
        </div>
        <span className="font-label text-[8px]" style={{ color: "var(--faint)" }}>
          ALL SYSTEMS ACTIVE
        </span>
      </footer>

      {/* Mobile bottom nav — 56px */}
      <nav
        className="flex h-14 shrink-0 items-center justify-around md:hidden"
        style={{ borderTop: "0.5px solid var(--border)", background: "var(--bg)" }}
      >
        <span className="font-label text-[9px]" style={{ color: "var(--fg)" }}>HOME</span>
        <Link href="/brief" className="font-label text-[9px]" style={{ color: "var(--muted)" }}>BRIEF</Link>
        <span className="font-label text-[9px]" style={{ color: "var(--muted)" }}>APPS</span>
        <Link href="/settings" className="font-label text-[9px]" style={{ color: "var(--muted)" }}>SET</Link>
      </nav>
    </main>
  );
}

function AppCell({ app, index, isMobile }: { app: AppSummary; index: number; isMobile: boolean }) {
  const isRight = index % 2 === 1;
  const isBottom = index >= 2;
  const isUrgent = app.alert && app.urgency === "urgent";

  return (
    <a
      href={app.url}
      target={isMobile ? "_self" : "_blank"}
      rel="noopener"
      className="cell-press relative flex flex-col justify-between"
      style={{
        padding: "20px 16px",
        borderRight: isRight ? "none" : "0.8px solid var(--border-strong)",
        borderBottom: isBottom ? "none" : "0.8px solid var(--border-strong)",
        borderTop: isUrgent ? "1.5px solid var(--fg)" : "none",
      }}
    >
      {/* App name + dot */}
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: "var(--fg)" }}
        />
        <span
          className="font-label text-[8px]"
          style={{ color: "var(--dim)" }}
        >
          {app.name}
        </span>
      </div>

      {/* Metric — hero */}
      <div className="flex flex-col gap-1 my-auto">
        <span
          className="font-serif text-[44px] md:text-[48px] leading-none"
          style={{
            color: "var(--fg)",
            fontWeight: isUrgent ? 500 : 400,
          }}
        >
          {app.metric}
        </span>
        <span
          className="font-label text-[8px] mt-1"
          style={{ color: "var(--dim)" }}
        >
          {app.unit}
        </span>
      </div>

      {/* Arrow indicator */}
      <div className="flex justify-end">
        <span
          className="font-label text-[10px]"
          style={{ color: "var(--faint)" }}
        >
          →
        </span>
      </div>
    </a>
  );
}
