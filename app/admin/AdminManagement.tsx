"use client";

import { useEffect, useState } from "react";

type Admin = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
};

export function AdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadAdmins() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admins", { cache: "no-store" });
      const data = (await response.json()) as { admins?: Admin[]; error?: string };

      if (!response.ok) {
        setError(data.error ?? "Could not load admins.");
        return;
      }

      setAdmins(data.admins ?? []);
    } catch {
      setError("Could not load admins.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAdmins();
  }, []);

  async function createAdmin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Could not create admin.");
        return;
      }

      setName("");
      setEmail("");
      setPassword("");
      await loadAdmins();
    } catch {
      setError("Could not create admin.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Admin Management</h2>
      <p className="mt-1 text-sm text-slate-600">
        Create and view admin users. Only authenticated admins can access this.
      </p>

      <form onSubmit={createAdmin} className="mt-6 grid gap-3 md:grid-cols-4">
        <input
          required
          minLength={2}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Name"
          className="rounded-md border px-3 py-2"
        />
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          className="rounded-md border px-3 py-2"
        />
        <input
          required
          type="password"
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          className="rounded-md border px-3 py-2"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
        >
          {saving ? "Creating..." : "Create Admin"}
        </button>
      </form>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b text-sm text-slate-600">
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-3 py-3 text-sm text-slate-500" colSpan={4}>
                  Loading admins...
                </td>
              </tr>
            ) : admins.length ? (
              admins.map((admin) => (
                <tr key={admin.id} className="border-b text-sm">
                  <td className="px-3 py-2">{admin.name}</td>
                  <td className="px-3 py-2">{admin.email}</td>
                  <td className="px-3 py-2">
                    {admin.isActive ? "Active" : "Inactive"}
                  </td>
                  <td className="px-3 py-2">
                    {new Date(admin.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-3 py-3 text-sm text-slate-500" colSpan={4}>
                  No admins found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
