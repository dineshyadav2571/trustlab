"use client";

import { useEffect, useState } from "react";
import { AdminFormModal } from "@/app/components/admin/AdminFormModal";
import {
  adminBtnDangerOutline,
  adminBtnOutline,
  adminBtnPrimary,
  adminBtnSecondary,
} from "@/app/admin/admin-styles";

type AchievementCategory =
  | "Achievements"
  | "Invited Talks"
  | "Short term program conducted";

type Achievement = {
  id: string;
  category: AchievementCategory;
  text: string;
  updatedAt: string;
};

const categories: AchievementCategory[] = [
  "Achievements",
  "Invited Talks",
  "Short term program conducted",
];

const defaultForm = {
  category: "Achievements" as AchievementCategory,
  text: "",
};

export function AchievementsManagement() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [formModalOpen, setFormModalOpen] = useState(false);

  async function loadItems() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/achievements", { cache: "no-store" });
      const data = (await response.json()) as {
        error?: string;
        achievements?: Achievement[];
      };
      if (!response.ok) {
        setError(data.error ?? "Could not load achievements.");
        return;
      }
      setItems(data.achievements ?? []);
    } catch {
      setError("Could not load achievements.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadItems();
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm(defaultForm);
    setFormModalOpen(false);
  }

  function openCreateModal() {
    setEditingId(null);
    setForm(defaultForm);
    setError("");
    setFormModalOpen(true);
  }

  function startEdit(item: Achievement) {
    setEditingId(item.id);
    setForm({
      category: item.category,
      text: item.text,
    });
    setError("");
    setFormModalOpen(true);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch(
        editingId ? `/api/achievements/${editingId}` : "/api/achievements",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not save achievement.");
        return;
      }
      resetForm();
      await loadItems();
    } catch {
      setError("Could not save achievement.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    setError("");
    try {
      const response = await fetch(`/api/achievements/${id}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not delete achievement.");
        return;
      }
      await loadItems();
    } catch {
      setError("Could not delete achievement.");
    }
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Achievements</h3>
            <p className="mt-1 text-sm text-slate-600">
              Pick a category and enter text. Add opens an empty form; Edit pre-fills it.
            </p>
          </div>
          <button type="button" onClick={openCreateModal} className={adminBtnPrimary}>
            Add achievement
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
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {item.category}
              </p>
              <p className="mt-1 text-sm text-slate-800">{item.text}</p>
              <p className="mt-1 text-xs text-slate-500">
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
        title={editingId ? "Edit achievement" : "Add achievement"}
        description="Pick a category and enter the text."
        size="md"
      >
        <form onSubmit={submit} className="grid gap-3">
          <select
            value={form.category}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                category: e.target.value as AchievementCategory,
              }))
            }
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <textarea
            required
            value={form.text}
            onChange={(e) => setForm((prev) => ({ ...prev, text: e.target.value }))}
            placeholder="Text"
            rows={5}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />

          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2 pt-1">
            <button type="submit" disabled={saving} className={adminBtnPrimary}>
              {saving ? "Saving…" : editingId ? "Update achievement" : "Create achievement"}
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
