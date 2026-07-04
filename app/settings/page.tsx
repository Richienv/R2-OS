"use client";

import Link from "next/link";
import { useState } from "react";
import { APPS } from "@/lib/apps";
import { navigateToApp } from "@/lib/navigate";

export default function SettingsPage() {
  return (
    <main className="flex min-h-[100dvh] w-full flex-col" style={{ background: "var(--bg)" }}>
      <header
        className="flex h-[54px] shrink-0 items-center justify-between px-[22px]"
        style={{ borderBottom: "0.5px solid var(--line)" }}
      >
        <Link href="/" className="w-7 text-left" style={{ color: "var(--text)", fontSize: 19, textDecoration: "none" }}>
          &larr;
        </Link>
        <span style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.4px" }}>Settings</span>
        <span className="w-7" />
      </header>

      <div className="flex flex-col px-[22px] md:px-8 lg:px-24">
        {/* Bible translation */}
        <section className="flex flex-col gap-4 py-7">
          <span className="font-label" style={{ fontSize: 8, color: "var(--label)", letterSpacing: "0.22em" }}>
            BIBLE TRANSLATION
          </span>
          <span style={{ fontSize: 13, color: "var(--text)" }}>ESV (English Standard Version)</span>
        </section>

        {/* Connected apps */}
        <section className="flex flex-col gap-4 py-7" style={{ borderTop: "0.5px solid var(--line)" }}>
          <span className="font-label" style={{ fontSize: 8, color: "var(--label)", letterSpacing: "0.22em" }}>
            CONNECTED APPS
          </span>
          <ul className="flex flex-col">
            {APPS.map((a, i) => (
              <li
                key={a.id}
                className="flex items-center justify-between py-3"
                style={{ borderTop: i > 0 ? "0.5px solid var(--line)" : "none" }}
              >
                <div className="flex items-center gap-3">
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: a.grad,
                      boxShadow: `0 0 9px ${a.glow}`,
                    }}
                  />
                  <div className="flex flex-col gap-0.5">
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{a.name}</span>
                    <span className="font-label" style={{ fontSize: 9, color: "var(--label-dim)" }}>
                      {a.url.replace(/^https?:\/\//, "")}
                    </span>
                  </div>
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
        <section className="flex flex-col gap-4 py-7" style={{ borderTop: "0.5px solid var(--line)" }}>
          <span className="font-label" style={{ fontSize: 8, color: "var(--label)", letterSpacing: "0.22em" }}>
            PROFILE
          </span>
          <div className="flex flex-col">
            <Row k="NAME" v="Richie Kid Novell" />
            <Row k="LOCATION" v="Hangzhou, China" />
            <Row k="TIMEZONE" v="CST (UTC+8)" />
          </div>
        </section>

        {/* Notifications */}
        <section className="flex flex-col gap-4 py-7" style={{ borderTop: "0.5px solid var(--line)" }}>
          <span className="font-label" style={{ fontSize: 8, color: "var(--label)", letterSpacing: "0.22em" }}>
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
      <span className="font-label" style={{ fontSize: 9, color: "var(--label)" }}>{k}</span>
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
        className="relative h-5 w-9 rounded-full transition-colors duration-200"
        style={{
          background: on ? "var(--fire-grad)" : "var(--line)",
          boxShadow: on ? "0 0 10px var(--fire-glow)" : "none",
        }}
      >
        <div
          className="absolute top-0.5 h-4 w-4 rounded-full transition-transform duration-200"
          style={{
            background: on ? "#fff" : "var(--label-dim)",
            transform: on ? "translateX(18px)" : "translateX(2px)",
          }}
        />
      </div>
    </button>
  );
}
