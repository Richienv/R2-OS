export type Urgency = "info" | "warning" | "urgent";

export type AppKey = "fit" | "school" | "finance" | "build";

export type AppConfig = {
  id: AppKey;
  name: string;
  shortName: string;
  url: string;
  host: string;
  /** CSS var reference for the app's accent gradient (Brief dots + Apps badges) */
  accentGrad: string;
  /** CSS var reference for the app's accent glow */
  accentGlow: string;
};

export const APPS: AppConfig[] = [
  {
    id: "fit",
    name: "R2·FIT",
    shortName: "FIT",
    url: "https://r2-fit.vercel.app",
    host: "r2-fit.vercel.app",
    accentGrad: "var(--fit-grad)",
    accentGlow: "var(--fit-glow)",
  },
  {
    id: "school",
    name: "R2·SCHOOL",
    shortName: "GMBA",
    url: "https://r2-school.vercel.app",
    host: "r2-school.vercel.app",
    accentGrad: "var(--school-grad)",
    accentGlow: "var(--school-glow)",
  },
  {
    id: "finance",
    name: "R2·FINANCE",
    shortName: "MONEY",
    url: "https://r2-finance.vercel.app",
    host: "r2-finance.vercel.app",
    accentGrad: "var(--finance-grad)",
    accentGlow: "var(--finance-glow)",
  },
  {
    id: "build",
    name: "R2·BUILD",
    shortName: "BUILD",
    url: "https://r2-build.vercel.app",
    host: "r2-build.vercel.app",
    accentGrad: "var(--build-grad)",
    accentGlow: "var(--build-glow)",
  },
];

export const PING_URLS = APPS.map((a) => `${a.url}/api/ping`);
