"use client";

import Link from "next/link";
import { APPS } from "@/lib/apps";
import { navigateToApp } from "@/lib/navigate";
import { useOSData } from "@/lib/useOSData";
import BottomNav from "@/app/components/BottomNav";

export default function AppsPage() {
  const { data } = useOSData();

  return (
    <main className="flex h-[100dvh] w-full flex-col" style={{ background: "var(--bg)" }}>
      <div className="r2scr flex min-h-0 flex-1 flex-col overflow-y-auto">
        {/* Header */}
        <header
          className="flex h-[54px] shrink-0 items-center justify-between px-[22px]"
          style={{ borderBottom: "0.5px solid var(--line)" }}
        >
          <Link href="/" className="w-7 text-left" style={{ color: "var(--text)", fontSize: 19, textDecoration: "none" }}>
            &larr;
          </Link>
          <span style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.4px" }}>Apps</span>
          <span className="w-7" />
        </header>

        <div className="flex flex-col gap-3" style={{ padding: "16px 20px 24px" }}>
          {APPS.map((app) => {
            const live = data.apps[app.id];
            const isLoading = !live || live.metric === "···";
            const isOffline = live && !live.ok && !isLoading;
            const summary = isLoading
              ? "…"
              : `${live?.metric ?? "—"} ${(live?.label ?? "").toLowerCase()}`;
            return (
              <button
                key={app.id}
                onClick={() => navigateToApp(app.url)}
                className="cell-press card flex w-full cursor-pointer items-center gap-3.5 text-left"
                style={{
                  padding: "13px 15px",
                  borderRadius: 18,
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,.06), 0 20px 44px rgba(0,0,0,.5)",
                  opacity: isOffline ? 0.55 : 1,
                }}
              >
                <div
                  className="flex shrink-0 items-center justify-center"
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 14,
                    background: app.grad,
                    boxShadow: `inset 0 1.5px 1px rgba(255,255,255,.45), inset 0 -3px 7px rgba(0,0,0,.35), 0 6px 16px ${app.glow}`,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#fff",
                      letterSpacing: "-0.3px",
                      textShadow: "0 1px 2px rgba(0,0,0,.35)",
                    }}
                  >
                    {app.shortName}
                  </span>
                </div>
                <div className="flex flex-col gap-[3px] text-left">
                  <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.3px" }}>
                    {app.name}
                  </span>
                  <span className="font-label" style={{ fontSize: 9, letterSpacing: "0.08em", color: "var(--label-dim)" }}>
                    {app.url.replace(/^https?:\/\//, "")}
                  </span>
                </div>
                <div className="ml-auto flex flex-col items-end gap-1">
                  <span style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 500 }}>{summary}</span>
                  <span className="font-label" style={{ fontSize: 9, letterSpacing: "0.14em", color: app.glow }}>
                    OPEN &rarr;
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <BottomNav active="APPS" />
    </main>
  );
}
