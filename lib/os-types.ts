import type { AppKey } from "./apps";

export type Urgency = "info" | "warning" | "urgent";

export type AggregatedApp = {
  key: AppKey;
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
  apps: Record<AppKey, AggregatedApp>;
  urgentItem: AggregatedApp | null;
  fetchedAt: string;
  ok: boolean;
};
