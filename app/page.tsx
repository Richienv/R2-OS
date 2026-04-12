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
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()} \u00b7 ${h12}:${mm} ${ampm}`;
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
    navigator.clipboard.writeText(`"${v[translation]}" \u2014 ${v.ref}`);
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
          R2\u00b7OS
        </Link>
        <span className="font-label text-[9px]" style={{ color: "var(--muted)" }}>
          {headerTime}
        </span>
      </header>

      {/* Bible verse hero */}
      <section
        className="flex shrink-0 flex-col px-6 py-7"
        style={{ borderBottom: "0.5px solid var(--border)" }}
      >
        <div
          className="verse-fade"
          style={{ opacity: verseFade ? 1 : 0, minHeight: "80px" }}
          onContextMenu={(e) => { e.preventDefault(); copyVerse(); }}
          onClick={(e) => {
            if ("ontouchstart" in window) return;
            copyVerse();
          }}
        >
          <p
            className="font-serif italic text-[17px] leading-[1.7]"
            style={{ color: "var(--fg)" }}
          >
            &ldquo;{verse[translation]}&rdquo;
          </p>
          <p
            className="font-label text-[10px] mt-3"
            style={{ color: "var(--muted)" }}
          >
            &mdash; {verse.ref}
          </p>
        </div>

        {copied && (
          <span className="font-label text-[9px] mt-2 animate-fade-in" style={{ color: "var(--dim)" }}>
            Copied.
          </span>
        )}

        {/* Verse nav */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={() => changeVerse(-1)}
            className="flex h-11 w-11 items-center justify-center"
            aria-label="Previous verse"
          >
            <span className="font-label text-[14px]" style={{ color: "var(--muted)" }}>&lsaquo;</span>
          </button>
          <span className="font-label text-[8px]" style={{ color: "var(--muted)" }}>
            {verseIdx + 1} / {VERSES.length}
          </span>
          <button
            onClick={() => changeVerse(1)}
            className="flex h-11 w-11 items-center justify-center"
            aria-label="Next verse"
          >
            <span className="font-label text-[14px]" style={{ color: "var(--muted)" }}>&rsaquo;</span>
          </button>
        </div>
      </section>

      {/* Urgent strip — fully tappable */}
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
          <span className="font-label text-[8px]" style={{ color: "var(--dim)" }}>
            URGENT
          </span>
          <span
            className="font-serif italic text-[14px]"
            style={{ color: "var(--fg)" }}
          >
            {urgent.alertMessage}
          </span>
          <span className="font-label text-[8px]" style={{ color: "var(--muted)" }}>
            {urgent.name} &rarr;
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
        <span className="font-label text-[8px]" style={{ color: "var(--faint)" }}>
          R2\u00b7OS V1.0
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
      className="cell-press relative flex flex-col"
      style={{
        borderRight: isRight ? "none" : "0.5px solid var(--border)",
        borderBottom: isBottom ? "none" : "0.5px solid var(--border)",
        borderTop: isUrgent ? "1.5px solid var(--border-strong)" : "none",
      }}
    >
      {/* App name row — 32px */}
      <div
        className="flex h-8 items-center gap-2 px-4"
        style={{ borderBottom: "0.5px solid var(--faint)" }}
      >
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: "var(--fg)" }}
        />
        <span className="font-label text-[8px]" style={{ color: "var(--dim)" }}>
          {app.name}
        </span>
      </div>

      {/* Metric area — flex 1 */}
      <div className="flex flex-1 flex-col justify-center px-4 py-3">
        <span
          className="font-serif text-[44px] leading-none"
          style={{ color: "var(--fg)", fontWeight: isUrgent ? 500 : 400 }}
        >
          {app.metric}
        </span>
        <span
          className="font-label text-[8px] mt-2"
          style={{ color: "var(--muted)" }}
        >
          {app.label}
        </span>
      </div>

      {/* Arrow */}
      <div className="flex justify-end px-4 pb-3">
        <span className="font-label text-[10px]" style={{ color: "var(--faint)" }}>
          &rarr;
        </span>
      </div>
    </a>
  );
}
