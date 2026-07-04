"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { APPS } from "@/lib/apps";
import { navigateToApp } from "@/lib/navigate";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  name: string | null;
  location: string | null;
  timezone: string | null;
  bible_translation: string | null;
};

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setSignedIn(true);
      setEmail(user.email ?? null);
      const { data } = await supabase
        .from("profiles")
        .select("name, location, timezone, bible_translation")
        .eq("id", user.id)
        .maybeSingle();
      if (data) setProfile(data as Profile);
    })();
  }, []);

  async function signOut() {
    const supabase = createClient();
    if (!supabase) return;
    setSigningOut(true);
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  const translation = profile?.bible_translation ?? "ESV";
  const name = profile?.name ?? (signedIn ? "—" : "Richie Kid Novell");
  const location = profile?.location ?? (signedIn ? "—" : "Hangzhou, China");
  const timezone = profile?.timezone ?? (signedIn ? "UTC" : "CST (UTC+8)");

  return (
    <main className="flex min-h-[100dvh] w-full flex-col" style={{ background: "var(--bg)" }}>
      <header
        className="flex h-[54px] shrink-0 items-center justify-between px-[22px]"
        style={{ borderBottom: "0.5px solid var(--line)" }}
      >
        <Link href="/" className="w-7 text-left" style={{ color: "var(--text)", fontSize: 19, textDecoration: "none" }}>
          &larr;
        </Link>
        <span style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.4px" }}>Settings</span>
        <span className="w-7" />
      </header>

      <div className="flex flex-col px-[22px] md:px-8 lg:px-24">
        {/* Account */}
        {signedIn && (
          <section className="flex flex-col gap-4 py-7">
            <span className="font-label" style={{ fontSize: 8, color: "var(--label)", letterSpacing: "0.22em" }}>
              ACCOUNT
            </span>
            <Row k="EMAIL" v={email ?? "—"} />
          </section>
        )}

        {/* Bible translation */}
        <section
          className="flex flex-col gap-4 py-7"
          style={{ borderTop: signedIn ? "0.5px solid var(--line)" : "none" }}
        >
          <span className="font-label" style={{ fontSize: 8, color: "var(--label)", letterSpacing: "0.22em" }}>
            BIBLE TRANSLATION
          </span>
          <span style={{ fontSize: 13, color: "var(--text)" }}>{translation}</span>
        </section>

        {/* Connected apps */}
        <section className="flex flex-col gap-4 py-7" style={{ borderTop: "0.5px solid var(--line)" }}>
          <span className="font-label" style={{ fontSize: 8, color: "var(--label)", letterSpacing: "0.22em" }}>
            YOUR MODULES
          </span>
          <ul className="flex flex-col">
            {APPS.map((a, i) => (
              <li
                key={a.id}
                className="flex items-center justify-between py-3"
                style={{ borderTop: i > 0 ? "0.5px solid var(--line)" : "none" }}
              >
                <div className="flex items-center gap-3">
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: a.grad,
                      boxShadow: `0 0 9px ${a.glow}`,
                    }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{a.name}</span>
                </div>
                <button
                  onClick={() => navigateToApp(a.url)}
                  className="font-label cursor-pointer"
                  style={{ fontSize: 9, color: "var(--text-dim)" }}
                >
                  OPEN &rarr;
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Profile */}
        <section className="flex flex-col gap-4 py-7" style={{ borderTop: "0.5px solid var(--line)" }}>
          <span className="font-label" style={{ fontSize: 8, color: "var(--label)", letterSpacing: "0.22em" }}>
            PROFILE
          </span>
          <div className="flex flex-col">
            <Row k="NAME" v={name} />
            <Row k="LOCATION" v={location} />
            <Row k="TIMEZONE" v={timezone} />
          </div>
        </section>

        {/* Notifications */}
        <section className="flex flex-col gap-4 py-7" style={{ borderTop: "0.5px solid var(--line)" }}>
          <span className="font-label" style={{ fontSize: 8, color: "var(--label)", letterSpacing: "0.22em" }}>
            NOTIFICATIONS
          </span>
          <div className="flex flex-col">
            <Toggle label="Morning brief (8am)" />
            <Toggle label="Deadline alerts" />
            <Toggle label="Budget alerts" />
          </div>
        </section>

        {/* Sign out */}
        {signedIn && (
          <section className="py-7" style={{ borderTop: "0.5px solid var(--line)" }}>
            <button
              onClick={signOut}
              disabled={signingOut}
              className="cell-press w-full cursor-pointer"
              style={{
                height: 48,
                borderRadius: 13,
                border: "0.9px solid rgba(238,60,48,.3)",
                background: "rgba(238,60,48,.08)",
                color: "#ff9a86",
                fontSize: 14,
                fontWeight: 600,
                opacity: signingOut ? 0.6 : 1,
              }}
            >
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </section>
        )}
      </div>
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: "0.5px solid var(--line)" }}>
      <span className="font-label" style={{ fontSize: 9, color: "var(--label)" }}>{k}</span>
      <span style={{ fontSize: 13, color: "var(--text)" }}>{v}</span>
    </div>
  );
}

function Toggle({ label }: { label: string }) {
  const [on, setOn] = useState(false);
  return (
    <button
      onClick={() => setOn(!on)}
      className="flex items-center justify-between py-3"
      style={{ borderBottom: "0.5px solid var(--line)" }}
    >
      <span style={{ fontSize: 13, color: "var(--text)" }}>{label}</span>
      <div
        className="relative h-5 w-9 rounded-full transition-colors duration-200"
        style={{
          background: on ? "var(--fire-grad)" : "var(--line)",
          boxShadow: on ? "0 0 10px var(--fire-glow)" : "none",
        }}
      >
        <div
          className="absolute top-0.5 h-4 w-4 rounded-full transition-transform duration-200"
          style={{
            background: on ? "#fff" : "var(--label-dim)",
            transform: on ? "translateX(18px)" : "translateX(2px)",
          }}
        />
      </div>
    </button>
  );
}
