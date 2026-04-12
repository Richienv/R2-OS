"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { APPS, getMostUrgent } from "@/lib/apps";
import { VERSES } from "@/lib/verses";
import { detectMobile, navigateToApp } from "@/lib/navigate";
import type { AppSummary } from "@/lib/apps";
import type { Translation } from "@/lib/verses";

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
  const [verseIdx, setVerseIdx] = useState(0);
  const [verseFade, setVerseFade] = useState(true);
  const [translation, setTranslation] = useState<Translation>("esv");
  const [copied, setCopied] = useState(false);
  const [verseExpanded, setVerseExpanded] = useState(false);

  useEffect(() => {
    setNow(new Date());
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
        className="flex h-[52px] shrink-0 items-center justify-between px-5"
        style={{ borderBottom: "0.5px solid var(--line)" }}
      >
        <Link href="/settings" style={{ color: "var(--text)", fontWeight: 600, fontSize: 18 }}>
          R2·OS
        </Link>
        <span className="font-label text-[9px]" style={{ color: "#444" }}>
          {headerTime}
        </span>
      </header>

      {/* Urgent strip */}
      {urgent && (
        <button
          onClick={() => navigateToApp(urgent.url)}
          className="cell-press flex h-10 w-full shrink-0 items-center px-5 cursor-pointer text-left"
          style={{
            borderTop: "1px solid var(--line-strong)",
            borderBottom: "0.5px solid var(--line)",
          }}
        >
          <span style={{ color: "var(--text-dim)", fontSize: 12, fontWeight: 400 }}>
            ⚡ {urgent.alertMessage} → {urgent.name}
          </span>
        </button>
      )}

      {/* Bible verse — centered hero */}
      <section
        className="flex shrink-0 flex-col items-center px-6 py-8 cursor-pointer"
        style={{ borderBottom: "0.5px solid var(--line)" }}
        onClick={() => setVerseExpanded(true)}
      >
        <div
          className="verse-fade text-center"
          style={{ opacity: verseFade ? 1 : 0, maxWidth: 340 }}
        >
          <p style={{ fontStyle: "italic", fontSize: 16, lineHeight: 1.7, color: "rgba(240,240,240,0.9)" }}>
            &ldquo;{verse[translation]}&rdquo;
          </p>
          <p className="font-label text-[9px] mt-2.5" style={{ color: "var(--text-muted)" }}>
            &mdash; {verse.ref}
          </p>
        </div>

        {copied && (
          <span className="font-label text-[9px] mt-2 animate-fade-in" style={{ color: "var(--text-dim)" }}>
            Copied.
          </span>
        )}

        <div className="flex items-center justify-center gap-6 mt-4">
          <button onClick={(e) => { e.stopPropagation(); changeVerse(-1); }} className="flex h-11 w-11 items-center justify-center">
            <span style={{ fontSize: 20, color: "var(--text-muted)" }}>&lsaquo;</span>
          </button>
          <span className="font-label text-[9px]" style={{ color: "var(--text-faint)" }}>
            {verseIdx + 1} / {VERSES.length}
          </span>
          <button onClick={(e) => { e.stopPropagation(); changeVerse(1); }} className="flex h-11 w-11 items-center justify-center">
            <span style={{ fontSize: 20, color: "var(--text-muted)" }}>&rsaquo;</span>
          </button>
        </div>
      </section>

      {/* App grid — dark cells, big names */}
      <section className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2">
        {APPS.map((app, i) => (
          <AppCell key={app.id} app={app} index={i} />
        ))}
      </section>

      {/* Footer */}
      <footer
        className="flex h-9 shrink-0 items-center justify-center gap-4 px-5"
        style={{ borderTop: "0.5px solid var(--line)" }}
      >
        <span className="font-label text-[8px]" style={{ color: "#444" }}>R2·OS</span>
        <div className="flex items-center gap-2">
          {APPS.map((a) => (
            <span key={a.id} className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "#444" }} />
          ))}
        </div>
        <span className="font-label text-[8px]" style={{ color: "#444" }}>V1.0</span>
      </footer>

      {/* Mobile bottom nav */}
      <nav
        className="flex h-14 shrink-0 items-center justify-around md:hidden"
        style={{ borderTop: "0.5px solid var(--line)", background: "var(--bg)" }}
      >
        <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text)" }}>HOME</span>
        <Link href="/brief" style={{ fontSize: 11, fontWeight: 500, color: "#444" }}>BRIEF</Link>
        <Link href="/apps" style={{ fontSize: 11, fontWeight: 500, color: "#444" }}>APPS</Link>
        <Link href="/settings" style={{ fontSize: 11, fontWeight: 500, color: "#444" }}>SET</Link>
      </nav>

      {/* Verse expanded overlay */}
      {verseExpanded && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center px-8"
          style={{ background: "var(--bg)" }}
        >
          <button
            onClick={() => setVerseExpanded(false)}
            className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center"
            style={{ color: "var(--text-muted)", fontSize: 20 }}
          >
            ✕
          </button>

          <span className="font-label text-[9px] mb-6" style={{ color: "#444", letterSpacing: "3px" }}>
            // SCRIPTURE
          </span>

          <div className="verse-fade text-center" style={{ opacity: verseFade ? 1 : 0, maxWidth: 380 }}>
            <p style={{ fontStyle: "italic", fontSize: 18, lineHeight: 1.8, color: "var(--text)" }}>
              &ldquo;{verse[translation]}&rdquo;
            </p>
            <p className="font-label text-[10px] mt-4" style={{ color: "#444" }}>
              &mdash; {verse.ref}
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 mt-8">
            <button onClick={() => changeVerse(-1)} className="flex h-11 w-11 items-center justify-center">
              <span style={{ fontSize: 24, color: "var(--text-muted)" }}>&lsaquo;</span>
            </button>
            <span className="font-label text-[9px]" style={{ color: "var(--text-faint)" }}>
              {verseIdx + 1} / {VERSES.length}
            </span>
            <button onClick={() => changeVerse(1)} className="flex h-11 w-11 items-center justify-center">
              <span style={{ fontSize: 24, color: "var(--text-muted)" }}>&rsaquo;</span>
            </button>
          </div>

          <button
            onClick={copyVerse}
            className="font-label text-[10px] underline mt-6"
            style={{ color: "#444", textUnderlineOffset: 3 }}
          >
            COPY
          </button>

          {copied && (
            <span className="font-label text-[9px] mt-2 animate-fade-in" style={{ color: "var(--text-dim)" }}>
              Copied.
            </span>
          )}
        </div>
      )}
    </main>
  );
}

function AppCell({ app, index }: { app: AppSummary; index: number }) {
  const isRight = index % 2 === 1;
  const isBottom = index >= 2;
  const isUrgent = app.alert && app.urgency === "urgent";

  const dataText = isUrgent && app.alertMessage
    ? app.alertMessage
    : `${app.metric} ${app.label.toLowerCase()}`;

  return (
    <button
      onClick={() => navigateToApp(app.url)}
      className="cell-press flex flex-col justify-center px-5 py-5 cursor-pointer text-left"
      style={{
        background: "var(--bg)",
        borderRight: isRight ? "none" : "1px solid var(--line)",
        borderBottom: isBottom ? "none" : "1px solid var(--line)",
      }}
    >
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 28, fontWeight: 600, color: "var(--text)", lineHeight: 1.1 }}>
          {isUrgent && <span style={{ marginRight: 6 }}>●</span>}
          {app.name}
        </span>
        <span className="font-label text-[18px]" style={{ color: "var(--text-muted)" }}>
          &rsaquo;
        </span>
      </div>
      <span
        style={{
          fontSize: 13,
          fontWeight: 400,
          color: isUrgent ? "var(--text-dim)" : "var(--text-muted)",
          marginTop: 6,
        }}
      >
        {dataText}
      </span>
    </button>
  );
}
