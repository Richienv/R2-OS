"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { APPS } from "@/lib/apps";

export default function SettingsPage() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") || "light");
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("r2os-theme", next);
  }

  return (
    <main className="flex min-h-[100dvh] w-full flex-col" style={{ background: "var(--bg)" }}>
      <header
        className="flex h-20 shrink-0 items-center justify-between border-b px-6 md:px-12"
        style={{ borderColor: "var(--border)" }}
      >
        <Link href="/" className="font-label text-[10px]" style={{ color: "var(--text-muted)" }}>
          ← OVERVIEW
        </Link>
        <span className="font-serif text-[28px]" style={{ color: "var(--text)" }}>
          Settings
        </span>
        <span className="font-label text-[10px]">&nbsp;</span>
      </header>

      <div className="flex flex-col px-8 md:px-16 lg:px-32 py-8">
        {/* Appearance */}
        <section className="flex flex-col gap-6 py-10">
          <span className="font-label text-[9px]">APPEARANCE</span>
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between w-full max-w-xs"
          >
            <span className="font-label text-[10px]" style={{ color: theme === "light" ? "var(--text)" : "var(--text-muted)" }}>
              Light mode
            </span>
            <div
              className="relative w-12 h-6 rounded-full transition-colors duration-200"
              style={{ background: "var(--border)" }}
            >
              <div
                className="absolute top-0.5 h-5 w-5 rounded-full transition-transform duration-200"
                style={{
                  background: "var(--text)",
                  transform: theme === "dark" ? "translateX(26px)" : "translateX(2px)",
                }}
              />
            </div>
            <span className="font-label text-[10px]" style={{ color: theme === "dark" ? "var(--text)" : "var(--text-muted)" }}>
              Dark mode
            </span>
          </button>
        </section>

        {/* Connected apps */}
        <section
          className="flex flex-col gap-4 py-10"
          style={{ borderTop: "0.5px solid var(--border)" }}
        >
          <span className="font-label text-[9px]">CONNECTED APPS</span>
          <ul className="flex flex-col">
            {APPS.map((a, i) => (
              <li
                key={a.id}
                className="flex items-center justify-between py-4"
                style={{ borderTop: i > 0 ? "0.5px solid var(--border)" : "none" }}
              >
                <span className="text-[14px] font-light" style={{ color: "var(--text)" }}>
                  {a.name}
                </span>
                <span className="font-label text-[10px] hidden sm:inline">
                  {a.url.replace(/^https?:\/\//, "")}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: a.colorVar }}
                  />
                  <span className="font-label text-[9px]">LIVE</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Profile */}
        <section
          className="flex flex-col gap-4 py-10"
          style={{ borderTop: "0.5px solid var(--border)" }}
        >
          <span className="font-label text-[9px]">PROFILE</span>
          <div className="flex flex-col gap-3">
            <Row k="NAME" v="Richie Kid Novell" />
            <Row k="LOCATION" v="Hangzhou, China" />
            <Row k="TIMEZONE" v="CST (UTC+8)" />
          </div>
        </section>

        {/* Notifications */}
        <section
          className="flex flex-col gap-4 py-10"
          style={{ borderTop: "0.5px solid var(--border)" }}
        >
          <span className="font-label text-[9px]">NOTIFICATIONS</span>
          <div className="flex flex-col gap-3">
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
    <div className="flex items-center justify-between py-2" style={{ borderBottom: "0.5px solid var(--border)" }}>
      <span className="font-label text-[10px]">{k}</span>
      <span className="text-[13px] font-light" style={{ color: "var(--text)" }}>{v}</span>
    </div>
  );
}

function Toggle({ label }: { label: string }) {
  const [on, setOn] = useState(false);
  return (
    <button
      onClick={() => setOn(!on)}
      className="flex items-center justify-between py-2"
      style={{ borderBottom: "0.5px solid var(--border)" }}
    >
      <span className="text-[13px] font-light" style={{ color: "var(--text)" }}>{label}</span>
      <div
        className="relative w-10 h-5 rounded-full transition-colors duration-200"
        style={{ background: on ? "var(--text)" : "var(--border)" }}
      >
        <div
          className="absolute top-0.5 h-4 w-4 rounded-full transition-transform duration-200"
          style={{
            background: "var(--bg)",
            transform: on ? "translateX(22px)" : "translateX(2px)",
          }}
        />
      </div>
    </button>
  );
}
