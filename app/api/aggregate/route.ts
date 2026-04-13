import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Urgency = "info" | "warning" | "urgent";

type AppConfig = {
  key: "fit" | "school" | "finance" | "build";
  shortName: string;
  appUrl: string;
};

const APPS: AppConfig[] = [
  { key: "fit", shortName: "FIT", appUrl: "https://r2-fit.vercel.app" },
  { key: "school", shortName: "GMBA", appUrl: "https://r2-school.vercel.app" },
  { key: "finance", shortName: "MONEY", appUrl: "https://r2-finance.vercel.app" },
  { key: "build", shortName: "BUILD", appUrl: "https://r2-build.vercel.app" },
];

export type AggregatedApp = {
  key: AppConfig["key"];
  shortName: string;
  appUrl: string;
  metric: string;
  label: string;
  detail: string | null;
  alert: boolean;
  alertText: string | null;
  urgency: Urgency;
  ok: boolean;
};

export type AggregateResponse = {
  apps: Record<AppConfig["key"], AggregatedApp>;
  urgentItem: AggregatedApp | null;
  fetchedAt: string;
  ok: boolean;
};

async function fetchOne(app: AppConfig): Promise<AggregatedApp> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    const res = await fetch(`${app.appUrl}/api/summary`, {
      signal: controller.signal,
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      key: app.key,
      shortName: app.shortName,
      appUrl: app.appUrl,
      metric: String(data.metric ?? "—"),
      label: String(data.label ?? ""),
      detail: data.detail ?? null,
      alert: Boolean(data.alert),
      alertText: data.alertText ?? null,
      urgency: (data.urgency as Urgency) ?? "info",
      ok: true,
    };
  } catch {
    clearTimeout(timeout);
    return {
      key: app.key,
      shortName: app.shortName,
      appUrl: app.appUrl,
      metric: "—",
      label: "unavailable",
      detail: null,
      alert: false,
      alertText: null,
      urgency: "info",
      ok: false,
    };
  }
}

export async function GET() {
  const results = await Promise.all(APPS.map(fetchOne));
  const apps = Object.fromEntries(results.map((r) => [r.key, r])) as Record<
    AppConfig["key"],
    AggregatedApp
  >;

  const ranked = results
    .filter((r) => r.alert)
    .sort((a, b) => {
      const rank: Record<Urgency, number> = { urgent: 0, warning: 1, info: 2 };
      return rank[a.urgency] - rank[b.urgency];
    });

  const body: AggregateResponse = {
    apps,
    urgentItem: ranked[0] ?? null,
    fetchedAt: new Date().toISOString(),
    ok: true,
  };

  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
