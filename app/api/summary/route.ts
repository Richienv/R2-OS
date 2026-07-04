import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { APPS } from "@/lib/apps";
import type { AggregateResponse, AggregatedApp, Urgency } from "@/lib/os-types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SHORT: Record<string, string> = { fit: "FIT", school: "GMBA", finance: "MONEY", build: "BUILD" };
const URL_OF: Record<string, string> = Object.fromEntries(APPS.map((a) => [a.id, a.url]));

function base(key: AggregatedApp["key"]): AggregatedApp {
  return {
    key,
    shortName: SHORT[key],
    appUrl: URL_OF[key],
    metric: "—",
    label: "",
    detail: null,
    alert: false,
    alertText: null,
    urgency: "info",
    ok: true,
  };
}

/** Empty-but-valid response: new users, signed-out, or Supabase not wired yet. */
function emptyResponse(): AggregateResponse {
  const apps = {
    fit: { ...base("fit"), metric: "0", label: "day streak" },
    school: { ...base("school"), metric: "0", label: "deadlines" },
    finance: { ...base("finance"), metric: "0", label: "left" },
    build: { ...base("build"), metric: "0", label: "commits" },
  };
  return { apps, urgentItem: null, fetchedAt: new Date().toISOString(), ok: true };
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfWeek() {
  const d = new Date();
  const day = d.getDay();
  const daysUntilSun = (7 - day) % 7;
  d.setDate(d.getDate() + daysUntilSun);
  d.setHours(23, 59, 59, 999);
  return d;
}

export async function GET() {
  const supabase = await createClient();

  const noStore = {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Access-Control-Allow-Origin": "*",
    },
  };

  if (!supabase) return NextResponse.json(emptyResponse(), noStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json(emptyResponse(), noStore);

  const uid = user.id;
  const todayISO = startOfToday().toISOString();
  const weekEndISO = endOfWeek().toISOString();
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthStartISO = monthStart.toISOString();
  const monthKey = monthStartISO.slice(0, 10);

  const [workoutsToday, assignmentsWeek, txMonth, budgetRow, commitsToday, tasksPending] =
    await Promise.all([
      supabase.from("workouts").select("calories").eq("user_id", uid).gte("occurred_at", todayISO),
      supabase
        .from("assignments")
        .select("id")
        .eq("user_id", uid)
        .eq("status", "open")
        .not("due_at", "is", null)
        .lte("due_at", weekEndISO)
        .gte("due_at", todayISO),
      supabase.from("transactions").select("amount").eq("user_id", uid).gte("occurred_at", monthStartISO),
      supabase.from("budgets").select("limit_amount").eq("user_id", uid).eq("month", monthKey).maybeSingle(),
      supabase
        .from("build_events")
        .select("id")
        .eq("user_id", uid)
        .eq("kind", "commit")
        .gte("occurred_at", todayISO),
      supabase.from("build_events").select("id").eq("user_id", uid).eq("kind", "task").eq("status", "pending"),
    ]);

  // FIT — calories today.
  const calories = (workoutsToday.data ?? []).reduce((s, w) => s + (w.calories ?? 0), 0);
  const fit: AggregatedApp = { ...base("fit"), metric: String(calories), label: "calories" };

  // SCHOOL — open deadlines this week.
  const deadlines = assignmentsWeek.data?.length ?? 0;
  const school: AggregatedApp = {
    ...base("school"),
    metric: String(deadlines),
    label: "deadlines",
    alert: deadlines > 0,
    alertText: deadlines > 0 ? `${deadlines} deadline${deadlines > 1 ? "s" : ""} this week` : null,
    urgency: deadlines > 0 ? "warning" : "info",
  };

  // FINANCE — budget minus spend this month.
  const spend = (txMonth.data ?? [])
    .map((t) => Number(t.amount) || 0)
    .filter((a) => a < 0)
    .reduce((s, a) => s + a, 0);
  const limit = Number(budgetRow.data?.limit_amount ?? 0);
  const left = limit + spend; // spend is negative
  const finance: AggregatedApp = {
    ...base("finance"),
    metric: limit > 0 ? formatMoney(left) : formatMoney(-spend),
    label: limit > 0 ? "left" : "spent",
  };

  // BUILD — commits today, tasks pending as detail.
  const commits = commitsToday.data?.length ?? 0;
  const pending = tasksPending.data?.length ?? 0;
  const build: AggregatedApp = {
    ...base("build"),
    metric: String(commits),
    label: "commits",
    detail: pending > 0 ? `${pending} task${pending > 1 ? "s" : ""} pending` : null,
  };

  const apps = { fit, school, finance, build };
  const ranked = Object.values(apps)
    .filter((a) => a.alert)
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

  return NextResponse.json(body, noStore);
}

function formatMoney(n: number): string {
  const abs = Math.abs(Math.round(n));
  if (abs >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}K`;
  return `Rp ${Math.round(n)}`;
}
