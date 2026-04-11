export type Urgency = "info" | "warning" | "urgent";

export type AppSummary = {
  id: "fit" | "school" | "finance" | "build";
  name: string;
  emoji: string;
  color: string;
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
    name: "R2·FIT",
    emoji: "💪",
    color: "#E8FF47",
    url: "https://r2fit.vercel.app",
    metric: "843 kcal",
    label: "left today",
    alert: true,
    alertMessage: "Dinner not logged",
    urgency: "warning",
  },
  {
    id: "school",
    name: "R2·SCHOOL",
    emoji: "📚",
    color: "#2D7DD2",
    url: "https://r2school.vercel.app",
    metric: "4 DAYS",
    label: "IB presentation",
    alert: true,
    alertMessage: "IB PRESENTATION IN 4 DAYS",
    urgency: "urgent",
  },
  {
    id: "finance",
    name: "R2·FINANCE",
    emoji: "💰",
    color: "#E53935",
    url: "https://r2finance.vercel.app",
    metric: "580 RMB",
    label: "free this month",
    alert: false,
    alertMessage: "37 RMB left today",
    urgency: "info",
  },
  {
    id: "build",
    name: "R2·BUILD",
    emoji: "🔨",
    color: "#FFFFFF",
    url: "https://r2build.vercel.app",
    metric: "2/3",
    label: "tasks done today",
    alert: true,
    alertMessage: "ERP BLOCKER UNRESOLVED",
    urgency: "urgent",
  },
];

export function digestItems(apps: AppSummary[]) {
  const rank = { urgent: 0, warning: 1, info: 2 } as const;
  return apps
    .filter((a) => a.alert)
    .map((a) => ({
      urgency: a.urgency,
      text: a.alertMessage.toUpperCase(),
      icon: a.urgency === "urgent" ? "⚠️" : a.urgency === "warning" ? "⚠️" : "●",
      color: a.urgency === "urgent" ? "#E53935" : a.urgency === "warning" ? "#E8FF47" : "#F0EEE6",
    }))
    .sort((a, b) => rank[a.urgency] - rank[b.urgency]);
}

export function greetingFor(hour: number) {
  if (hour >= 6 && hour < 11) return "GOOD MORNING.";
  if (hour >= 11 && hour < 17) return "KEEP GOING.";
  if (hour >= 17 && hour < 21) return "EVENING CHECK.";
  return "WIND DOWN.";
}
