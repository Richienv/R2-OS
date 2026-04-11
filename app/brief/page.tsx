import Link from "next/link";
import { APPS } from "@/lib/apps";

type Section = {
  title: string;
  color: string;
  lines: string[];
};

const SECTIONS: Section[] = [
  {
    title: "FITNESS",
    color: "#E8FF47",
    lines: [
      "843 kcal remaining. Dinner not logged.",
      "Protein: done. Pull B: not done.",
    ],
  },
  {
    title: "SCHOOL",
    color: "#2D7DD2",
    lines: [
      "IB presentation in 4 days — in progress.",
      "No other deadlines this week.",
    ],
  },
  {
    title: "FINANCE",
    color: "#E53935",
    lines: [
      "37 RMB today limit. 0 spent. On track.",
      "580 RMB free remaining this month.",
    ],
  },
  {
    title: "BUILD",
    color: "#FFFFFF",
    lines: [
      "ERP: Fix bank recon — not done.",
      "OIC: Finalize ESP32 — not done.",
      "R2·FIT: Database — not done.",
    ],
  },
];

export default function BriefPage() {
  const school = APPS.find((a) => a.id === "school")!;
  return (
    <main className="flex min-h-[100dvh] w-full flex-col bg-bg text-text">
      <header className="flex h-20 shrink-0 items-center justify-between px-6">
        <Link href="/" className="font-mono text-[11px] tracking-widest text-muted">
          ← R2·OS
        </Link>
        <span className="font-mono text-[11px] tracking-widest text-muted">TODAY'S BRIEF</span>
      </header>

      <div className="flex flex-col gap-8 px-6 pb-8">
        {SECTIONS.map((s) => (
          <section key={s.title} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
              <h2 className="font-display text-[22px] leading-none" style={{ color: s.color }}>
                {s.title}
              </h2>
            </div>
            <div className="font-sans text-[15px] leading-snug text-text/85">
              {s.lines.map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
          </section>
        ))}

        <section className="mt-4 flex flex-col gap-3 rounded-xl border border-border bg-surface p-5">
          <span className="font-mono text-[10px] tracking-widest text-muted">WHAT TO DO NOW</span>
          <p className="font-display text-[22px] leading-tight text-text">
            🎯 IB presentation is in 4 days.
            <br />
            Open R2·SCHOOL to check progress.
          </p>
          <Link
            href={school.url}
            className="mt-2 self-start rounded-md border px-4 py-2 font-mono text-[11px] tracking-widest"
            style={{ borderColor: school.color, color: school.color }}
          >
            OPEN R2·SCHOOL →
          </Link>
        </section>
      </div>
    </main>
  );
}
