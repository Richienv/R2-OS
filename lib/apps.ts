export type Urgency = "info" | "warning" | "urgent";

export type AppKey = "fit" | "school" | "finance" | "build";

export type AppConfig = {
  id: AppKey;
  name: string;
  shortName: string;
  url: string;
};

export const APPS: AppConfig[] = [
  { id: "fit", name: "R2·FIT", shortName: "FIT", url: "https://r2-fit.vercel.app" },
  { id: "school", name: "R2·SCHOOL", shortName: "GMBA", url: "https://r2-school.vercel.app" },
  { id: "finance", name: "R2·FINANCE", shortName: "MONEY", url: "https://r2-finance.vercel.app" },
  { id: "build", name: "R2·BUILD", shortName: "BUILD", url: "https://r2-build.vercel.app" },
];

export const PING_URLS = APPS.map((a) => `${a.url}/api/ping`);
