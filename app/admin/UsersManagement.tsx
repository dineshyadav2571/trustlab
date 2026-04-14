"use client";

import { useEffect, useState } from "react";

type UserRow = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
};

export function UsersManagement() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadUsers() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/users", { cache: "no-store" });
      const data = (await response.json()) as { users?: UserRow[]; error?: string };

      if (!response.ok) {
        setError(data.error ?? "Could not load users.");
        return;
      }

      setUsers(data.users ?? []);
    } catch {
      setError("Could not load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  async function createUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setInfo("");

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = (await response.json()) as {
        error?: string;
        emailSent?: boolean;
      };

      if (!response.ok) {
        setError(data.error ?? "Could not create user.");
        return;
      }

      if (data.emailSent === false) {
        setInfo("User created, but the onboarding email could not be sent. Check Brevo configuration.");
      } else {
        setInfo("User created and onboarding email sent.");
      }

      setName("");
      setEmail("");
      setPassword("");
      await loadUsers();
    } catch {
      setError("Could not create user.");
    } finally {
      setSaving(false);
    }
  }

  async function setActive(id: string, isActive: boolean) {
    setError("");
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not update user.");
        return;
      }
      await loadUsers();
    } catch {
      setError("Could not update user.");
    }
  }

  async function removeUser(id: string) {
    if (!window.confirm("Delete this user permanently?")) return;
    setError("");
    try {
      const response = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not delete user.");
        return;
      }
      await loadUsers();
    } catch {
      setError("Could not delete user.");
    }
  }

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Users</h2>
      <p className="mt-1 text-sm text-slate-600">
        Create normal (non-admin) accounts. Onboarding and password reset use the same email flow
        as admins, with user-specific pages at <code className="text-xs">/user/login</code>,{" "}
        <code className="text-xs">/user/forgot-password</code>.
      </p>

      <form onSubmit={createUser} className="mt-6 grid gap-3 md:grid-cols-4">
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
          placeholder="Temporary password"
          className="rounded-md border px-3 py-2"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
        >
          {saving ? "Creating..." : "Create user"}
        </button>
      </form>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      {info ? <p className="mt-3 text-sm text-emerald-700">{info}</p> : null}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b text-slate-600">
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Created</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-3 py-3 text-slate-500" colSpan={5}>
                  Loading users...
                </td>
              </tr>
            ) : users.length ? (
              users.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="px-3 py-2">{u.name}</td>
                  <td className="px-3 py-2">{u.email}</td>
                  <td className="px-3 py-2">{u.isActive ? "Active" : "Inactive"}</td>
                  <td className="px-3 py-2">{new Date(u.createdAt).toLocaleString()}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => void setActive(u.id, !u.isActive)}
                        className="rounded-md border px-2 py-1 text-xs"
                      >
                        {u.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        type="button"
                        onClick={() => void removeUser(u.id)}
                        className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-3 py-3 text-slate-500" colSpan={5}>
                  No users yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
