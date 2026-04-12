"use client";

import Link from "next/link";
import { useState } from "react";
import { APPS } from "@/lib/apps";
import type { Translation } from "@/lib/verses";

const TRANSLATIONS: { key: Translation; label: string }[] = [
  { key: "esv", label: "ESV" },
  { key: "niv", label: "NIV" },
  { key: "kjv", label: "KJV" },
  { key: "nlt", label: "NLT" },
];

export default function SettingsPage() {
  const [translation, setTranslationState] = useState<Translation>(() => {
    if (typeof window === "undefined") return "esv";
    return (localStorage.getItem("r2os-translation") as Translation) || "esv";
  });

  function setTranslation(t: Translation) {
    setTranslationState(t);
    localStorage.setItem("r2os-translation", t);
  }

  return (
    <main className="flex min-h-[100dvh] w-full flex-col" style={{ background: "var(--bg)" }}>
      <header
        className="flex h-[52px] shrink-0 items-center justify-between px-5"
        style={{ borderBottom: "0.5px solid var(--line)" }}
      >
        <Link href="/" style={{ color: "var(--text)", fontSize: 18, fontWeight: 600 }}>
          &larr;
        </Link>
        <span style={{ color: "var(--text)", fontSize: 24, fontWeight: 600 }}>Settings</span>
        <span className="w-11" />
      </header>

      <div className="flex flex-col px-5 md:px-8 lg:px-24">
        {/* Bible translation */}
        <section className="flex flex-col gap-4 py-7">
          <span className="font-label text-[8px]" style={{ color: "#444", letterSpacing: "3px" }}>
            BIBLE TRANSLATION
          </span>
          <div className="flex gap-2">
            {TRANSLATIONS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTranslation(t.key)}
                className="font-label text-[10px] px-3 py-1.5 transition-colors duration-100"
                style={{
                  color: translation === t.key ? "var(--bg)" : "var(--text-muted)",
                  background: translation === t.key ? "var(--text)" : "transparent",
                  border: `0.5px solid ${translation === t.key ? "var(--text)" : "var(--line)"}`,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* Connected apps */}
        <section
          className="flex flex-col gap-4 py-7"
          style={{ borderTop: "0.5px solid var(--line)" }}
        >
          <span className="font-label text-[8px]" style={{ color: "#444", letterSpacing: "3px" }}>
            CONNECTED APPS
          </span>
          <ul className="flex flex-col">
            {APPS.map((a, i) => (
              <li
                key={a.id}
                className="flex items-center justify-between py-3"
                style={{ borderTop: i > 0 ? "0.5px solid var(--line)" : "none" }}
              >
                <div className="flex flex-col gap-0.5">
                  <span style={{ fontSize: 13, fontWeight: 400, color: "var(--text)" }}>
                    {a.name}
                  </span>
                  <span className="font-label text-[9px]" style={{ color: "#444" }}>
                    {a.url.replace(/^https?:\/\//, "")}
                  </span>
                </div>
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener"
                  className="font-label text-[9px]"
                  style={{ color: "var(--text-dim)" }}
                >
                  OPEN &rarr;
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Profile */}
        <section
          className="flex flex-col gap-4 py-7"
          style={{ borderTop: "0.5px solid var(--line)" }}
        >
          <span className="font-label text-[8px]" style={{ color: "#444", letterSpacing: "3px" }}>
            PROFILE
          </span>
          <div className="flex flex-col">
            <Row k="NAME" v="Richie Kid Novell" />
            <Row k="LOCATION" v="Hangzhou, China" />
            <Row k="TIMEZONE" v="CST (UTC+8)" />
          </div>
        </section>

        {/* Notifications */}
        <section
          className="flex flex-col gap-4 py-7"
          style={{ borderTop: "0.5px solid var(--line)" }}
        >
          <span className="font-label text-[8px]" style={{ color: "#444", letterSpacing: "3px" }}>
            NOTIFICATIONS
          </span>
          <div className="flex flex-col">
            <Toggle label="Morning brief (8am)" />
            <Toggle label="Deadline alerts" />
            <Toggle label="Budget alerts" />
          </div>
        </section>
      </div>
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div
      className="flex items-center justify-between py-3"
      style={{ borderBottom: "0.5px solid var(--line)" }}
    >
      <span className="font-label text-[9px]" style={{ color: "#444" }}>{k}</span>
      <span style={{ fontSize: 13, color: "var(--text)" }}>{v}</span>
    </div>
  );
}

function Toggle({ label }: { label: string }) {
  const [on, setOn] = useState(false);
  return (
    <button
      onClick={() => setOn(!on)}
      className="flex items-center justify-between py-3"
      style={{ borderBottom: "0.5px solid var(--line)" }}
    >
      <span style={{ fontSize: 13, color: "var(--text)" }}>{label}</span>
      <div
        className="relative w-9 h-5 rounded-full transition-colors duration-200"
        style={{ background: on ? "var(--text)" : "var(--line)" }}
      >
        <div
          className="absolute top-0.5 h-4 w-4 rounded-full transition-transform duration-200"
          style={{
            background: "var(--bg)",
            transform: on ? "translateX(18px)" : "translateX(2px)",
          }}
        />
      </div>
    </button>
  );
}
