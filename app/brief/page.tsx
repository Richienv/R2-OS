"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { APPS } from "@/lib/apps";
import { navigateToApp } from "@/lib/navigate";
import { useOSData } from "@/lib/useOSData";
import type { AggregatedApp } from "@/app/api/aggregate/route";
import BottomNav from "@/app/components/BottomNav";

const SECTIONS: { appId: "fit" | "school" | "finance" | "build"; title: string }[] = [
  { appId: "fit", title: "Fitness" },
  { appId: "school", title: "GMBA" },
  { appId: "finance", title: "Money" },
  { appId: "build", title: "Build" },
];

function headlineFor(live: AggregatedApp | undefined): string {
  if (!live || live.metric === "···") return "Loading…";
  if (live.alertText) return live.alertText;
  const label = live.label ? ` ${live.label}` : "";
  return `${live.metric}${label}`;
}

export default function BriefPage() {
  const { data } = useOSData();
  const [focus, setFocus] = useState(92);
  const [spot, setSpot] = useState(0);

  useEffect(() => {
    const jit = setInterval(() => setFocus(90 + Math.floor(Math.random() * 6)), 900);
    const rot = setInterval(() => setSpot((s) => (s + 1) % SECTIONS.length), 2200);
    return () => {
      clearInterval(jit);
      clearInterval(rot);
    };
  }, []);

  const school = APPS.find((a) => a.id === "school")!;

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
          <span style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.4px" }}>
            Daily Brief
          </span>
          <span className="w-7" />
        </header>

        {/* Live focus stat */}
        <div className="flex items-baseline gap-2.5" style={{ padding: "22px 22px 6px" }}>
          <span
            className="fire-text"
            style={{ fontSize: 52, fontWeight: 800, lineHeight: 0.9, letterSpacing: "-2px" }}
          >
            {focus}%
          </span>
          <div className="flex flex-col">
            <span className="font-label" style={{ fontSize: 9, letterSpacing: "0.16em", color: "var(--label)" }}>
              Focus
            </span>
            <span style={{ fontSize: 12, color: "rgba(248,244,240,0.5)" }}>today · trending up</span>
          </div>
        </div>

        {/* Sections */}
        <div style={{ padding: "8px 22px 4px" }}>
          {SECTIONS.map((s, i) => {
            const app = APPS.find((a) => a.id === s.appId)!;
            const live = data.apps[s.appId];
            const dim = spot !== i;
            return (
              <section
                key={s.appId}
                style={{
                  padding: "18px 0",
                  borderTop: i > 0 ? "0.5px solid var(--line)" : "none",
                  transition: "opacity .5s ease, filter .5s ease",
                  opacity: dim ? 0.32 : 1,
                  filter: dim ? "saturate(.4)" : "none",
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: app.grad,
                      boxShadow: `0 0 9px ${app.glow}`,
                    }}
                  />
                  <span className="font-label" style={{ fontSize: 8, letterSpacing: "0.22em", color: "var(--label)" }}>
                    {s.title}
                  </span>
                </div>
                <h2
                  style={{
                    margin: "8px 0 0",
                    fontSize: 19,
                    fontWeight: 600,
                    lineHeight: 1.25,
                    color: "var(--text)",
                    letterSpacing: "-0.3px",
                  }}
                >
                  {headlineFor(live)}
                </h2>
                {live?.detail && (
                  <p style={{ margin: "6px 0 0", fontSize: 13, lineHeight: 1.55, color: "var(--text-muted)" }}>
                    {live.detail}
                  </p>
                )}
                {live && !live.ok && live.metric !== "···" && (
                  <p className="font-label" style={{ margin: "6px 0 0", fontSize: 9, color: "var(--label-dim)" }}>
                    app offline
                  </p>
                )}
              </section>
            );
          })}
        </div>

        {/* Metallic CTA */}
        <div style={{ padding: "16px 22px 26px" }}>
          <button
            onClick={() => navigateToApp(school.url)}
            className="cell-press relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden"
            style={{
              height: 54,
              border: "none",
              borderRadius: 15,
              background: "var(--fire-grad)",
              boxShadow:
                "inset 0 1.5px 1px var(--fire-hi), inset 0 -4px 9px var(--fire-lo), 0 14px 30px var(--fire-glow)",
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 60,
                height: "100%",
                background: "linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent)",
                animation: "r2glaze 3.4s ease-in-out infinite",
              }}
            />
            <span className="relative" style={{ color: "#fff", fontSize: 15, fontWeight: 700, letterSpacing: "0.2px" }}>
              Open GMBA
            </span>
            <span className="relative" style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>
              ↗
            </span>
          </button>
        </div>
      </div>

      <BottomNav active="BRIEF" />
    </main>
  );
}
