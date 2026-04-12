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
    details: [
      "Protein complete. Pull B not logged.",
      "Dinner not tracked yet.",
    ],
  },
  {
    appId: "school",
    title: "SCHOOL",
    headline: "IB Presentation in 4 days.",
    details: [
      "Group 6, OpenAI vs DeepSeek.",
      "Prof. Collinson. Status: in progress.",
    ],
  },
  {
    appId: "finance",
    title: "FINANCE",
    headline: "580 RMB free this month.",
    details: [
      "37 RMB daily limit. 0 spent today.",
      "20 days until next allowance.",
    ],
  },
  {
    appId: "build",
    title: "BUILD",
    headline: "2 of 3 projects have tasks done.",
    details: [
      "ERP: Fix bank recon — pending.",
      "OIC: ESP32 pins — done.",
      "R2·FIT: Database — done.",
    ],
  },
];

export default function BriefPage() {
  const school = APPS.find((a) => a.id === "school")!;

  return (
    <main className="flex min-h-[100dvh] w-full flex-col" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header
        className="flex h-20 shrink-0 items-center justify-between border-b px-6 md:px-12"
        style={{ borderColor: "var(--border)" }}
      >
        <Link href="/" className="font-label text-[10px]" style={{ color: "var(--text-muted)" }}>
          ← OVERVIEW
        </Link>
        <span className="font-serif text-[28px]" style={{ color: "var(--text)" }}>
          Daily Brief
        </span>
        <span className="font-label text-[10px]">&nbsp;</span>
      </header>

      {/* Sections */}
      <div className="flex flex-col px-8 md:px-16 lg:px-32 py-8">
        {SECTIONS.map((s, i) => {
          const app = APPS.find((a) => a.id === s.appId)!;
          return (
            <section
              key={s.appId}
              className="flex flex-col gap-4 py-10"
              style={{
                borderTop: i > 0 ? "0.5px solid var(--border)" : "none",
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: app.colorVar }}
                />
                <span className="font-label text-[9px]">{s.title}</span>
              </div>
              <h2
                className="font-serif text-[22px] md:text-[26px] leading-tight"
                style={{ color: "var(--text)" }}
              >
                {s.headline}
              </h2>
              <div className="flex flex-col gap-1" style={{ color: "var(--text-dim)" }}>
                {s.details.map((d) => (
                  <p key={d} className="text-[13px] font-light leading-relaxed">{d}</p>
                ))}
              </div>
            </section>
          );
        })}

        {/* Recommended action */}
        <section
          className="flex flex-col gap-4 py-10 mt-4"
          style={{ borderTop: "0.5px solid var(--border)" }}
        >
          <span className="font-label text-[9px]">// WHAT TO DO NOW</span>
          <p
            className="font-serif italic text-[20px] md:text-[24px] leading-snug"
            style={{ color: "var(--text)" }}
          >
            Open R2·SCHOOL.
            <br />
            Your IB presentation is in 4 days.
          </p>
          <a
            href={school.url}
            className="self-start font-label text-[11px] underline underline-offset-4 mt-2 transition-opacity hover:opacity-70"
            style={{ color: "var(--text)" }}
          >
            → OPEN R2·SCHOOL
          </a>
        </section>
      </div>
    </main>
  );
}
