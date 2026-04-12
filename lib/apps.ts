export type Urgency = "info" | "warning" | "urgent";

export type AppSummary = {
  id: "fit" | "school" | "finance" | "build";
  name: string;
  url: string;
  metric: string;
  unit: string;
  alert: boolean;
  alertMessage: string;
  urgency: Urgency;
};

export const APPS: AppSummary[] = [
  {
    id: "fit",
    name: "R2·FIT",
    url: "https://r2fit.vercel.app",
    metric: "843",
    unit: "kcal left",
    alert: true,
    alertMessage: "Dinner not logged",
    urgency: "warning",
  },
  {
    id: "school",
    name: "R2·SCHOOL",
    url: "https://r2school.vercel.app",
    metric: "4 DAYS",
    unit: "IB pres due",
    alert: true,
    alertMessage: "IB Presentation in 4 days.",
    urgency: "urgent",
  },
  {
    id: "finance",
    name: "R2·FINANCE",
    url: "https://r2finance.vercel.app",
    metric: "580 RMB",
    unit: "free month",
    alert: false,
    alertMessage: "37 RMB left today",
    urgency: "info",
  },
  {
    id: "build",
    name: "R2·BUILD",
    url: "https://r2build.vercel.app",
    metric: "2/3",
    unit: "tasks done",
    alert: true,
    alertMessage: "ERP blocker unresolved.",
    urgency: "urgent",
  },
];

export function getMostUrgent(apps: AppSummary[]) {
  const rank = { urgent: 0, warning: 1, info: 2 } as const;
  return apps
    .filter((a) => a.alert)
    .sort((a, b) => rank[a.urgency] - rank[b.urgency])[0] ?? null;
}

export function greetingFor(hour: number) {
  if (hour >= 6 && hour < 11) return "Good morning.";
  if (hour >= 11 && hour < 17) return "Keep going.";
  if (hour >= 17 && hour < 21) return "Evening check.";
  return "Wind down.";
}

export function greetingLabel(hour: number) {
  if (hour >= 6 && hour < 11) return "// GOOD MORNING";
  if (hour >= 11 && hour < 17) return "// KEEP GOING";
  if (hour >= 17 && hour < 21) return "// EVENING CHECK";
  return "// WIND DOWN";
}
