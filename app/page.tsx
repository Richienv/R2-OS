"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { APPS, getMostUrgent } from "@/lib/apps";
import { VERSES } from "@/lib/verses";
import type { AppSummary } from "@/lib/apps";
import type { Translation } from "@/lib/verses";

function detectMobile() {
  if (typeof window === "undefined") return true;
  return window.innerWidth < 768 || /iPhone|iPad|Android/i.test(navigator.userAgent);
}

function formatHeader(d: Date) {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const hh = d.getHours();
  const mm = d.getMinutes().toString().padStart(2, "0");
  const ampm = hh >= 12 ? "PM" : "AM";
  const h12 = ((hh + 11) % 12) + 1;
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()} · ${h12}:${mm} ${ampm}`;
}

function getDefaultVerse() {
  const stored = typeof window !== "undefined" ? localStorage.getItem("r2os-verse") : null;
  if (stored !== null) return parseInt(stored, 10) % VERSES.length;
  return (new Date().getDate() - 1) % VERSES.length;
}

function getTranslation(): Translation {
  if (typeof window === "undefined") return "esv";
  return (localStorage.getItem("r2os-translation") as Translation) || "esv";
}

export default function HubPage() {
  const [now, setNow] = useState<Date | null>(null);
  const [isMobile, setIsMobile] = useState(true);
  const [verseIdx, setVerseIdx] = useState(0);
  const [verseFade, setVerseFade] = useState(true);
  const [translation, setTranslation] = useState<Translation>("esv");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setNow(new Date());
    setIsMobile(detectMobile());
    setVerseIdx(getDefaultVerse());
    setTranslation(getTranslation());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const changeVerse = useCallback((dir: 1 | -1) => {
    setVerseFade(false);
    setTimeout(() => {
      setVerseIdx((prev) => {
        const next = (prev + dir + VERSES.length) % VERSES.length;
        localStorage.setItem("r2os-verse", String(next));
        return next;
      });
      setVerseFade(true);
    }, 150);
  }, []);

  const copyVerse = useCallback(() => {
    const v = VERSES[verseIdx];
    navigator.clipboard.writeText(`\u201c${v[translation]}\u201d \u2014 ${v.ref}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [verseIdx, translation]);

  const headerTime = now ? formatHeader(now) : "\u00a0";
  const urgent = getMostUrgent(APPS);
  const verse = VERSES[verseIdx];

  return (
    <main className="flex h-[100dvh] w-full flex-col" style={{ background: "var(--bg)" }}>
      {/* Header */}
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

      {/* Bible verse */}
      <section
        className="flex shrink-0 flex-col px-6 py-5"
        style={{ borderBottom: "0.5px solid var(--border)" }}
      >
        <span
          className="font-label text-[8px] mb-3"
          style={{ color: "var(--faint)", letterSpacing: "3px" }}
        >
          // SCRIPTURE
        </span>

        <div
          className="verse-fade"
          style={{ opacity: verseFade ? 1 : 0 }}
          onContextMenu={(e) => { e.preventDefault(); copyVerse(); }}
          onClick={() => { if (typeof window !== "undefined" && !("ontouchstart" in window)) copyVerse(); }}
        >
          <p
            className="font-serif italic text-[15px] leading-[1.65]"
            style={{ color: "var(--fg)" }}
          >
            &ldquo;{verse[translation]}&rdquo;
          </p>
          <p className="font-label text-[9px] mt-2" style={{ color: "var(--muted)" }}>
            &mdash; {verse.ref}
          </p>
        </div>

        {copied && (
          <span className="font-label text-[9px] mt-2 animate-fade-in" style={{ color: "var(--dim)" }}>
            Copied.
          </span>
        )}

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => changeVerse(-1)}
            className="flex h-11 w-11 items-center justify-center"
            aria-label="Previous verse"
          >
            <span className="font-serif text-[18px]" style={{ color: "var(--muted)" }}>&lsaquo;</span>
          </button>
          <span className="font-label text-[9px]" style={{ color: "var(--faint)" }}>
            {verseIdx + 1} / {VERSES.length}
          </span>
          <button
            onClick={() => changeVerse(1)}
            className="flex h-11 w-11 items-center justify-center"
            aria-label="Next verse"
          >
            <span className="font-serif text-[18px]" style={{ color: "var(--muted)" }}>&rsaquo;</span>
          </button>
        </div>
      </section>

      {/* Urgent strip */}
      {urgent && (
        <a
          href={urgent.url}
          target={isMobile ? "_self" : "_blank"}
          rel="noopener"
          className="cell-press flex h-11 shrink-0 items-center justify-between px-6 cursor-pointer"
          style={{
            borderTop: "1.5px solid var(--border-strong)",
            borderBottom: "0.5px solid var(--border)",
          }}
        >
          <span className="font-label text-[8px]" style={{ color: "var(--dim)" }}>URGENT</span>
          <span className="font-serif italic text-[14px]" style={{ color: "var(--fg)" }}>
            {urgent.alertMessage}
          </span>
          <span className="font-label text-[8px]" style={{ color: "var(--muted)" }}>
            {urgent.name} &rsaquo;
          </span>
        </a>
      )}

      {/* App grid */}
      <section className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2">
        {APPS.map((app, i) => (
          <AppCell key={app.id} app={app} index={i} isMobile={isMobile} />
        ))}
      </section>

      {/* Footer */}
      <footer
        className="flex h-10 shrink-0 items-center justify-between px-6"
        style={{ borderTop: "0.5px solid var(--border)" }}
      >
        <span className="font-label text-[8px]" style={{ color: "var(--faint)" }}>R2·OS V1.0</span>
        <div className="flex items-center gap-3">
          {APPS.map((a) => (
            <span key={a.id} className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--fg)" }} />
          ))}
        </div>
        <span className="font-label text-[8px]" style={{ color: "var(--faint)" }}>ALL SYSTEMS ACTIVE</span>
      </footer>

      {/* Mobile bottom nav */}
      <nav
        className="flex h-[52px] shrink-0 items-center justify-around md:hidden"
        style={{ borderTop: "0.5px solid var(--border)", background: "var(--bg)" }}
      >
        <span className="font-label text-[9px]" style={{ color: "var(--fg)" }}>HOME</span>
        <Link href="/brief" className="font-label text-[9px]" style={{ color: "var(--muted)" }}>BRIEF</Link>
        <Link href="/apps" className="font-label text-[9px]" style={{ color: "var(--muted)" }}>APPS</Link>
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
      className="cell-press group relative flex flex-col cursor-pointer"
      style={{
        borderRight: isRight ? "none" : "0.5px solid var(--border)",
        borderBottom: isBottom ? "none" : "0.5px solid var(--border)",
      }}
    >
      {/* Dark title bar — 36px */}
      <div
        className="flex h-9 shrink-0 items-center justify-between px-3.5 transition-colors duration-100 group-hover:brightness-125"
        style={{ background: "var(--fg)" }}
      >
        <span
          className="font-serif text-[14px]"
          style={{ color: "var(--bg)" }}
        >
          {app.name}
        </span>
        <span className="flex items-center gap-1.5">
          {isUrgent && (
            <span className="text-[10px]" style={{ color: "var(--bg)", opacity: 0.7 }}>⚡</span>
          )}
          <span
            className="font-label text-[12px]"
            style={{ color: "var(--bg)", opacity: 0.5 }}
          >
            &rsaquo;
          </span>
        </span>
      </div>

      {/* Metric area */}
      <div className="flex flex-1 flex-col justify-center px-3.5 py-3">
        <span
          className="font-serif text-[48px] leading-none"
          style={{ color: "var(--fg)", fontWeight: isUrgent ? 500 : 400 }}
        >
          {app.metric}
        </span>
        <span
          className="font-label text-[8px] mt-1.5"
          style={{ color: isUrgent ? "var(--fg)" : "var(--muted)" }}
        >
          {isUrgent && app.alertMessage ? app.alertMessage.toUpperCase() : app.label}
        </span>
      </div>
    </a>
  );
}
