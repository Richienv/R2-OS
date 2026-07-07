"use client";

import Link from "next/link";

type Screen = "home" | "brief" | "apps";

const ITEMS: { screen: Screen; label: string; href: string }[] = [
  { screen: "home", label: "HOME", href: "/" },
  { screen: "brief", label: "BRIEF", href: "/brief" },
  { screen: "apps", label: "APPS", href: "/apps" },
];

export function BottomNav({ active }: { active: Screen }) {
  return (
    <nav className="nav">
      {ITEMS.map((item) => (
        <Link
          key={item.screen}
          href={item.href}
          className={item.screen === active ? "active" : undefined}
        >
          <span className="dot" />
          <span className="label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
