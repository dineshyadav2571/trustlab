"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={busy}
      aria-busy={busy}
      className="w-full rounded-lg border border-slate-600/80 bg-slate-800/80 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--btrust-teal)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
