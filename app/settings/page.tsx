import Link from "next/link";
import { APPS } from "@/lib/apps";

const PREFS = [
  "Morning brief (8am)",
  "Deadline alerts (3 days before)",
  "Daily budget alert (if overspent)",
  "Project blocker reminders",
];

export default function SettingsPage() {
  return (
    <main className="flex min-h-[100dvh] w-full flex-col bg-bg text-text">
      <header className="flex h-20 shrink-0 items-center justify-between px-6">
        <Link href="/" className="font-mono text-[11px] tracking-widest text-muted">
          ← R2·OS
        </Link>
        <span className="font-mono text-[11px] tracking-widest text-muted">SETTINGS</span>
      </header>

      <div className="flex flex-col gap-10 px-6 pb-10">
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-[20px] text-text">CONNECTED APPS</h2>
          <ul className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
            {APPS.map((a) => (
              <li key={a.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex flex-col">
                  <span className="font-display text-[16px]" style={{ color: a.color }}>
                    {a.name}
                  </span>
                  <span className="font-mono text-[10px] tracking-wide text-muted">
                    {a.url.replace(/^https?:\/\//, "")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full pulse-dot"
                    style={{ background: a.color }}
                  />
                  <span className="font-mono text-[10px] tracking-widest text-muted">
                    CONNECTED
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-display text-[20px] text-text">PROFILE</h2>
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4 font-mono text-[12px]">
            <Row k="NAME" v="Richie" />
            <Row k="LOCATION" v="Hangzhou, China" />
            <Row k="TIMEZONE" v="CST (UTC+8)" />
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-display text-[20px] text-text">NOTIFICATIONS</h2>
          <ul className="flex flex-col gap-2">
            {PREFS.map((p) => (
              <li
                key={p}
                className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 font-mono text-[12px] text-text/85"
              >
                <span className="inline-block h-3 w-3 rounded-sm border border-muted" />
                {p}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted">{k}</span>
      <span className="text-text">{v}</span>
    </div>
  );
}
