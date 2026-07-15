"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { VERSES } from "@/lib/verses";
import { navigateToApp } from "@/lib/navigate";

/**
 * Minimal "agent OS" home — an all-black screen with a plain vertical menu.
 * Labels are Indonesian; each opens its deployed app. The bottom orb reveals
 * the daily verse. Brief / Apps / Settings keep their own (fire) design.
 */
type MenuItem = { label: string; url: string };

const MENU: MenuItem[] = [
  { label: "Fit + Diet", url: "https://r2-fit.vercel.app" },
  { label: "Kuliah", url: "https://r2-school.vercel.app" },
  { label: "Uang", url: "https://r2-finance.vercel.app" },
  { label: "Project", url: "https://r2-build.vercel.app" },
  // No deployed app yet — follows the r2-*.vercel.app convention.
  { label: "Konten", url: "https://r2-content.vercel.app" },
];

function getRandomVerseIdx(exclude?: number) {
  let idx: number;
  do {
    idx = Math.floor(Math.random() * VERSES.length);
  } while (idx === exclude && VERSES.length > 1);
  return idx;
}

export default function HomePage() {
  const [verseOpen, setVerseOpen] = useState(false);
  const [verseIdx, setVerseIdx] = useState(0);

  useEffect(() => {
    setVerseIdx(getRandomVerseIdx());
  }, []);

  const openVerse = useCallback(() => {
    setVerseIdx((prev) => getRandomVerseIdx(prev));
    setVerseOpen(true);
  }, []);

  const verse = VERSES[verseIdx];

  return (
    <main className="mini">
      {/* top-right status */}
      <span className="mini-status" />
      <Link href="/settings" className="mini-orb-top" aria-label="Pengaturan">
        <span>R2</span>
      </Link>

      {/* vertical menu */}
      <div className="mini-list">
        {MENU.map((item) => (
          <button
            key={item.label}
            className="mini-item"
            onClick={() => navigateToApp(item.url)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* bottom orb → daily verse */}
      <button className="mini-orb-bottom" onClick={openVerse} aria-label="Ayat harian" />

      {/* subtle secondary navigation */}
      <div className="mini-secondary">
        <Link href="/brief">Ringkasan</Link>
        <Link href="/apps">Aplikasi</Link>
      </div>

      {/* verse overlay */}
      {verseOpen && (
        <div className="mini-verse" onClick={() => setVerseOpen(false)}>
          <p className="vtext">&ldquo;{verse.text}&rdquo;</p>
          <p className="ref">&mdash; {verse.ref}</p>
          <span className="hint">ketuk untuk menutup</span>
        </div>
      )}
    </main>
  );
}
