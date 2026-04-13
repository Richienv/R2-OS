"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { APPS, type AppConfig } from "@/lib/apps";
import { VERSES } from "@/lib/verses";
import { navigateToApp } from "@/lib/navigate";
import { useOSData, formatTimeAgo } from "@/lib/useOSData";
import type { AggregatedApp } from "@/app/api/aggregate/route";

function formatHeader(d: Date) {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const hh = d.getHours();
  const mm = d.getMinutes().toString().padStart(2, "0");
  const ampm = hh >= 12 ? "PM" : "AM";
  const h12 = ((hh + 11) % 12) + 1;
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()} · ${h12}:${mm} ${ampm}`;
}

function getRandomVerseIdx(exclude?: number) {
  let idx: number;
  do {
    idx = Math.floor(Math.random() * VERSES.length);
  } while (idx === exclude && VERSES.length > 1);
  return idx;
}

function getSavedVerseIdx(): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem("r2os-verse");
  if (stored !== null) {
    const n = parseInt(stored, 10);
    if (n >= 0 && n < VERSES.length) return n;
  }
  return getRandomVerseIdx();
}

export default function HubPage() {
  const [now, setNow] = useState<Date | null>(null);
  const [verseIdx, setVerseIdx] = useState(0);
  const [verseFade, setVerseFade] = useState(true);
  const [showHint, setShowHint] = useState(false);

  const { data, lastUpdated, allOffline, refresh, loading } = useOSData();

  useEffect(() => {
    setNow(new Date());
    setVerseIdx(getSavedVerseIdx());
    const t = setInterval(() => setNow(new Date()), 30_000);
    if (!localStorage.getItem("verse-hint-shown")) {
      setShowHint(true);
      setTimeout(() => {
        setShowHint(false);
        localStorage.setItem("verse-hint-shown", "true");
      }, 3000);
    }
    return () => clearInterval(t);
  }, []);

  const newRandomVerse = useCallback(() => {
    setVerseFade(false);
    setTimeout(() => {
      setVerseIdx((prev) => {
        const next = getRandomVerseIdx(prev);
        localStorage.setItem("r2os-verse", String(next));
        return next;
      });
      setVerseFade(true);
    }, 200);
  }, []);

  const headerTime = now ? formatHeader(now) : "\u00a0";
  const verse = VERSES[verseIdx];
  const urgent = data.urgentItem;
  const timeAgo = formatTimeAgo(lastUpdated);

  return (
    <main className="flex h-[100dvh] w-full flex-col" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header
        className="flex h-[52px] shrink-0 items-center justify-between px-5"
        style={{ borderBottom: "0.5px solid var(--line)" }}
      >
        <Link href="/settings" className="flex items-baseline" style={{ gap: 1, textDecoration: "none" }}>
          <span style={{ fontWeight: 800, fontSize: 22, color: "#F0F0F0", letterSpacing: "-0.5px" }}>R2</span>
          <span style={{ fontWeight: 300, fontSize: 22, color: "rgba(240,240,240,0.4)", letterSpacing: "-0.5px" }}>·OS</span>
        </Link>
        <span className="font-label text-[9px]" style={{ color: "#444" }}>
          {headerTime}
        </span>
      </header>

      {/* Urgent strip — live */}
      {urgent && urgent.alertText && (
        <button
          onClick={() => navigateToApp(urgent.appUrl)}
          className="cell-press flex h-10 w-full shrink-0 items-center px-5 cursor-pointer text-left"
          style={{
            borderTop: "1px solid var(--line-strong)",
            borderBottom: "0.5px solid var(--line)",
          }}
        >
          <span style={{ color: "var(--text-dim)", fontSize: 12, fontWeight: 400 }}>
            ⚡ {urgent.alertText} → {urgent.shortName}
          </span>
        </button>
      )}

      {/* Bible verse — tap for new */}
      <div
        onClick={newRandomVerse}
        className="shrink-0 px-6 py-6"
        style={{
          borderBottom: "0.5px solid var(--line)",
          cursor: "pointer",
          WebkitTapHighlightColor: "transparent",
          userSelect: "none",
        }}
      >
        <div
          className="verse-fade text-center"
          style={{ opacity: verseFade ? 1 : 0, maxWidth: 340, margin: "0 auto" }}
        >
          <p style={{ fontStyle: "italic", fontSize: 15, lineHeight: 1.6, color: "rgba(240,240,240,0.85)" }}>
            &ldquo;{verse.text}&rdquo;
          </p>
          <p className="font-label text-[9px] mt-2.5" style={{ color: "rgba(240,240,240,0.25)" }}>
            &mdash; {verse.ref}
          </p>
        </div>
        {showHint && (
          <p
            className="font-label text-[8px] text-center mt-3 animate-fade-in"
            style={{ color: "rgba(240,240,240,0.15)" }}
          >
            tap to receive a new verse
          </p>
        )}
        {allOffline && lastUpdated && (
          <p
            className="font-label text-center mt-3"
            style={{ color: "#444", fontSize: 9 }}
          >
            unable to reach apps. check connection.
          </p>
        )}
      </div>

      {/* App grid — live data */}
      <section className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2">
        {APPS.map((app, i) => (
          <AppCell key={app.id} app={app} live={data.apps[app.id]} index={i} />
        ))}
      </section>

      {/* Footer — tap to refresh */}
      <footer
        onClick={refresh}
        className="flex h-9 shrink-0 cursor-pointer items-center justify-center gap-4 px-5"
        style={{ borderTop: "0.5px solid var(--line)" }}
      >
        <span className="font-label text-[8px]" style={{ color: "#444" }}>R2·OS</span>
        <span className="font-label text-[8px]" style={{ color: "#444" }}>
          UPDATED {loading ? "…" : timeAgo}
        </span>
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

    </main>
  );
}

function AppCell({
  app,
  live,
  index,
}: {
  app: AppConfig;
  live: AggregatedApp | undefined;
  index: number;
}) {
  const isRight = index % 2 === 1;
  const isBottom = index >= 2;
  const isLoading = !live || live.metric === "···";
  const isUrgent = live?.urgency === "urgent";
  const isOffline = live && !live.ok && !isLoading;

  const dataText = isLoading
    ? "···"
    : isUrgent && live?.alertText
    ? live.alertText
    : `${live?.metric ?? "—"} ${(live?.label ?? "").toLowerCase()}`;

  return (
    <button
      onClick={() => navigateToApp(app.url)}
      className="cell-press relative flex flex-col items-center justify-center cursor-pointer"
      style={{
        background: "var(--bg)",
        borderRight: isRight ? "none" : "1px solid var(--line)",
        borderBottom: isBottom ? "none" : "1px solid var(--line)",
        opacity: isOffline ? 0.5 : 1,
      }}
    >
      <span
        style={{
          fontSize: 36,
          fontWeight: 700,
          color: isUrgent ? "#E8FF47" : "var(--text)",
          lineHeight: 1.1,
        }}
      >
        {app.shortName}
      </span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 400,
          color: "rgba(240,240,240,0.35)",
          marginTop: 6,
          textAlign: "center",
          animation: isLoading ? "pulse 1.5s ease-in-out infinite" : "none",
        }}
      >
        {dataText}
      </span>
      <span
        className="font-label"
        style={{
          position: "absolute",
          bottom: 12,
          right: 14,
          fontSize: 11,
          color: "rgba(240,240,240,0.15)",
        }}
      >
        &rsaquo;
      </span>
    </button>
  );
}
