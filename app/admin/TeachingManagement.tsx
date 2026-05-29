"use client";

import { useEffect, useState } from "react";
import { AdminFormModal } from "@/app/components/admin/AdminFormModal";
import {
  adminBtnDangerOutline,
  adminBtnOutline,
  adminBtnPrimary,
  adminBtnSecondary,
} from "@/app/admin/admin-styles";
import { formatAdminDate } from "@/lib/date-format";

type TeachingCourse = {
  id: string;
  name: string;
  updatedAt: string;
};

const emptyForm = { name: "" };

export function TeachingManagement() {
  const [items, setItems] = useState<TeachingCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formModalOpen, setFormModalOpen] = useState(false);

  async function loadItems() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/teaching-courses", { cache: "no-store" });
      const data = (await response.json()) as {
        error?: string;
        teachingCourses?: TeachingCourse[];
      };
      if (!response.ok) {
        setError(data.error ?? "Could not load teaching courses.");
        return;
      }
      setItems(data.teachingCourses ?? []);
    } catch {
      setError("Could not load teaching courses.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadItems();
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setFormModalOpen(false);
  }

  function openCreateModal() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setFormModalOpen(true);
  }

  function startEdit(item: TeachingCourse) {
    setEditingId(item.id);
    setForm({ name: item.name });
    setError("");
    setFormModalOpen(true);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch(
        editingId ? `/api/teaching-courses/${editingId}` : "/api/teaching-courses",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not save course.");
        return;
      }
      resetForm();
      await loadItems();
    } catch {
      setError("Could not save course.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    setError("");
    try {
      const response = await fetch(`/api/teaching-courses/${id}`, { method: "DELETE" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not delete course.");
        return;
      }
      await loadItems();
    } catch {
      setError("Could not delete course.");
    }
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Teaching</h3>
            <p className="mt-1 text-sm text-slate-600">
              Add courses in display order (first added appears first on the site).
            </p>
          </div>
          <button type="button" onClick={openCreateModal} className={adminBtnPrimary}>
            Add course
          </button>
        </div>

        {error && !formModalOpen ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
        {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
        {!loading && !items.length ? (
          <p className="text-sm text-slate-500">No courses added yet.</p>
        ) : null}

        <div className="grid gap-4">
          {items.map((item, index) => (
            <article
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                #{index + 1}
              </p>
              <p className="mt-1 text-sm text-slate-800">{item.name}</p>
              <p className="mt-1 text-xs text-slate-500">
                Updated: {formatAdminDate(item.updatedAt)}
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
        title={editingId ? "Edit course" : "Add course"}
        description='Course name only, e.g. "Ground Water Hydrology – CE-21352".'
        size="md"
      >
        <form onSubmit={submit} className="grid gap-3">
          <input
            required
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Course name"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />

          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2 pt-1">
            <button type="submit" disabled={saving} className={adminBtnPrimary}>
              {saving ? "Saving..." : editingId ? "Update course" : "Create course"}
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
