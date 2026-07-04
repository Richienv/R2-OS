"use client";

import { type ReactNode } from "react";

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <main
      className="flex min-h-[100dvh] w-full flex-col items-center justify-center px-6"
      style={{
        background: "radial-gradient(120% 90% at 50% -10%, #141011 0%, var(--bg) 60%)",
      }}
    >
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="flex items-baseline" style={{ gap: 1 }}>
          <span style={{ fontWeight: 800, fontSize: 34, color: "var(--text)", letterSpacing: "-0.8px" }}>
            R2
          </span>
          <span style={{ fontWeight: 300, fontSize: 34, color: "rgba(248,244,240,0.38)", letterSpacing: "-0.8px" }}>
            ·OS
          </span>
        </div>
        {subtitle && (
          <span className="font-label" style={{ fontSize: 9, color: "var(--label)" }}>
            {subtitle}
          </span>
        )}
      </div>

      <div
        className="card w-full"
        style={{
          maxWidth: 340,
          padding: "26px 22px",
          borderRadius: 22,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.04), 0 20px 44px rgba(0,0,0,.5)",
        }}
      >
        <h1 style={{ fontSize: 21, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.4px", margin: "0 0 18px" }}>
          {title}
        </h1>
        {children}
      </div>
    </main>
  );
}

export function AuthField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-label" style={{ fontSize: 8, letterSpacing: "0.2em", color: "var(--label)" }}>
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        style={{
          width: "100%",
          height: 44,
          padding: "0 14px",
          borderRadius: 12,
          background: "#0a080a",
          border: "0.9px solid rgba(255,255,255,.1)",
          color: "var(--text)",
          fontSize: 15,
          outline: "none",
        }}
      />
    </label>
  );
}

export function AuthError({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        padding: "10px 12px",
        borderRadius: 10,
        background: "rgba(238,60,48,.1)",
        border: "0.9px solid rgba(238,60,48,.3)",
        color: "#ff9a86",
        fontSize: 12.5,
        lineHeight: 1.4,
      }}
    >
      {children}
    </div>
  );
}

export function AuthSubmit({ busy, children }: { busy: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="cell-press relative mt-1 flex w-full items-center justify-center overflow-hidden"
      style={{
        height: 50,
        border: "none",
        borderRadius: 13,
        background: "var(--fire-grad)",
        boxShadow: "inset 0 1.5px 1px var(--fire-hi), inset 0 -4px 9px var(--fire-lo), 0 12px 26px var(--fire-glow)",
        color: "#fff",
        fontSize: 15,
        fontWeight: 700,
        letterSpacing: "0.2px",
        cursor: busy ? "default" : "pointer",
        opacity: busy ? 0.7 : 1,
      }}
    >
      {busy ? "…" : children}
    </button>
  );
}
