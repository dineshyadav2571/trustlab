"use client";

import { useEffect, useState } from "react";
import { AdminFormModal } from "@/app/components/admin/AdminFormModal";
import {
  adminBtnDangerOutline,
  adminBtnOutline,
  adminBtnPrimary,
  adminBtnSecondary,
} from "@/app/admin/admin-styles";
import { importantLinkIcons } from "@/lib/important-link-types";

type LinkItem = {
  id: string;
  icon: string;
  title: string;
  url: string;
  description: string;
  sortOrder: number;
};

type Category = {
  id: string;
  title: string;
  sortOrder: number;
  links: LinkItem[];
};

type Section = {
  id: string;
  title: string;
  intro: string;
  layout: "simple" | "grouped";
  sortOrder: number;
  categories: Category[];
};

const emptySectionForm: {
  title: string;
  intro: string;
  layout: "simple" | "grouped";
  sortOrder: number;
} = {
  title: "",
  intro: "",
  layout: "grouped",
  sortOrder: 0,
};

const emptyCategoryForm = { title: "", sortOrder: 0 };

const emptyLinkForm = {
  icon: "globe",
  title: "",
  url: "",
  description: "",
  sortOrder: 0,
};

const iconLabels: Record<string, string> = {
  globe: "Globe",
  water: "Water",
  monitor: "Monitor",
  map: "Map",
  laptop: "Laptop",
  book: "Book",
  link: "Link",
  chart: "Chart",
  database: "Database",
  mail: "Mail",
};

export function ImportantLinksManagement() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState("");

  const [sectionModal, setSectionModal] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionForm, setSectionForm] = useState(emptySectionForm);

  const [categoryModal, setCategoryModal] = useState(false);
  const [categorySectionId, setCategorySectionId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);

  const [linkModal, setLinkModal] = useState(false);
  const [linkSectionId, setLinkSectionId] = useState<string | null>(null);
  const [linkCategoryId, setLinkCategoryId] = useState<string | null>(null);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [linkForm, setLinkForm] = useState(emptyLinkForm);

  async function loadSections() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/important-link-sections", { cache: "no-store" });
      const data = (await response.json()) as {
        error?: string;
        importantLinkSections?: Section[];
      };
      if (!response.ok) {
        setError(data.error ?? "Could not load sections.");
        return;
      }
      setSections(data.importantLinkSections ?? []);
    } catch {
      setError("Could not load sections.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSections();
  }, []);

  async function seedDefaults() {
    if (!confirm("Replace all important link sections with default sample content?")) return;
    setSeeding(true);
    setError("");
    try {
      const response = await fetch("/api/important-link-sections/seed", { method: "POST" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not seed defaults.");
        return;
      }
      await loadSections();
    } catch {
      setError("Could not seed defaults.");
    } finally {
      setSeeding(false);
    }
  }

  function openCreateSection() {
    setEditingSectionId(null);
    setSectionForm(emptySectionForm);
    setSectionModal(true);
  }

  function openEditSection(section: Section) {
    setEditingSectionId(section.id);
    setSectionForm({
      title: section.title,
      intro: section.intro,
      layout: section.layout,
      sortOrder: section.sortOrder,
    });
    setSectionModal(true);
  }

  async function submitSection(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch(
        editingSectionId
          ? `/api/important-link-sections/${editingSectionId}`
          : "/api/important-link-sections",
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
      setSectionModal(false);
      await loadSections();
    } catch {
      setError("Could not save section.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteSection(id: string) {
    if (!confirm("Delete this section and all its links?")) return;
    setError("");
    try {
      const response = await fetch(`/api/important-link-sections/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Could not delete section.");
        return;
      }
      await loadSections();
    } catch {
      setError("Could not delete section.");
    }
  }

  function openCreateCategory(sectionId: string) {
    setCategorySectionId(sectionId);
    setEditingCategoryId(null);
    setCategoryForm(emptyCategoryForm);
    setCategoryModal(true);
  }

  function openEditCategory(sectionId: string, category: Category) {
    setCategorySectionId(sectionId);
    setEditingCategoryId(category.id);
    setCategoryForm({ title: category.title, sortOrder: category.sortOrder });
    setCategoryModal(true);
  }

  async function submitCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!categorySectionId) return;
    setSaving(true);
    setError("");
    try {
      const url = editingCategoryId
        ? `/api/important-link-sections/${categorySectionId}/categories/${editingCategoryId}`
        : `/api/important-link-sections/${categorySectionId}/categories`;
      const response = await fetch(url, {
        method: editingCategoryId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not save category.");
        return;
      }
      setCategoryModal(false);
      await loadSections();
    } catch {
      setError("Could not save category.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteCategory(sectionId: string, categoryId: string) {
    if (!confirm("Delete this category and its links?")) return;
    try {
      const response = await fetch(
        `/api/important-link-sections/${sectionId}/categories/${categoryId}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Could not delete category.");
        return;
      }
      await loadSections();
    } catch {
      setError("Could not delete category.");
    }
  }

  function openCreateLink(sectionId: string, categoryId: string) {
    setLinkSectionId(sectionId);
    setLinkCategoryId(categoryId);
    setEditingLinkId(null);
    setLinkForm(emptyLinkForm);
    setLinkModal(true);
  }

  function openEditLink(sectionId: string, categoryId: string, link: LinkItem) {
    setLinkSectionId(sectionId);
    setLinkCategoryId(categoryId);
    setEditingLinkId(link.id);
    setLinkForm({
      icon: link.icon,
      title: link.title,
      url: link.url,
      description: link.description,
      sortOrder: link.sortOrder,
    });
    setLinkModal(true);
  }

  async function submitLink(e: React.FormEvent) {
    e.preventDefault();
    if (!linkSectionId || !linkCategoryId) return;
    setSaving(true);
    setError("");
    try {
      const url = editingLinkId
        ? `/api/important-link-sections/${linkSectionId}/categories/${linkCategoryId}/links/${editingLinkId}`
        : `/api/important-link-sections/${linkSectionId}/categories/${linkCategoryId}/links`;
      const response = await fetch(url, {
        method: editingLinkId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(linkForm),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not save link.");
        return;
      }
      setLinkModal(false);
      await loadSections();
    } catch {
      setError("Could not save link.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteLink(sectionId: string, categoryId: string, linkId: string) {
    if (!confirm("Delete this link?")) return;
    try {
      const response = await fetch(
        `/api/important-link-sections/${sectionId}/categories/${categoryId}/links/${linkId}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Could not delete link.");
        return;
      }
      await loadSections();
    } catch {
      setError("Could not delete link.");
    }
  }

  async function ensureCategoryForSimple(section: Section) {
    if (section.categories.length > 0) return section.categories[0].id;
    const response = await fetch(`/api/important-link-sections/${section.id}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "", sortOrder: 0 }),
    });
    const data = (await response.json()) as {
      error?: string;
      importantLinkSection?: Section;
    };
    if (!response.ok) throw new Error(data.error ?? "Could not create category.");
    const cat = data.importantLinkSection?.categories.at(-1);
    if (!cat) throw new Error("Category missing after create.");
    await loadSections();
    return cat.id;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          Page sections, optional intro text, grouped categories, and links with icons.
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => void seedDefaults()} disabled={seeding} className={adminBtnOutline}>
            {seeding ? "Seeding…" : "Load sample content"}
          </button>
          <button type="button" onClick={openCreateSection} className={adminBtnPrimary}>
            Add section
          </button>
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-500">Loading…</p> : null}

      <div className="space-y-6">
        {sections.map((section) => (
          <article key={section.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{section.title}</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Layout: {section.layout === "simple" ? "Simple list" : "Grouped cards"} · Order{" "}
                  {section.sortOrder}
                </p>
                {section.intro ? (
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2">{section.intro}</p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => openEditSection(section)} className={adminBtnSecondary}>
                  Edit section
                </button>
                {section.layout === "grouped" ? (
                  <button
                    type="button"
                    onClick={() => openCreateCategory(section.id)}
                    className={adminBtnOutline}
                  >
                    Add category
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const catId = await ensureCategoryForSimple(section);
                        openCreateLink(section.id, catId);
                      } catch (err) {
                        setError(err instanceof Error ? err.message : "Could not add link.");
                      }
                    }}
                    className={adminBtnOutline}
                  >
                    Add link
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => void deleteSection(section.id)}
                  className={adminBtnDangerOutline}
                >
                  Delete
                </button>
              </div>
            </div>

            {section.categories.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No categories yet.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {section.categories.map((category) => (
                  <div key={category.id} className="rounded-lg border border-slate-100 bg-slate-50/80 p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-medium text-slate-800">
                        {category.title || "(untitled category)"}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openCreateLink(section.id, category.id)}
                          className={adminBtnOutline}
                        >
                          Add link
                        </button>
                        {section.layout === "grouped" ? (
                          <>
                            <button
                              type="button"
                              onClick={() => openEditCategory(section.id, category)}
                              className={adminBtnSecondary}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => void deleteCategory(section.id, category.id)}
                              className={adminBtnDangerOutline}
                            >
                              Delete
                            </button>
                          </>
                        ) : null}
                      </div>
                    </div>
                    {category.links.length === 0 ? (
                      <p className="text-sm text-slate-500">No links.</p>
                    ) : (
                      <ul className="space-y-2">
                        {category.links.map((link) => (
                          <li
                            key={link.id}
                            className="flex flex-wrap items-start justify-between gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                          >
                            <div>
                              <p className="font-medium text-slate-900">
                                [{iconLabels[link.icon] ?? link.icon}] {link.title}
                              </p>
                              <p className="text-xs text-slate-500 truncate max-w-md">{link.url}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => openEditLink(section.id, category.id, link)}
                                className={adminBtnSecondary}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  void deleteLink(section.id, category.id, link.id)
                                }
                                className={adminBtnDangerOutline}
                              >
                                Delete
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>

      <AdminFormModal open={sectionModal} title={editingSectionId ? "Edit section" : "New section"} onClose={() => setSectionModal(false)}>
        <form onSubmit={(e) => void submitSection(e)} className="space-y-4">
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Title</span>
            <input
              required
              value={sectionForm.title}
              onChange={(e) => setSectionForm((f) => ({ ...f, title: e.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Intro (optional)</span>
            <textarea
              value={sectionForm.intro}
              onChange={(e) => setSectionForm((f) => ({ ...f, intro: e.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Layout</span>
            <select
              value={sectionForm.layout}
              onChange={(e) =>
                setSectionForm((f) => ({
                  ...f,
                  layout: e.target.value as "simple" | "grouped",
                }))
              }
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="simple">Simple list (e.g. My Content)</option>
              <option value="grouped">Grouped cards (e.g. Tools & Resources)</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Sort order</span>
            <input
              type="number"
              value={sectionForm.sortOrder}
              onChange={(e) =>
                setSectionForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))
              }
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <button type="submit" disabled={saving} className={adminBtnPrimary}>
            {saving ? "Saving…" : "Save"}
          </button>
        </form>
      </AdminFormModal>

      <AdminFormModal open={categoryModal} title={editingCategoryId ? "Edit category" : "New category"} onClose={() => setCategoryModal(false)}>
        <form onSubmit={(e) => void submitCategory(e)} className="space-y-4">
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Category title</span>
            <input
              value={categoryForm.title}
              onChange={(e) => setCategoryForm((f) => ({ ...f, title: e.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder="Watershed Delineation & Hydro Tools"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Sort order</span>
            <input
              type="number"
              value={categoryForm.sortOrder}
              onChange={(e) =>
                setCategoryForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))
              }
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <button type="submit" disabled={saving} className={adminBtnPrimary}>
            {saving ? "Saving…" : "Save"}
          </button>
        </form>
      </AdminFormModal>

      <AdminFormModal open={linkModal} title={editingLinkId ? "Edit link" : "New link"} onClose={() => setLinkModal(false)}>
        <form onSubmit={(e) => void submitLink(e)} className="space-y-4">
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Icon</span>
            <select
              value={linkForm.icon}
              onChange={(e) => setLinkForm((f) => ({ ...f, icon: e.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              {importantLinkIcons.map((icon) => (
                <option key={icon} value={icon}>
                  {iconLabels[icon] ?? icon}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Title</span>
            <input
              required
              value={linkForm.title}
              onChange={(e) => setLinkForm((f) => ({ ...f, title: e.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">URL</span>
            <input
              required
              type="url"
              value={linkForm.url}
              onChange={(e) => setLinkForm((f) => ({ ...f, url: e.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Description</span>
            <textarea
              value={linkForm.description}
              onChange={(e) => setLinkForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Sort order</span>
            <input
              type="number"
              value={linkForm.sortOrder}
              onChange={(e) =>
                setLinkForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))
              }
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <button type="submit" disabled={saving} className={adminBtnPrimary}>
            {saving ? "Saving…" : "Save"}
          </button>
        </form>
      </AdminFormModal>
    </div>
  );
}
