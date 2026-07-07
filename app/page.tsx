"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { APPS, type AppConfig } from "@/lib/apps";
import { VERSES } from "@/lib/verses";
import { navigateToApp } from "@/lib/navigate";
import { useOSData } from "@/lib/useOSData";
import { AppIcon } from "@/app/AppIcon";
import { BottomNav } from "@/app/BottomNav";
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
  const [revealedId, setRevealedId] = useState<string | null>(null);

  const { data } = useOSData();

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
      setRevealedId((current) => {
        if (current !== app.id) return app.id; // first tap → reveal
        navigateToApp(app.url); // second tap → open
        return current;
      });
    },
    []
  );

  const headerTime = now ? formatHeader(now) : " ";
  const verse = VERSES[verseIdx];

  return (
    <main className="flex h-[100dvh] w-full flex-col" style={{ background: "var(--bg-void)" }}>
      {/* Header — wordmark + live clock */}
      <header className="topbar">
        <Link href="/settings" className="logo">
          <span className="r2">R2</span>
          <span className="os">·OS</span>
        </Link>
        <span className="clock-full">{headerTime}</span>
      </header>

      {/* Verse card — vertically centered, tap to shuffle */}
      <div className="verse-wrap">
        <button className="verse" onClick={newRandomVerse}>
          <span className="quote">&ldquo;</span>
          <div className="inner" style={{ opacity: verseFade ? 1 : 0 }}>
            <p className="vtext">&ldquo;{verse.text}&rdquo;</p>
            <p className="ref">&mdash; {verse.ref}</p>
          </div>
        </button>
      </div>

      {/* 2×2 fire grid — tap to reveal metric, tap again to open */}
      <div className="grid-wrap">
        <div className="grid-glow" />
        <div className="grid">
          {APPS.map((app, i) => (
            <Tile
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

      <BottomNav active="home" />
    </main>
  );
}

function Tile({
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
  const val = isLoading ? "···" : live?.metric ?? "—";
  const unit = isLoading ? "" : (live?.label ?? "").toLowerCase();

  return (
    <button className={`tile${revealed ? " revealed" : ""}`} onClick={onTap}>
      <span className="arrow">&#8599;</span>
      <span className="icon" style={{ animationDelay: `${(index * 0.45).toFixed(2)}s` }}>
        <AppIcon id={app.id} />
      </span>
      <div className="foot">
        <span className="name">{app.shortName}</span>
        <div className="metric">
          <span className="val">{val}</span>
          {unit && <span className="unit">{unit}</span>}
        </div>
      </div>
    </button>
  );
}
