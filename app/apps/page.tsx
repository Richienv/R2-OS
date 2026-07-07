"use client";

import Link from "next/link";
import { APPS } from "@/lib/apps";
import { navigateToApp } from "@/lib/navigate";
import { useOSData } from "@/lib/useOSData";
import { BottomNav } from "@/app/BottomNav";

export default function AppsPage() {
  const { data } = useOSData();

  return (
    <main className="flex h-[100dvh] w-full flex-col" style={{ background: "var(--bg-void)" }}>
      <header className="topbar">
        <Link href="/" className="back">
          &larr;
        </Link>
        <span className="title">Apps</span>
        <span className="spacer" />
      </header>

      <div className="screen">
        <div className="apps-list">
          {APPS.map((app) => {
            const live = data.apps[app.id];
            const isLoading = !live || live.metric === "···";
            const summary = isLoading
              ? "…"
              : `${live?.metric ?? "—"} ${(live?.label ?? "").toLowerCase()}`;
            return (
              <button
                key={app.id}
                className="app-row"
                onClick={() => navigateToApp(app.url)}
              >
                <div
                  className="badge"
                  style={{
                    background: app.accentGrad,
                    boxShadow: `inset 0 1.5px 1px rgba(255,255,255,.45), inset 0 -3px 7px rgba(0,0,0,.35), 0 6px 16px ${app.accentGlow}`,
                  }}
                >
                  <span>{app.shortName}</span>
                </div>
                <div className="meta">
                  <span className="name">{app.name}</span>
                  <span className="host">{app.host}</span>
                </div>
                <div className="end">
                  <span className="summary">{summary}</span>
                  <span className="open" style={{ color: app.accentGlow }}>
                    OPEN &rarr;
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <BottomNav active="apps" />
    </main>
  );
}
