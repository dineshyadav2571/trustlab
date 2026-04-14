"use client";

import { useEffect, useState } from "react";
import { AdminFormModal } from "@/app/components/admin/AdminFormModal";
import { adminBtnPrimary, adminBtnSecondary } from "@/app/admin/admin-styles";

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
  const [formModalOpen, setFormModalOpen] = useState(false);

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

  function resetForm() {
    setName("");
    setEmail("");
    setPassword("");
    setFormModalOpen(false);
  }

  function openCreateModal() {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
    setFormModalOpen(true);
  }

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

      resetForm();
      await loadAdmins();
    } catch {
      setError("Could not create admin.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Admin accounts</h2>
          <p className="mt-1 text-sm text-slate-600">
            Create and view admin users. Only authenticated admins can access this.
          </p>
        </div>
        <button type="button" onClick={openCreateModal} className={adminBtnPrimary}>
          Add admin
        </button>
      </div>

      {error && !formModalOpen ? (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-600">
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-3 py-3 text-slate-500" colSpan={4}>
                  Loading admins...
                </td>
              </tr>
            ) : admins.length ? (
              admins.map((admin) => (
                <tr key={admin.id} className="border-b border-slate-100">
                  <td className="px-3 py-2">{admin.name}</td>
                  <td className="px-3 py-2">{admin.email}</td>
                  <td className="px-3 py-2">{admin.isActive ? "Active" : "Inactive"}</td>
                  <td className="px-3 py-2">{new Date(admin.createdAt).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-3 py-3 text-slate-500" colSpan={4}>
                  No admins found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminFormModal
        open={formModalOpen}
        onClose={resetForm}
        title="Add admin"
        description="Name, email, and password (min 8 characters) are required."
        size="sm"
      >
        <form onSubmit={createAdmin} className="grid gap-3">
          <input
            required
            minLength={2}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            required
            type="password"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />

          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2 pt-1">
            <button type="submit" disabled={saving} className={adminBtnPrimary}>
              {saving ? "Creating…" : "Create admin"}
            </button>
            <button type="button" onClick={resetForm} className={adminBtnSecondary}>
              Cancel
            </button>
          </div>
        </form>
      </AdminFormModal>
    </section>
  );
}
