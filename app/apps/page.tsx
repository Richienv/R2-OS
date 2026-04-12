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
        <Link
          href="/"
          className="flex h-11 w-11 items-center justify-start font-serif text-[18px]"
          style={{ color: "var(--fg)" }}
        >
          &larr;
        </Link>
        <span className="font-serif text-[22px]" style={{ color: "var(--fg)" }}>
          Apps
        </span>
        <span className="w-11" />
      </header>

      <ul className="flex flex-col">
        {APPS.map((app, i) => {
          const statusText = app.alert
            ? `\u26a0 ${app.alertMessage}`
            : `${app.metric} ${app.label.toLowerCase()}`;

          return (
            <li key={app.id} style={{ borderTop: i > 0 ? "0.5px solid var(--border)" : "none" }}>
              <a
                href={app.url}
                target={isMobile ? "_self" : "_blank"}
                rel="noopener"
                className="cell-press flex items-center justify-between px-6 py-5"
              >
                <div className="flex flex-col gap-1.5">
                  <span className="font-serif text-[18px]" style={{ color: "var(--fg)" }}>
                    {app.name}
                  </span>
                  <span className="font-label text-[9px]" style={{ color: "var(--muted)" }}>
                    {app.url.replace(/^https?:\/\//, "")}
                  </span>
                  <span
                    className="font-label text-[10px]"
                    style={{
                      color: "var(--dim)",
                      fontWeight: app.alert ? 500 : 400,
                    }}
                  >
                    {statusText}
                  </span>
                </div>
                <span className="font-label text-[14px]" style={{ color: "var(--muted)" }}>
                  &rsaquo;
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      {/* Bottom nav */}
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
