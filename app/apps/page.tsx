"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { APPS } from "@/lib/apps";

function detectMobile() {
  if (typeof window === "undefined") return true;
  return window.innerWidth < 768 || /iPhone|iPad|Android/i.test(navigator.userAgent);
}

export default function AppsPage() {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(detectMobile());
  }, []);

  return (
    <main className="flex min-h-[100dvh] w-full flex-col" style={{ background: "var(--bg)" }}>
      <header
        className="flex h-[52px] shrink-0 items-center justify-between px-6"
        style={{ borderBottom: "0.5px solid var(--border)" }}
      >
        <Link href="/" className="font-serif text-[18px]" style={{ color: "var(--fg)" }}>
          &larr;
        </Link>
        <span className="font-serif text-[22px]" style={{ color: "var(--fg)" }}>Apps</span>
        <span className="w-11" />
      </header>

      <div className="flex flex-col gap-px px-4 py-4 md:px-8">
        {APPS.map((app) => {
          const statusText = app.alert
            ? `⚡ ${app.alertMessage}`
            : `${app.metric} ${app.label.toLowerCase()}`;

          return (
            <a
              key={app.id}
              href={app.url}
              target={isMobile ? "_self" : "_blank"}
              rel="noopener"
              className="cell-press flex flex-col overflow-hidden"
              style={{ border: "0.5px solid var(--border)" }}
            >
              {/* Dark title bar */}
              <div
                className="flex h-8 items-center justify-between px-3.5"
                style={{ background: "var(--fg)" }}
              >
                <span className="font-serif text-[14px]" style={{ color: "var(--bg)" }}>
                  {app.name}
                </span>
                <span className="font-label text-[9px]" style={{ color: "var(--bg)", opacity: 0.6 }}>
                  OPEN &rarr;
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-1 px-3.5 py-3">
                <span
                  className="font-label text-[10px]"
                  style={{
                    color: app.alert ? "var(--fg)" : "var(--dim)",
                    fontWeight: app.alert ? 500 : 400,
                  }}
                >
                  {statusText}
                </span>
                <span className="font-label text-[9px]" style={{ color: "var(--muted)" }}>
                  {app.url.replace(/^https?:\/\//, "")}
                </span>
              </div>
            </a>
          );
        })}
      </div>

      <div className="mt-auto">
        <nav
          className="flex h-[52px] shrink-0 items-center justify-around md:hidden"
          style={{ borderTop: "0.5px solid var(--border)", background: "var(--bg)" }}
        >
          <Link href="/" className="font-label text-[9px]" style={{ color: "var(--muted)" }}>HOME</Link>
          <Link href="/brief" className="font-label text-[9px]" style={{ color: "var(--muted)" }}>BRIEF</Link>
          <span className="font-label text-[9px]" style={{ color: "var(--fg)" }}>APPS</span>
          <Link href="/settings" className="font-label text-[9px]" style={{ color: "var(--muted)" }}>SET</Link>
        </nav>
      </div>
    </main>
  );
}
