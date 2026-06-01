"use client";

import { useEffect, useState } from "react";
import { HighlightSlideImage } from "@/app/components/site/home/HighlightSlideImage";
import { AdminFormModal } from "@/app/components/admin/AdminFormModal";
import { AdminImageField } from "@/app/components/admin/AdminImageField";
import {
  adminBtnDangerOutline,
  adminBtnOutline,
  adminBtnPrimary,
  adminBtnSecondary,
} from "@/app/admin/admin-styles";
import { formatAdminDate } from "@/lib/date-format";

type HighlightItem = {
  id: string;
  alt: string;
  sortOrder: number;
  imageUrl: string;
  imageMimeType: string;
  imageBase64: string;
  updatedAt: string;
};

function previewSrc(item: HighlightItem) {
  if (item.imageBase64 && item.imageMimeType) {
    return `data:${item.imageMimeType};base64,${item.imageBase64}`;
  }
  return `${item.imageUrl}?v=${encodeURIComponent(item.updatedAt)}`;
}

const emptyForm = { alt: "", sortOrder: 0 };

export function HighlightsManagement() {
  const [items, setItems] = useState<HighlightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<HighlightItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);

  async function loadItems() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/home-highlights", { cache: "no-store" });
      const data = (await response.json()) as {
        error?: string;
        homeHighlights?: HighlightItem[];
      };
      if (!response.ok) {
        setError(data.error ?? "Could not load highlights.");
        return;
      }
      setItems(data.homeHighlights ?? []);
    } catch {
      setError("Could not load highlights.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadItems();
  }, []);

  function resetForm() {
    setEditingId(null);
    setEditingItem(null);
    setForm(emptyForm);
    setImageFile(null);
    setFormModalOpen(false);
  }

  function openCreate() {
    setEditingId(null);
    setEditingItem(null);
    setForm(emptyForm);
    setImageFile(null);
    setFormModalOpen(true);
  }

  function startEdit(item: HighlightItem) {
    setEditingId(item.id);
    setEditingItem(item);
    setForm({ alt: item.alt, sortOrder: item.sortOrder });
    setImageFile(null);
    setFormModalOpen(true);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("alt", form.alt);
      formData.append("sortOrder", String(form.sortOrder));
      if (imageFile) formData.append("image", imageFile);

      if (!editingId && !imageFile) {
        setError("Image is required for a new highlight.");
        setSaving(false);
        return;
      }

      const response = await fetch(
        editingId ? `/api/home-highlights/${editingId}` : "/api/home-highlights",
        { method: editingId ? "PATCH" : "POST", body: formData },
      );
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not save highlight.");
        return;
      }
      resetForm();
      await loadItems();
    } catch {
      setError("Could not save highlight.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this highlight slide?")) return;
    try {
      const response = await fetch(`/api/home-highlights/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Could not delete.");
        return;
      }
      await loadItems();
    } catch {
      setError("Could not delete.");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          Each entry is one slide in the home page carousel (posters, figures, or composite
          graphics). Use wide images for best results.
        </p>
        <button type="button" onClick={openCreate} className={adminBtnPrimary}>
          Add highlight image
        </button>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-500">Loading…</p> : null}

      {!loading && items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          No highlight slides yet.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="relative aspect-[16/10] bg-slate-100">
              <HighlightSlideImage
                src={previewSrc(item)}
                alt={item.alt || "Highlight preview"}
                className="absolute inset-0 h-full w-full object-contain"
              />
            </div>
            <div className="space-y-2 p-4">
              <p className="text-sm font-medium text-slate-900">
                {item.alt || <span className="text-slate-400">(no caption)</span>}
              </p>
              <p className="text-xs text-slate-500">
                Order {item.sortOrder} · Updated {formatAdminDate(item.updatedAt)}
              </p>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => startEdit(item)} className={adminBtnSecondary}>
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
            </div>
          </article>
        ))}
      </div>

      <AdminFormModal
        open={formModalOpen}
        title={editingId ? "Edit highlight" : "New highlight"}
        onClose={resetForm}
      >
        <form onSubmit={(e) => void submit(e)} className="space-y-4">
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Caption / alt text (optional)</span>
            <input
              value={form.alt}
              onChange={(e) => setForm((f) => ({ ...f, alt: e.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder="Short description for accessibility"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Sort order</span>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) =>
                setForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))
              }
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <AdminImageField
            label="Slide image"
            hint={
              editingId
                ? "Leave empty to keep the current slide. Save to apply changes."
                : "Required for a new carousel slide."
            }
            variant="banner"
            currentMimeType={editingItem?.imageMimeType}
            currentBase64={editingItem?.imageBase64}
            currentUrl={
              editingItem
                ? `${editingItem.imageUrl}?v=${encodeURIComponent(editingItem.updatedAt)}`
                : ""
            }
            pendingFile={imageFile}
            onFileChange={setImageFile}
            required={!editingId}
          />
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className={adminBtnPrimary}>
              {saving ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={resetForm} className={adminBtnOutline}>
              Cancel
            </button>
          </div>
        </form>
      </AdminFormModal>
    </div>
  );
}
