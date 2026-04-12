"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { APPS } from "@/lib/apps";
import type { Translation } from "@/lib/verses";

const TRANSLATIONS: { key: Translation; label: string }[] = [
  { key: "esv", label: "ESV" },
  { key: "niv", label: "NIV" },
  { key: "kjv", label: "KJV" },
  { key: "nlt", label: "NLT" },
];

export default function SettingsPage() {
  const [theme, setTheme] = useState("light");
  const [translation, setTranslationState] = useState<Translation>("esv");

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") || "light");
    setTranslationState(
      (localStorage.getItem("r2os-translation") as Translation) || "esv"
    );
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("r2os-theme", next);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", next === "dark" ? "#080808" : "#F2F0EB");
  }

  function setTranslation(t: Translation) {
    setTranslationState(t);
    localStorage.setItem("r2os-translation", t);
  }

  return (
    <main className="flex min-h-[100dvh] w-full flex-col" style={{ background: "var(--bg)" }}>
      <header
        className="flex h-[52px] shrink-0 items-center justify-between px-6"
        style={{ borderBottom: "0.5px solid var(--border)" }}
      >
        <Link
          href="/"
          className="flex h-11 w-11 items-center justify-start font-serif text-[18px]"
          style={{ color: "var(--fg)" }}
        >
          &larr;
        </Link>
        <span className="font-serif text-[22px]" style={{ color: "var(--fg)" }}>
          Settings
        </span>
        <span className="w-11" />
      </header>

      <div className="flex flex-col px-6 md:px-12 lg:px-32 py-4">
        {/* Appearance */}
        <section className="flex flex-col gap-5 py-8">
          <span className="font-label text-[9px]" style={{ color: "var(--muted)" }}>
            APPEARANCE
          </span>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-4 w-full max-w-xs"
          >
            <span
              className="font-label text-[9px]"
              style={{ color: theme === "light" ? "var(--fg)" : "var(--muted)" }}
            >
              LIGHT MODE
            </span>
            <div className="relative flex-1 h-px" style={{ background: "var(--border)" }}>
              <div
                className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full transition-all duration-200"
                style={{
                  background: "var(--fg)",
                  left: theme === "dark" ? "calc(100% - 12px)" : "0px",
                }}
              />
            </div>
            <span
              className="font-label text-[9px]"
              style={{ color: theme === "dark" ? "var(--fg)" : "var(--muted)" }}
            >
              DARK MODE
            </span>
          </button>
        </section>

        {/* Bible translation */}
        <section
          className="flex flex-col gap-4 py-8"
          style={{ borderTop: "0.5px solid var(--border)" }}
        >
          <span className="font-label text-[9px]" style={{ color: "var(--muted)" }}>
            BIBLE TRANSLATION
          </span>
          <div className="flex gap-3">
            {TRANSLATIONS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTranslation(t.key)}
                className="font-label text-[10px] px-3 py-2 transition-colors duration-150"
                style={{
                  color: translation === t.key ? "var(--bg)" : "var(--muted)",
                  background: translation === t.key ? "var(--fg)" : "transparent",
                  border: `0.5px solid ${translation === t.key ? "var(--fg)" : "var(--border)"}`,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* Connected apps */}
        <section
          className="flex flex-col gap-4 py-8"
          style={{ borderTop: "0.5px solid var(--border)" }}
        >
          <span className="font-label text-[9px]" style={{ color: "var(--muted)" }}>
            CONNECTED APPS
          </span>
          <ul className="flex flex-col">
            {APPS.map((a, i) => (
              <li
                key={a.id}
                className="flex items-center justify-between py-3"
                style={{ borderTop: i > 0 ? "0.5px solid var(--border)" : "none" }}
              >
                <span className="text-[13px] font-light" style={{ color: "var(--fg)" }}>
                  {a.name}
                </span>
                <span
                  className="font-label text-[9px] hidden sm:inline"
                  style={{ color: "var(--muted)" }}
                >
                  {a.url.replace(/^https?:\/\//, "")}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: "var(--fg)" }}
                  />
                  <span className="font-label text-[8px]" style={{ color: "var(--dim)" }}>
                    LIVE
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Profile */}
        <section
          className="flex flex-col gap-4 py-8"
          style={{ borderTop: "0.5px solid var(--border)" }}
        >
          <span className="font-label text-[9px]" style={{ color: "var(--muted)" }}>
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
          className="flex flex-col gap-4 py-8"
          style={{ borderTop: "0.5px solid var(--border)" }}
        >
          <span className="font-label text-[9px]" style={{ color: "var(--muted)" }}>
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
      style={{ borderBottom: "0.5px solid var(--border)" }}
    >
      <span className="font-label text-[9px]" style={{ color: "var(--muted)" }}>{k}</span>
      <span className="text-[13px] font-light" style={{ color: "var(--fg)" }}>{v}</span>
    </div>
  );
}

function Toggle({ label }: { label: string }) {
  const [on, setOn] = useState(false);
  return (
    <button
      onClick={() => setOn(!on)}
      className="flex items-center justify-between py-3"
      style={{ borderBottom: "0.5px solid var(--border)" }}
    >
      <span className="text-[13px] font-light" style={{ color: "var(--fg)" }}>{label}</span>
      <div className="relative w-8 h-px" style={{ background: "var(--border)" }}>
        <div
          className="absolute top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full transition-all duration-200"
          style={{
            background: on ? "var(--fg)" : "var(--muted)",
            left: on ? "calc(100% - 10px)" : "0px",
          }}
        />
      </div>
    </button>
  );
}
