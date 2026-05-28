"use client";

import { useEffect, useState } from "react";
import { AdminFormModal } from "@/app/components/admin/AdminFormModal";
import {
  adminBtnDangerOutline,
  adminBtnOutline,
  adminBtnPrimary,
  adminBtnSecondary,
} from "@/app/admin/admin-styles";

type AdministrationItem = {
  id: string;
  text: string;
  sortOrder: number;
};

type AdministrationSection = {
  id: string;
  title: string;
  sortOrder: number;
  items: AdministrationItem[];
  updatedAt: string;
};

const emptySectionForm = { title: "", sortOrder: 0 };
const emptyItemForm = { text: "", sortOrder: 0 };

export function AdministrationManagement() {
  const [sections, setSections] = useState<AdministrationSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState("");

  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionForm, setSectionForm] = useState(emptySectionForm);

  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [itemSectionId, setItemSectionId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemForm, setItemForm] = useState(emptyItemForm);

  async function loadSections() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/administration-sections", { cache: "no-store" });
      const data = (await response.json()) as {
        error?: string;
        administrationSections?: AdministrationSection[];
      };
      if (!response.ok) {
        setError(data.error ?? "Could not load administration sections.");
        return;
      }
      setSections(data.administrationSections ?? []);
    } catch {
      setError("Could not load administration sections.");
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

  function openEditSection(section: AdministrationSection) {
    setEditingSectionId(section.id);
    setSectionForm({ title: section.title, sortOrder: section.sortOrder });
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
          ? `/api/administration-sections/${editingSectionId}`
          : "/api/administration-sections",
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
      const response = await fetch(`/api/administration-sections/${id}`, { method: "DELETE" });
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

  function openEditItem(sectionId: string, item: AdministrationItem) {
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
        ? `/api/administration-sections/${itemSectionId}/items/${editingItemId}`
        : `/api/administration-sections/${itemSectionId}/items`;
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
        `/api/administration-sections/${sectionId}/items/${itemId}`,
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
        "This replaces all administration sections with the reference demo list. Continue?",
      )
    ) {
      return;
    }
    setSeeding(true);
    setError("");
    try {
      const response = await fetch("/api/administration-sections/seed", { method: "POST" });
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
          <h3 className="text-lg font-semibold text-slate-900">Administration sections</h3>
          <p className="mt-1 text-sm text-slate-600">
            Create a heading (e.g. institution and years), then add as many bullet entries as you
            need under it.
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
                  Heading Â· order {section.sortOrder}
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
                      <p className="text-xs text-slate-500">#{index + 1} Â· order {item.sortOrder}</p>
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
        description='Example: "IIT (BHU) Varanasi (2023â€“Present)"'
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
        description="Bullet text shown under the heading on the public site."
        size="md"
      >
        <form onSubmit={submitItem} className="grid gap-3">
          <textarea
            required
            value={itemForm.text}
            onChange={(e) => setItemForm((p) => ({ ...p, text: e.target.value }))}
            placeholder="Role or responsibility"
            rows={3}
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
