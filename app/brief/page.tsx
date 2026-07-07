"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { APPS, type AppKey } from "@/lib/apps";
import { navigateToApp } from "@/lib/navigate";
import { useOSData } from "@/lib/useOSData";
import { BottomNav } from "@/app/BottomNav";
import type { AggregatedApp } from "@/app/api/aggregate/route";

const SECTIONS: { appId: AppKey; title: string }[] = [
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
  const [spot, setSpot] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSpot((s) => (s + 1) % SECTIONS.length), 2200);
    return () => clearInterval(t);
  }, []);

  const school = APPS.find((a) => a.id === "school")!;

  return (
    <main className="flex h-[100dvh] w-full flex-col" style={{ background: "var(--bg-void)" }}>
      <header className="topbar">
        <Link href="/" className="back">
          &larr;
        </Link>
        <span className="title">Daily Brief</span>
        <span className="spacer" />
      </header>

      <div className="screen">
        <div className="brief-list">
          {SECTIONS.map((s, i) => {
            const app = APPS.find((a) => a.id === s.appId)!;
            const live = data.apps[s.appId];
            const headline = headlineFor(live);
            const detail = live?.detail;
            return (
              <div key={s.appId} className={`brief-row${i === spot ? "" : " dim"}`}>
                <div className="tag">
                  <span
                    className="dot"
                    style={{
                      background: app.accentGrad,
                      boxShadow: `0 0 9px ${app.accentGlow}`,
                    }}
                  />
                  <span className="tag-label">{s.title}</span>
                </div>
                <div className="headline">{headline}</div>
                {detail && <div className="detail">{detail}</div>}
              </div>
            );
          })}
        </div>

        <div className="cta-wrap">
          <button className="cta" onClick={() => navigateToApp(school.url)}>
            <div className="glaze" />
            <span>Open GMBA</span>
            <span>&#8599;</span>
          </button>
        </div>
      </div>

      <BottomNav active="brief" />
    </main>
  );
}
