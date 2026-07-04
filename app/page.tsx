"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { APPS, type AppConfig } from "@/lib/apps";
import { VERSES } from "@/lib/verses";
import { navigateToApp } from "@/lib/navigate";
import { useOSData } from "@/lib/useOSData";
import type { AggregatedApp } from "@/app/api/aggregate/route";
import BottomNav from "@/app/components/BottomNav";
import AppGlyph from "@/app/components/AppGlyph";

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
  const [revealedId, setRevealedId] = useState<string | null>(null);

  const { data, allOffline, lastUpdated } = useOSData();

  useEffect(() => {
    setNow(new Date());
    setVerseIdx(getSavedVerseIdx());
    const t = setInterval(() => setNow(new Date()), 20_000);
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

  const tapTile = useCallback(
    (app: AppConfig) => {
      if (revealedId !== app.id) setRevealedId(app.id);
      else navigateToApp(app.url);
    },
    [revealedId]
  );

  const headerTime = now ? formatHeader(now) : " ";
  const verse = VERSES[verseIdx];

  return (
    <main className="flex h-[100dvh] w-full flex-col" style={{ background: "var(--bg)" }}>
      <div className="r2scr flex min-h-0 flex-1 flex-col overflow-y-auto">
        {/* Header */}
        <header
          className="flex h-[54px] shrink-0 items-center justify-between px-[22px]"
          style={{ borderBottom: "0.5px solid var(--line)" }}
        >
          <Link href="/settings" className="flex items-baseline" style={{ gap: 1, textDecoration: "none" }}>
            <span style={{ fontWeight: 800, fontSize: 23, color: "var(--text)", letterSpacing: "-0.6px" }}>R2</span>
            <span style={{ fontWeight: 300, fontSize: 23, color: "rgba(248,244,240,0.38)", letterSpacing: "-0.6px" }}>
              ·OS
            </span>
          </Link>
          <span className="font-label" style={{ fontSize: 9, color: "var(--label-dim)" }}>
            {headerTime}
          </span>
        </header>

        {/* Verse card — tap for new */}
        <div className="flex flex-1 items-center p-5">
          <button
            onClick={newRandomVerse}
            className="cell-press relative w-full cursor-pointer overflow-hidden text-center"
            style={{
              padding: "22px 20px 18px",
              borderRadius: 22,
              background: "var(--card)",
              border: "none",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,.04), 0 10px 30px rgba(0,0,0,.5)",
            }}
          >
            <span
              aria-hidden
              className="fire-text"
              style={{
                position: "absolute",
                top: 8,
                left: 20,
                fontSize: 52,
                lineHeight: 1,
                fontWeight: 800,
                opacity: 0.5,
              }}
            >
              &ldquo;
            </span>
            <div className="verse-fade relative" style={{ opacity: verseFade ? 1 : 0 }}>
              <p
                style={{
                  fontStyle: "italic",
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: "rgba(248,244,240,0.9)",
                  maxWidth: 280,
                  margin: "0 auto",
                }}
              >
                &ldquo;{verse.text}&rdquo;
              </p>
              <p className="font-label" style={{ fontSize: 9, color: "var(--label)", margin: "11px 0 0" }}>
                &mdash; {verse.ref}
              </p>
              {allOffline && lastUpdated && (
                <p className="font-label" style={{ fontSize: 8, color: "var(--label-dim)", margin: "10px 0 0" }}>
                  unable to reach apps. check connection.
                </p>
              )}
            </div>
          </button>
        </div>

        {/* 2x2 grid */}
        <div className="relative shrink-0" style={{ padding: "0 12px 16px" }}>
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: "50%",
              top: "52%",
              width: 340,
              height: 340,
              transform: "translate(-50%,-50%)",
              background: "radial-gradient(circle,rgba(238,60,48,.14),transparent 62%)",
              pointerEvents: "none",
            }}
          />
          <div className="relative grid grid-cols-2" style={{ gap: 5 }}>
            {APPS.map((app, i) => (
              <AppTile
                key={app.id}
                app={app}
                live={data.apps[app.id]}
                index={i}
                revealed={revealedId === app.id}
                onTap={() => tapTile(app)}
              />
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="HOME" />
    </main>
  );
}

function AppTile({
  app,
  live,
  index,
  revealed,
  onTap,
}: {
  app: AppConfig;
  live: AggregatedApp | undefined;
  index: number;
  revealed: boolean;
  onTap: () => void;
}) {
  const isLoading = !live || live.metric === "···";
  const metric = isLoading ? "···" : live.metric;
  const unit = isLoading ? "" : (live.label ?? "").toLowerCase();

  return (
    <button
      onClick={onTap}
      className="cell-press relative flex cursor-pointer flex-col items-start justify-between overflow-hidden text-left"
      style={{
        height: 176,
        padding: 15,
        borderRadius: 18,
        background: "var(--fire-grad)",
        border: "none",
        boxShadow: "inset 0 1.5px 1px var(--fire-hi), inset 0 -4px 9px var(--fire-lo), 0 12px 26px var(--fire-glow)",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 13,
          right: 14,
          fontSize: 14,
          fontWeight: 700,
          color: "#fff",
          opacity: revealed ? 1 : 0,
          transition: "opacity 150ms ease",
        }}
      >
        ↗
      </span>
      <span
        className="relative inline-flex"
        style={{ animation: "r2float 3.6s ease-in-out infinite", animationDelay: `${(index * 0.45).toFixed(2)}s` }}
      >
        <AppGlyph id={app.id} />
      </span>
      <div className="relative flex flex-col items-start gap-1">
        <span
          style={{
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: "-0.5px",
            color: "#fff",
            lineHeight: 1,
            textShadow: "0 1px 2px rgba(0,0,0,.3)",
          }}
        >
          {app.shortName}
        </span>
        {revealed && (
          <div className="flex items-baseline gap-[3px] animate-fade-in">
            <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{metric}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.72)", letterSpacing: "0.02em" }}>
              {unit}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}
