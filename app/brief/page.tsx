import Link from "next/link";
import { APPS } from "@/lib/apps";

type Section = {
  appId: string;
  title: string;
  headline: string;
  details: string[];
};

const SECTIONS: Section[] = [
  {
    appId: "fit",
    title: "FITNESS",
    headline: "843 kcal remaining today.",
    details: ["Protein complete. Pull B not logged.", "Dinner not tracked yet."],
  },
  {
    appId: "school",
    title: "SCHOOL",
    headline: "IB Presentation in 4 days.",
    details: ["Group 6, OpenAI vs DeepSeek.", "Prof. Collinson. Status: in progress."],
  },
  {
    appId: "finance",
    title: "FINANCE",
    headline: "580 RMB free this month.",
    details: ["37 RMB daily limit. 0 spent today.", "20 days until next allowance."],
  },
  {
    appId: "build",
    title: "BUILD",
    headline: "2 of 3 projects have tasks done.",
    details: ["ERP: Fix bank recon \u2014 pending.", "OIC: ESP32 pins \u2014 done.", "R2·FIT: Database \u2014 done."],
  },
];

export default function BriefPage() {
  const school = APPS.find((a) => a.id === "school")!;

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
        {SECTIONS.map((s, i) => (
          <section
            key={s.appId}
            className="flex flex-col gap-2 py-7"
            style={{ borderTop: i > 0 ? "0.5px solid var(--line)" : "none" }}
          >
            <span className="font-label text-[8px]" style={{ color: "#444", letterSpacing: "3px" }}>
              {s.title}
            </span>
            <h2 style={{ color: "var(--text)", fontSize: 18, fontWeight: 500, lineHeight: 1.3 }}>
              {s.headline}
            </h2>
            <div className="flex flex-col gap-0.5">
              {s.details.map((d) => (
                <p key={d} style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.6 }}>
                  {d}
                </p>
              ))}
            </div>
          </section>
        ))}

        <section
          className="flex flex-col gap-3 py-7"
          style={{ borderTop: "1px solid var(--line-strong)" }}
        >
          <span style={{ color: "var(--text)", fontSize: 15, fontWeight: 500 }}>
            &rarr; Open R2·SCHOOL
          </span>
          <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
            Your IB presentation is in 4 days.
          </span>
          <a
            href={school.url}
            className="cell-press self-start mt-1 px-4 py-2"
            style={{
              color: "var(--bg)",
              background: "var(--text)",
              fontSize: 11,
              fontWeight: 500,
            }}
          >
            OPEN R2·SCHOOL
          </a>
        </section>
      </div>
    </main>
  );
}
