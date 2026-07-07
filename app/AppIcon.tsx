import type { AppKey } from "@/lib/apps";

/**
 * Per-app line icons — 2px white stroke, 30×30.
 * FIT = dumbbell, GMBA = graduation cap, MONEY = banknote, BUILD = code brackets.
 * Rendered inside the fire tiles on Home.
 */
const PATHS: Record<AppKey, React.ReactNode> = {
  fit: (
    <>
      <path d="M6.5 6.5v11" />
      <path d="M17.5 6.5v11" />
      <path d="M4 9.5v5" />
      <path d="M20 9.5v5" />
      <path d="M6.5 12h11" />
    </>
  ),
  school: (
    <>
      <path d="M2 9.2l10-4 10 4-10 4-10-4z" />
      <path d="M6 11.4V16c0 1.1 2.7 2.6 6 2.6s6-1.5 6-2.6v-4.6" />
      <path d="M22 9.2v4.8" />
    </>
  ),
  finance: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M6 9.5v5" />
      <path d="M18 9.5v5" />
    </>
  ),
  build: (
    <>
      <path d="M8.5 7.5l-5 4.5 5 4.5" />
      <path d="M15.5 7.5l5 4.5-5 4.5" />
    </>
  ),
};

export function AppIcon({ id }: { id: AppKey }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={30}
      height={30}
    >
      {PATHS[id]}
    </svg>
  );
}
