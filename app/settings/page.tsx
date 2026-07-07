"use client";

import Link from "next/link";
import { useState } from "react";
import { APPS } from "@/lib/apps";
import { navigateToApp } from "@/lib/navigate";
import { BottomNav } from "@/app/BottomNav";

export default function SettingsPage() {
  return (
    <main className="flex h-[100dvh] w-full flex-col" style={{ background: "var(--bg-void)" }}>
      <header className="topbar">
        <Link href="/" className="back">
          &larr;
        </Link>
        <span className="title">Settings</span>
        <span className="spacer" />
      </header>

      <div className="screen">
        {/* Bible translation */}
        <section className="set-section">
          <span className="set-eyebrow">Bible Translation</span>
          <span style={{ fontSize: 13, color: "var(--text)" }}>ESV (English Standard Version)</span>
        </section>

        {/* Connected apps */}
        <section className="set-section">
          <span className="set-eyebrow">Connected Apps</span>
          <ul className="flex flex-col">
            {APPS.map((a, i) => (
              <li
                key={a.id}
                className="flex items-center justify-between py-3"
                style={{ borderTop: i > 0 ? "0.5px solid var(--hairline)" : "none" }}
              >
                <div className="flex flex-col gap-0.5">
                  <span style={{ fontSize: 13, fontWeight: 400, color: "var(--text)" }}>
                    {a.name}
                  </span>
                  <span className="font-mono" style={{ fontSize: 9, color: "var(--text-faint)" }}>
                    {a.host}
                  </span>
                </div>
                <button
                  onClick={() => navigateToApp(a.url)}
                  className="font-label cursor-pointer"
                  style={{ fontSize: 9, color: "var(--text-dim)" }}
                >
                  OPEN &rarr;
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Profile */}
        <section className="set-section">
          <span className="set-eyebrow">Profile</span>
          <div className="flex flex-col">
            <Row k="NAME" v="Richie Kid Novell" />
            <Row k="LOCATION" v="Hangzhou, China" />
            <Row k="TIMEZONE" v="CST (UTC+8)" />
          </div>
        </section>

        {/* Notifications */}
        <section className="set-section">
          <span className="set-eyebrow">Notifications</span>
          <div className="flex flex-col">
            <Toggle label="Morning brief (8am)" />
            <Toggle label="Deadline alerts" />
            <Toggle label="Budget alerts" />
          </div>
        </section>
      </div>

      <BottomNav active="home" />
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div
      className="flex items-center justify-between py-3"
      style={{ borderBottom: "0.5px solid var(--hairline)" }}
    >
      <span className="font-label" style={{ fontSize: 9, color: "var(--text-faint)" }}>
        {k}
      </span>
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
      style={{ borderBottom: "0.5px solid var(--hairline)" }}
    >
      <span style={{ fontSize: 13, color: "var(--text)" }}>{label}</span>
      <div
        className="relative w-9 h-5 rounded-full transition-colors duration-200"
        style={{ background: on ? "var(--fire-glow)" : "var(--hairline)" }}
      >
        <div
          className="absolute top-0.5 h-4 w-4 rounded-full transition-transform duration-200"
          style={{
            background: on ? "#fff" : "var(--text-faint)",
            transform: on ? "translateX(18px)" : "translateX(2px)",
          }}
        />
      </div>
    </button>
  );
}
