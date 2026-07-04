"use client";

import Link from "next/link";

const ITEMS = [
  { label: "HOME", href: "/" },
  { label: "BRIEF", href: "/brief" },
  { label: "APPS", href: "/apps" },
] as const;

export type NavScreen = (typeof ITEMS)[number]["label"];

export default function BottomNav({ active }: { active: NavScreen }) {
  return (
    <nav
      className="flex h-[66px] shrink-0 items-stretch"
      style={{
        borderTop: "0.5px solid var(--line)",
        background: "rgba(7,6,8,.9)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {ITEMS.map((item) => {
        const isActive = item.label === active;
        return (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-1 flex-col items-center justify-center gap-[5px] pt-1"
            style={{ textDecoration: "none", WebkitTapHighlightColor: "transparent" }}
          >
            <span
              style={
                isActive
                  ? {
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "var(--fire-grad)",
                      boxShadow: "0 0 10px rgba(238,60,48,.5)",
                    }
                  : { width: 5, height: 5, borderRadius: "50%", background: "var(--dot-idle)" }
              }
            />
            <span
              className="font-label"
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: isActive ? "var(--text)" : "var(--label-dim)",
              }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
