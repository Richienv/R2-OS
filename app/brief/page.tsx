"use client";

import Link from "next/link";
import { APPS } from "@/lib/apps";
import { navigateToApp } from "@/lib/navigate";
import { useOSData } from "@/lib/useOSData";
import type { AggregatedApp } from "@/app/api/aggregate/route";

const SECTIONS: { appId: "fit" | "school" | "finance" | "build"; title: string }[] = [
  { appId: "fit", title: "FITNESS" },
  { appId: "school", title: "GMBA" },
  { appId: "finance", title: "MONEY" },
  { appId: "build", title: "BUILD" },
];

function headlineFor(live: AggregatedApp | undefined): string {
  if (!live || live.metric === "···") return "Loading…";
  if (live.alertText) return live.alertText;
  const label = live.label ? ` ${live.label}` : "";
  return `${live.metric}${label}`;
}

export default function BriefPage() {
  const { data } = useOSData();
  const school = APPS.find((a) => a.id === "school")!;
  const schoolLive = data.apps.school;
  const cta = schoolLive?.alertText ?? schoolLive?.detail ?? "Open your school dashboard.";

  return (
    <main className="flex min-h-[100dvh] w-full flex-col" style={{ background: "var(--bg)" }}>
      <header
        className="flex h-[52px] shrink-0 items-center justify-between px-5"
        style={{ borderBottom: "0.5px solid var(--line)" }}
      >
        <Link href="/" style={{ color: "var(--text)", fontSize: 18, fontWeight: 600 }}>
          &larr;
        </Link>
        <span style={{ color: "var(--text)", fontSize: 24, fontWeight: 600 }}>Daily Brief</span>
        <span className="w-11" />
      </header>

      <div className="flex flex-col px-5 md:px-8 lg:px-24">
        {SECTIONS.map((s, i) => {
          const live = data.apps[s.appId];
          const headline = headlineFor(live);
          const detail = live?.detail;
          return (
            <section
              key={s.appId}
              className="flex flex-col gap-2 py-7"
              style={{ borderTop: i > 0 ? "0.5px solid var(--line)" : "none" }}
            >
              <span className="font-label text-[8px]" style={{ color: "#444", letterSpacing: "3px" }}>
                {s.title}
              </span>
              <h2 style={{ color: "var(--text)", fontSize: 18, fontWeight: 500, lineHeight: 1.3 }}>
                {headline}
              </h2>
              {detail && (
                <p style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.6 }}>
                  {detail}
                </p>
              )}
              {!live?.ok && live?.metric !== "···" && (
                <p className="font-label text-[9px]" style={{ color: "#444" }}>
                  app offline
                </p>
              )}
            </section>
          );
        })}

        <section
          className="flex flex-col gap-3 py-7"
          style={{ borderTop: "1px solid var(--line-strong)" }}
        >
          <span style={{ color: "var(--text)", fontSize: 15, fontWeight: 500 }}>
            &rarr; Open GMBA
          </span>
          <span style={{ color: "var(--text-muted)", fontSize: 13 }}>{cta}</span>
          <button
            onClick={() => navigateToApp(school.url)}
            className="cell-press self-start mt-1 px-4 py-2 cursor-pointer"
            style={{
              color: "var(--bg)",
              background: "var(--text)",
              fontSize: 11,
              fontWeight: 500,
            }}
          >
            OPEN GMBA
          </button>
        </section>
      </div>
    </main>
  );
}
