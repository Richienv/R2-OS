"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthShell, { AuthField, AuthSubmit, AuthError } from "@/app/components/AuthShell";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    const supabase = createClient();
    if (!supabase) {
      setError("Sign-up isn't configured yet. Add your Supabase keys to enable it.");
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo:
          typeof window !== "undefined" ? `${window.location.origin}/auth/confirm` : undefined,
      },
    });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    // If email confirmation is required, there's no active session yet.
    if (data.session) {
      router.replace("/");
      router.refresh();
    } else {
      setSent(true);
    }
  }

  if (sent) {
    return (
      <AuthShell title="Check your email" subtitle="One more step">
        <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-dim)", textAlign: "center" }}>
          We sent a confirmation link to <strong style={{ color: "var(--text)" }}>{email}</strong>.
          Tap it to activate your account, then sign in.
        </p>
        <p className="mt-6 text-center" style={{ fontSize: 13 }}>
          <Link href="/login" style={{ color: "var(--text)", fontWeight: 600, textDecoration: "none" }}>
            Back to sign in
          </Link>
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Create your R2·OS" subtitle="Your own private hub">
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <AuthField label="Name" value={name} onChange={setName} autoComplete="name" placeholder="Your name" />
        <AuthField
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          placeholder="you@email.com"
        />
        <AuthField
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          placeholder="At least 6 characters"
        />
        {error && <AuthError>{error}</AuthError>}
        <AuthSubmit busy={busy}>Create account</AuthSubmit>
      </form>
      <p className="mt-6 text-center" style={{ fontSize: 13, color: "var(--text-muted)" }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "var(--text)", fontWeight: 600, textDecoration: "none" }}>
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
