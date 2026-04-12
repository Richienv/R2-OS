export type Urgency = "info" | "warning" | "urgent";

export type AppSummary = {
  id: "fit" | "school" | "finance" | "build";
  name: string;
  url: string;
  metric: string;
  label: string;
  alert: boolean;
  alertMessage: string;
  urgency: Urgency;
};

export const APPS: AppSummary[] = [
  {
    id: "fit",
    name: "R2\u00b7FIT",
    url: "https://r2-fit.vercel.app",
    metric: "843",
    label: "KCAL LEFT",
    alert: false,
    alertMessage: "",
    urgency: "info",
  },
  {
    id: "school",
    name: "R2\u00b7SCHOOL",
    url: "https://r2-school.vercel.app",
    metric: "4 DAYS",
    label: "IB PRES DUE",
    alert: true,
    alertMessage: "IB Presentation in 4 days.",
    urgency: "urgent",
  },
  {
    id: "finance",
    name: "R2\u00b7FINANCE",
    url: "https://r2-finance.vercel.app",
    metric: "580 RMB",
    label: "FREE MONTH",
    alert: false,
    alertMessage: "",
    urgency: "info",
  },
  {
    id: "build",
    name: "R2\u00b7BUILD",
    url: "https://r2-build.vercel.app",
    metric: "2/3",
    label: "TASKS DONE",
    alert: false,
    alertMessage: "",
    urgency: "info",
  },
];

export function getMostUrgent(apps: AppSummary[]) {
  const rank = { urgent: 0, warning: 1, info: 2 } as const;
  return apps
    .filter((a) => a.alert)
    .sort((a, b) => rank[a.urgency] - rank[b.urgency])[0] ?? null;
}
