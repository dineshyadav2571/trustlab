"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white hover:bg-slate-700"
    >
      Logout
    </button>
  );
}
