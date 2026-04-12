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
    <main
      className="flex min-h-[100dvh] w-full flex-col"
      style={{ background: "var(--bg)" }}
    >
      {/* Header */}
      <header
        className="flex h-[52px] shrink-0 items-center justify-between px-6"
        style={{ borderBottom: "0.5px solid var(--border)" }}
      >
        <Link
          href="/"
          className="font-serif text-[18px] leading-none"
          style={{ color: "var(--fg)" }}
          aria-label="Back to overview"
        >
          ←
        </Link>
        <span className="font-serif text-[22px]" style={{ color: "var(--fg)" }}>
          Daily Brief
        </span>
        <span className="w-5" />
      </header>

      {/* Sections */}
      <div className="flex flex-col px-6 md:px-12 lg:px-32 py-4">
        {SECTIONS.map((s, i) => (
          <section
            key={s.appId}
            className="flex flex-col gap-3 py-8"
            style={{
              borderTop: i > 0 ? "0.5px solid var(--faint)" : "none",
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--fg)" }}
              />
              <span className="font-label text-[8px]" style={{ color: "var(--dim)" }}>
                {s.title}
              </span>
            </div>
            <h2
              className="font-serif text-[24px] leading-tight"
              style={{ color: "var(--fg)" }}
            >
              {s.headline}
            </h2>
            <div className="flex flex-col gap-0.5">
              {s.details.map((d) => (
                <p
                  key={d}
                  className="text-[13px] font-light"
                  style={{ color: "var(--dim)", lineHeight: "1.7" }}
                >
                  {d}
                </p>
              ))}
            </div>
          </section>
        ))}

        {/* Recommended action */}
        <section
          className="flex flex-col gap-3 py-8 mt-2"
          style={{ borderTop: "0.8px solid var(--fg)" }}
        >
          <span
            className="font-label text-[9px]"
            style={{ color: "var(--muted)", letterSpacing: "0.2em" }}
          >
            // WHAT TO DO NOW
          </span>
          <p
            className="font-serif italic text-[17px] leading-snug"
            style={{ color: "var(--fg)" }}
          >
            Open R2·SCHOOL.
            <br />
            Your IB presentation is in 4 days.
          </p>
          <a
            href={school.url}
            className="self-start font-label text-[10px] underline mt-2"
            style={{
              color: "var(--fg)",
              textUnderlineOffset: "3px",
            }}
          >
            → OPEN R2·SCHOOL
          </a>
        </section>
      </div>
    </main>
  );
}
