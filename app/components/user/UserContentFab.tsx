"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import Link from "next/link";

export function UserContentFab() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [clientId, setClientId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const goToContent = useCallback(() => {
    setModalOpen(false);
    router.push("/user/content");
  }, [router]);

  const handleFabClick = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/auth/user/me", { credentials: "include" });
      if (res.ok) {
        goToContent();
        return;
      }
    } catch {
      setError("Could not reach the server.");
      setModalOpen(true);
      return;
    }
    setModalOpen(true);
  }, [goToContent]);

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
        onClick={handleFabClick}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--btrust-teal)] text-white shadow-lg transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--btrust-teal)]"
        aria-label="Open your assigned downloads and content"
        title="Your content"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
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
