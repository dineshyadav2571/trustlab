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

type StudentCategory =
  | "Ph.D. Ongoing"
  | "M.Tech Students"
  | "B.Tech Students"
  | "External Thesis (BITS Pilani)";

type SupervisedStudent = {
  id: string;
  category: StudentCategory;
  nameLine: string;
  topic: string;
  sortOrder: number;
  updatedAt: string;
};

const categories: StudentCategory[] = [
  "Ph.D. Ongoing",
  "M.Tech Students",
  "B.Tech Students",
  "External Thesis (BITS Pilani)",
];

const emptyForm = {
  category: "Ph.D. Ongoing" as StudentCategory,
  nameLine: "",
  topic: "",
  sortOrder: 0,
};

export function StudentsManagement() {
  const [items, setItems] = useState<SupervisedStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formModalOpen, setFormModalOpen] = useState(false);

  async function loadItems() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/supervised-students", { cache: "no-store" });
      const data = (await response.json()) as {
        error?: string;
        supervisedStudents?: SupervisedStudent[];
      };
      if (!response.ok) {
        setError(data.error ?? "Could not load students.");
        return;
      }
      setItems(data.supervisedStudents ?? []);
    } catch {
      setError("Could not load students.");
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

  function startEdit(item: SupervisedStudent) {
    setEditingId(item.id);
    setForm({
      category: item.category,
      nameLine: item.nameLine,
      topic: item.topic,
      sortOrder: item.sortOrder,
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
        editingId ? `/api/supervised-students/${editingId}` : "/api/supervised-students",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not save student.");
        return;
      }
      resetForm();
      await loadItems();
    } catch {
      setError("Could not save student.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    setError("");
    try {
      const response = await fetch(`/api/supervised-students/${id}`, { method: "DELETE" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not delete student.");
        return;
      }
      await loadItems();
    } catch {
      setError("Could not delete student.");
    }
  }

  async function loadDemoData() {
    if (
      !window.confirm(
        "This replaces all supervised students with the reference demo list. Continue?",
      )
    ) {
      return;
    }
    setSeeding(true);
    setError("");
    try {
      const response = await fetch("/api/supervised-students/seed", { method: "POST" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not load demo data.");
        return;
      }
      await loadItems();
    } catch {
      setError("Could not load demo data.");
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Thesis supervised</h3>
            <p className="mt-1 text-sm text-slate-600">
              Grouped by category on the public Students page. Use sort order to control position
              within each group.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void loadDemoData()}
              disabled={seeding}
              className={adminBtnSecondary}
            >
              {seeding ? "Loading..." : "Load demo data"}
            </button>
            <button type="button" onClick={openCreateModal} className={adminBtnPrimary}>
              Add student
            </button>
          </div>
        </div>

        {error && !formModalOpen ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
        {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
        {!loading && !items.length ? (
          <p className="text-sm text-slate-500">
            No students yet. Add entries or use Load demo data for the reference list.
          </p>
        ) : null}

        <div className="grid gap-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {item.category} · order {item.sortOrder}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{item.nameLine}</p>
              <p className="mt-1 text-sm text-slate-700">{item.topic}</p>
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
        title={editingId ? "Edit supervised student" : "Add supervised student"}
        description='Name line example: "Harshit Patel (24065047) (2025-26)". Topic is the thesis title.'
        size="lg"
      >
        <form onSubmit={submit} className="grid gap-3">
          <select
            value={form.category}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, category: e.target.value as StudentCategory }))
            }
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            required
            value={form.nameLine}
            onChange={(e) => setForm((prev) => ({ ...prev, nameLine: e.target.value }))}
            placeholder="Student name line"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <textarea
            required
            value={form.topic}
            onChange={(e) => setForm((prev) => ({ ...prev, topic: e.target.value }))}
            placeholder="Thesis / project topic"
            rows={4}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, sortOrder: Number(e.target.value) || 0 }))
            }
            placeholder="Sort order within category"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />

          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2 pt-1">
            <button type="submit" disabled={saving} className={adminBtnPrimary}>
              {saving ? "Saving..." : editingId ? "Update student" : "Create student"}
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
