"use client";

import { useEffect, useState } from "react";
import { AdminFormModal } from "@/app/components/admin/AdminFormModal";
import {
  adminBtnDangerOutline,
  adminBtnOutline,
  adminBtnPrimary,
  adminBtnSecondary,
} from "@/app/admin/admin-styles";

type OtherActivityItem = {
  id: string;
  text: string;
  sortOrder: number;
};

type OtherActivitySection = {
  id: string;
  title: string;
  sortOrder: number;
  listStyle: "default" | "award";
  items: OtherActivityItem[];
  updatedAt: string;
};

type SectionForm = {
  title: string;
  sortOrder: number;
  listStyle: "default" | "award";
};

const emptySectionForm: SectionForm = { title: "", sortOrder: 0, listStyle: "default" };
const emptyItemForm = { text: "", sortOrder: 0 };

export function OtherActivitiesManagement() {
  const [sections, setSections] = useState<OtherActivitySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState("");

  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionForm, setSectionForm] = useState<SectionForm>(emptySectionForm);

  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [itemSectionId, setItemSectionId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemForm, setItemForm] = useState(emptyItemForm);

  async function loadSections() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/other-activity-sections", { cache: "no-store" });
      const data = (await response.json()) as {
        error?: string;
        otherActivitySections?: OtherActivitySection[];
      };
      if (!response.ok) {
        setError(data.error ?? "Could not load other activity sections.");
        return;
      }
      setSections(data.otherActivitySections ?? []);
    } catch {
      setError("Could not load other activity sections.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSections();
  }, []);

  function resetSectionForm() {
    setEditingSectionId(null);
    setSectionForm(emptySectionForm);
    setSectionModalOpen(false);
  }

  function openCreateSection() {
    setEditingSectionId(null);
    setSectionForm(emptySectionForm);
    setError("");
    setSectionModalOpen(true);
  }

  function openEditSection(section: OtherActivitySection) {
    setEditingSectionId(section.id);
    setSectionForm({
      title: section.title,
      sortOrder: section.sortOrder,
      listStyle: section.listStyle,
    });
    setError("");
    setSectionModalOpen(true);
  }

  async function submitSection(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch(
        editingSectionId
          ? `/api/other-activity-sections/${editingSectionId}`
          : "/api/other-activity-sections",
        {
          method: editingSectionId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sectionForm),
        },
      );
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not save section.");
        return;
      }
      resetSectionForm();
      await loadSections();
    } catch {
      setError("Could not save section.");
    } finally {
      setSaving(false);
    }
  }

  async function removeSection(id: string) {
    if (!window.confirm("Delete this heading and all items under it?")) return;
    setError("");
    try {
      const response = await fetch(`/api/other-activity-sections/${id}`, { method: "DELETE" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not delete section.");
        return;
      }
      await loadSections();
    } catch {
      setError("Could not delete section.");
    }
  }

  function resetItemForm() {
    setItemSectionId(null);
    setEditingItemId(null);
    setItemForm(emptyItemForm);
    setItemModalOpen(false);
  }

  function openAddItem(sectionId: string) {
    setItemSectionId(sectionId);
    setEditingItemId(null);
    setItemForm(emptyItemForm);
    setError("");
    setItemModalOpen(true);
  }

  function openEditItem(sectionId: string, item: OtherActivityItem) {
    setItemSectionId(sectionId);
    setEditingItemId(item.id);
    setItemForm({ text: item.text, sortOrder: item.sortOrder });
    setError("");
    setItemModalOpen(true);
  }

  async function submitItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!itemSectionId) return;

    setSaving(true);
    setError("");
    try {
      const url = editingItemId
        ? `/api/other-activity-sections/${itemSectionId}/items/${editingItemId}`
        : `/api/other-activity-sections/${itemSectionId}/items`;
      const response = await fetch(url, {
        method: editingItemId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemForm),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not save item.");
        return;
      }
      resetItemForm();
      await loadSections();
    } catch {
      setError("Could not save item.");
    } finally {
      setSaving(false);
    }
  }

  async function removeItem(sectionId: string, itemId: string) {
    setError("");
    try {
      const response = await fetch(
        `/api/other-activity-sections/${sectionId}/items/${itemId}`,
        { method: "DELETE" },
      );
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not delete item.");
        return;
      }
      await loadSections();
    } catch {
      setError("Could not delete item.");
    }
  }

  async function loadDemoData() {
    if (
      !window.confirm(
        "This replaces all other activity sections with the reference demo list. Continue?",
      )
    ) {
      return;
    }
    setSeeding(true);
    setError("");
    try {
      const response = await fetch("/api/other-activity-sections/seed", { method: "POST" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not load demo data.");
        return;
      }
      await loadSections();
    } catch {
      setError("Could not load demo data.");
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Other activities sections</h3>
          <p className="mt-1 text-sm text-slate-600">
            Create a section heading (e.g. Expert Lectures / Talks), pick a list style, then add as
            many bullet entries as you need.
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
          <button type="button" onClick={openCreateSection} className={adminBtnPrimary}>
            Add heading
          </button>
        </div>
      </div>

      {error && !sectionModalOpen && !itemModalOpen ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
      {!loading && !sections.length ? (
        <p className="text-sm text-slate-500">
          No sections yet. Add a heading or load demo data.
        </p>
      ) : null}

      <div className="space-y-6">
        {sections.map((section) => (
          <article
            key={section.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Heading · {section.listStyle} · order {section.sortOrder}
                </p>
                <h4 className="mt-1 text-lg font-semibold text-slate-900">{section.title}</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => openAddItem(section.id)}
                  className={adminBtnPrimary}
                >
                  Add item
                </button>
                <button
                  type="button"
                  onClick={() => openEditSection(section)}
                  className={adminBtnOutline}
                >
                  Edit heading
                </button>
                <button
                  type="button"
                  onClick={() => void removeSection(section.id)}
                  className={adminBtnDangerOutline}
                >
                  Delete heading
                </button>
              </div>
            </div>

            {section.items.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No items under this heading yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {section.items.map((item, index) => (
                  <li
                    key={item.id}
                    className="flex flex-wrap items-start justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-500">#{index + 1} · order {item.sortOrder}</p>
                      <p className="text-sm text-slate-800">{item.text}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => openEditItem(section.id, item)}
                        className={adminBtnOutline}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void removeItem(section.id, item.id)}
                        className={adminBtnDangerOutline}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>

      <AdminFormModal
        open={sectionModalOpen}
        onClose={resetSectionForm}
        title={editingSectionId ? "Edit heading" : "Add heading"}
        description='Example: "Expert Lectures / Talks" or "Awards & Achievements"'
        size="md"
      >
        <form onSubmit={submitSection} className="grid gap-3">
          <input
            required
            value={sectionForm.title}
            onChange={(e) => setSectionForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="Section heading"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <select
            value={sectionForm.listStyle}
            onChange={(e) =>
              setSectionForm((p) => ({
                ...p,
                listStyle: e.target.value as "default" | "award",
              }))
            }
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="default">Default bullets</option>
            <option value="award">Awards (bold year, use &quot;2016 – Description&quot;)</option>
          </select>
          <input
            type="number"
            value={sectionForm.sortOrder}
            onChange={(e) =>
              setSectionForm((p) => ({ ...p, sortOrder: Number(e.target.value) || 0 }))
            }
            placeholder="Sort order"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          {error && sectionModalOpen ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2 pt-1">
            <button type="submit" disabled={saving} className={adminBtnPrimary}>
              {saving ? "Saving..." : editingSectionId ? "Update heading" : "Create heading"}
            </button>
            <button type="button" onClick={resetSectionForm} className={adminBtnSecondary}>
              Cancel
            </button>
          </div>
        </form>
      </AdminFormModal>

      <AdminFormModal
        open={itemModalOpen}
        onClose={resetItemForm}
        title={editingItemId ? "Edit item" : "Add item"}
        description="Activity text. For awards use: 2016 – Your achievement text."
        size="md"
      >
        <form onSubmit={submitItem} className="grid gap-3">
          <textarea
            required
            value={itemForm.text}
            onChange={(e) => setItemForm((p) => ({ ...p, text: e.target.value }))}
            placeholder="Activity or lecture description"
            rows={4}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="number"
            value={itemForm.sortOrder}
            onChange={(e) =>
              setItemForm((p) => ({ ...p, sortOrder: Number(e.target.value) || 0 }))
            }
            placeholder="Sort order within heading"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          {error && itemModalOpen ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2 pt-1">
            <button type="submit" disabled={saving} className={adminBtnPrimary}>
              {saving ? "Saving..." : editingItemId ? "Update item" : "Add item"}
            </button>
            <button type="button" onClick={resetItemForm} className={adminBtnSecondary}>
              Cancel
            </button>
          </div>
        </form>
      </AdminFormModal>
    </div>
  );
}
