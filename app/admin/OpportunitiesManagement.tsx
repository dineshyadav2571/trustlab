"use client";

import { useEffect, useState } from "react";
import { AdminFormModal } from "@/app/components/admin/AdminFormModal";
import {
  adminBtnDangerOutline,
  adminBtnOutline,
  adminBtnPrimary,
  adminBtnSecondary,
} from "@/app/admin/admin-styles";

type Opportunity = {
  id: string;
  text: string;
  updatedAt: string;
};

export function OpportunitiesManagement() {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [formModalOpen, setFormModalOpen] = useState(false);

  async function loadItems() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/opportunities", { cache: "no-store" });
      const data = (await response.json()) as {
        error?: string;
        opportunities?: Opportunity[];
      };
      if (!response.ok) {
        setError(data.error ?? "Could not load opportunities.");
        return;
      }
      setItems(data.opportunities ?? []);
    } catch {
      setError("Could not load opportunities.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadItems();
  }, []);

  function resetForm() {
    setEditingId(null);
    setText("");
    setFormModalOpen(false);
  }

  function openCreateModal() {
    setEditingId(null);
    setText("");
    setError("");
    setFormModalOpen(true);
  }

  function startEdit(item: Opportunity) {
    setEditingId(item.id);
    setText(item.text);
    setError("");
    setFormModalOpen(true);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch(
        editingId ? `/api/opportunities/${editingId}` : "/api/opportunities",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        },
      );
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not save.");
        return;
      }
      resetForm();
      await loadItems();
    } catch {
      setError("Could not save.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    setError("");
    try {
      const response = await fetch(`/api/opportunities/${id}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not delete.");
        return;
      }
      await loadItems();
    } catch {
      setError("Could not delete.");
    }
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Opportunities</h3>
            <p className="mt-1 text-sm text-slate-600">
              Text only. On the public site, wrap phrases in{" "}
              <code className="rounded bg-slate-100 px-1 text-xs">**double asterisks**</code> for
              bold.
            </p>
          </div>
          <button type="button" onClick={openCreateModal} className={adminBtnPrimary}>
            Add opportunity
          </button>
        </div>

        {error && !formModalOpen ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
        {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
        {!loading && !items.length ? (
          <p className="text-sm text-slate-500">No entries yet.</p>
        ) : null}

        <div className="grid gap-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="whitespace-pre-wrap text-sm text-slate-800">{item.text}</p>
              <p className="mt-2 text-xs text-slate-500">
                Updated: {new Date(item.updatedAt).toLocaleString()}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => startEdit(item)} className={adminBtnOutline}>
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void remove(item.id)}
                  className={adminBtnDangerOutline}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <AdminFormModal
        open={formModalOpen}
        onClose={resetForm}
        title={editingId ? "Edit opportunity" : "Add opportunity"}
        description="Enter the opportunity text."
        size="md"
      >
        <form onSubmit={submit} className="grid gap-3">
          <textarea
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Opportunity text"
            rows={6}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2 pt-1">
            <button type="submit" disabled={saving} className={adminBtnPrimary}>
              {saving ? "Saving…" : editingId ? "Update" : "Create"}
            </button>
            <button type="button" onClick={resetForm} className={adminBtnSecondary}>
              Cancel
            </button>
          </div>
        </form>
      </AdminFormModal>
    </div>
  );
}
