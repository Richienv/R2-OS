"use client";

import { useCallback, useEffect, useState } from "react";
import { PING_URLS } from "./apps";
import type { AggregateResponse, AggregatedApp } from "@/app/api/aggregate/route";

const REFRESH_MS = 5 * 60 * 1000;
const PING_MS = 4 * 60 * 1000;
const CACHE_MAX_AGE_MS = 10 * 60 * 1000;
const CACHE_KEY = "r2os-data-cache";

const placeholder = (
  key: AggregatedApp["key"],
  shortName: string,
  appUrl: string
): AggregatedApp => ({
  key,
  shortName,
  appUrl,
  metric: "···",
  label: "loading",
  detail: null,
  alert: false,
  alertText: null,
  urgency: "info",
  ok: false,
});

export const DEFAULT_OS_DATA: AggregateResponse = {
  apps: {
    fit: placeholder("fit", "FIT", "https://r2-fit.vercel.app"),
    school: placeholder("school", "GMBA", "https://r2-school.vercel.app"),
    finance: placeholder("finance", "MONEY", "https://r2-finance.vercel.app"),
    build: placeholder("build", "BUILD", "https://r2-build.vercel.app"),
  },
  urgentItem: null,
  fetchedAt: "",
  ok: false,
};

function readCache(): AggregateResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AggregateResponse;
    if (!parsed.fetchedAt) return null;
    const age = Date.now() - new Date(parsed.fetchedAt).getTime();
    if (age > CACHE_MAX_AGE_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

export type UseOSData = {
  data: AggregateResponse;
  loading: boolean;
  lastUpdated: Date | null;
  allOffline: boolean;
  refresh: () => void;
};

export function useOSData(): UseOSData {
  const [data, setData] = useState<AggregateResponse>(() => readCache() ?? DEFAULT_OS_DATA);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(() => {
    const cached = readCache();
    return cached ? new Date(cached.fetchedAt) : null;
  });

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/aggregate", { cache: "no-store" });
      if (!res.ok) throw new Error("aggregate failed");
      const next = (await res.json()) as AggregateResponse;
      setData(next);
      setLastUpdated(new Date());
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(next));
      } catch {}
    } catch (err) {
      console.error("Failed to fetch OS data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, REFRESH_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  useEffect(() => {
    const ping = () => {
      PING_URLS.forEach((url) => {
        fetch(url, { method: "GET", mode: "no-cors" }).catch(() => {});
      });
    };
    ping();
    const interval = setInterval(ping, PING_MS);
    return () => clearInterval(interval);
  }, []);

  const allOffline = Object.values(data.apps).every((a) => !a.ok);

  return { data, loading, lastUpdated, allOffline, refresh };
}

export function formatTimeAgo(date: Date | null): string {
  if (!date) return "loading";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}
