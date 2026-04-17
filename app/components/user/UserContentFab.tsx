"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type SessionState = "loading" | "guest" | "authenticated";

export function UserHeaderAccess() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [clientId, setClientId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionState, setSessionState] = useState<SessionState>("loading");

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/user/me", { credentials: "include" });
      setSessionState(res.ok ? "authenticated" : "guest");
      return res.ok;
    } catch {
      setSessionState("guest");
      return false;
    }
  }, []);

  useEffect(() => {
    void checkSession();
  }, [checkSession]);

  const goToContent = useCallback(() => {
    setModalOpen(false);
    router.push("/user/content");
  }, [router]);

  const handleActionClick = useCallback(async () => {
    setError(null);
    if (sessionState === "authenticated") {
      goToContent();
      return;
    }
    const isAuthenticated = await checkSession();
    if (isAuthenticated) {
      goToContent();
      return;
    }
    setModalOpen(true);
  }, [checkSession, goToContent, sessionState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: clientId.trim().toLowerCase(),
          password,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Sign-in failed.");
        return;
      }
      setSessionState("authenticated");
      setPassword("");
      goToContent();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleActionClick}
        className="rounded-md border border-[var(--btrust-teal)] px-3 py-2 text-sm font-medium text-[var(--btrust-teal)] transition hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--btrust-teal)] focus-visible:ring-offset-2"
        aria-label={sessionState === "authenticated" ? "Open your dashboard" : "Sign in to your dashboard"}
      >
        {sessionState === "authenticated" ? "Dashboard" : "Login"}
      </button>

      {modalOpen ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-end bg-black/40 p-4 sm:items-center sm:justify-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="user-content-login-title"
          onMouseDown={(ev) => {
            if (ev.target === ev.currentTarget) {
              setModalOpen(false);
            }
          }}
        >
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <h2
              id="user-content-login-title"
              className="text-lg font-semibold text-slate-900"
            >
              Sign in to your content
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Use the client ID (email) and password your administrator gave you.
            </p>
            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="fab-client-id" className="block text-sm font-medium text-slate-700">
                  Client ID (email)
                </label>
                <input
                  id="fab-client-id"
                  type="email"
                  autoComplete="username"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--btrust-teal)] focus:ring-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="fab-password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  id="fab-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--btrust-teal)] focus:ring-2"
                  required
                />
              </div>
              {error ? (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-md bg-[var(--btrust-teal)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                >
                  {loading ? "Signing in…" : "Continue"}
                </button>
                <button
                  type="button"
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
              <p className="text-sm text-slate-600">
                <Link href="/user/forgot-password" className="font-medium text-[var(--btrust-teal)] underline">
                  Forgot password
                </Link>
              </p>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
