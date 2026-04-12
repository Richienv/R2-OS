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
        className="flex h-[52px] shrink-0 items-center justify-between px-6"
        style={{ borderBottom: "0.5px solid var(--border)" }}
      >
        <Link href="/" className="font-serif text-[18px]" style={{ color: "var(--fg)" }}>
          &larr;
        </Link>
        <span className="font-serif text-[22px]" style={{ color: "var(--fg)" }}>Daily Brief</span>
        <span className="w-11" />
      </header>

      <div className="flex flex-col gap-px px-4 py-4 md:px-8 lg:px-24">
        {SECTIONS.map((s) => (
          <section
            key={s.appId}
            className="flex flex-col overflow-hidden"
            style={{ border: "0.5px solid var(--border)" }}
          >
            {/* Dark section bar */}
            <div
              className="flex h-8 items-center px-3.5"
              style={{ background: "var(--fg)" }}
            >
              <span className="font-label text-[8px]" style={{ color: "var(--bg)", opacity: 0.7 }}>
                {s.title}
              </span>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 px-3.5 py-4">
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
            </div>
          </section>
        ))}

        {/* Recommended action */}
        <section
          className="flex flex-col overflow-hidden mt-4"
          style={{ border: "0.5px solid var(--border)" }}
        >
          <div
            className="flex h-8 items-center px-3.5"
            style={{ background: "var(--fg)" }}
          >
            <span className="font-label text-[8px]" style={{ color: "var(--bg)", opacity: 0.7 }}>
              // WHAT TO DO NOW
            </span>
          </div>
          <div className="flex flex-col gap-3 px-3.5 py-4">
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
              className="self-start font-label text-[10px] underline"
              style={{ color: "var(--fg)", textUnderlineOffset: "3px" }}
            >
              &rarr; OPEN R2·SCHOOL
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
