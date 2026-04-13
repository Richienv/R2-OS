"use client";

import Link from "next/link";
import { APPS } from "@/lib/apps";
import { navigateToApp } from "@/lib/navigate";
import { useOSData } from "@/lib/useOSData";

export default function AppsPage() {
  const { data } = useOSData();

  return (
    <main className="flex min-h-[100dvh] w-full flex-col" style={{ background: "var(--bg)" }}>
      <header
        className="flex h-[52px] shrink-0 items-center justify-between px-5"
        style={{ borderBottom: "0.5px solid var(--line)" }}
      >
        <Link href="/" style={{ color: "var(--text)", fontSize: 18, fontWeight: 600 }}>
          &larr;
        </Link>
        <span style={{ color: "var(--text)", fontSize: 24, fontWeight: 600 }}>Apps</span>
        <span className="w-11" />
      </header>

      <div className="flex items-center px-5 py-3" style={{ borderBottom: "0.5px solid var(--line)" }}>
        <span className="font-label text-[9px]" style={{ color: "#444", fontStyle: "italic" }}>
          Tap OS button in any app to return here
        </span>
      </div>

      <ul className="flex flex-col">
        {APPS.map((app) => {
          const live = data.apps[app.id];
          const isLoading = !live || live.metric === "···";
          const isOffline = live && !live.ok && !isLoading;
          const summary = isLoading
            ? "…"
            : `${live?.metric ?? "—"} ${(live?.label ?? "").toLowerCase()}`;
          return (
            <li key={app.id} style={{ borderBottom: "0.5px solid var(--line)" }}>
              <button
                onClick={() => navigateToApp(app.url)}
                className="cell-press flex h-[72px] w-full items-center justify-between px-5 cursor-pointer text-left"
                style={{ opacity: isOffline ? 0.5 : 1 }}
              >
                <div className="flex flex-col gap-1">
                  <span style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>
                    {app.shortName}
                  </span>
                  <span className="font-label text-[9px]" style={{ color: "#444" }}>
                    {app.url.replace(/^https?:\/\//, "")}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{summary}</span>
                  <span className="font-label text-[10px]" style={{ color: "var(--text-muted)" }}>
                    OPEN &rarr;
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto">
        <nav
          className="flex h-14 shrink-0 items-center justify-around md:hidden"
          style={{ borderTop: "0.5px solid var(--line)", background: "var(--bg)" }}
        >
          <Link href="/" style={{ fontSize: 11, fontWeight: 500, color: "#444" }}>HOME</Link>
          <Link href="/brief" style={{ fontSize: 11, fontWeight: 500, color: "#444" }}>BRIEF</Link>
          <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text)" }}>APPS</span>
          <Link href="/settings" style={{ fontSize: 11, fontWeight: 500, color: "#444" }}>SET</Link>
        </nav>
      </div>
    </main>
  );
}
