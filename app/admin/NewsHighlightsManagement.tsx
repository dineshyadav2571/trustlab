"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AdminFormModal } from "@/app/components/admin/AdminFormModal";
import {
  adminBtnDangerOutline,
  adminBtnOutline,
  adminBtnPrimary,
  adminBtnSecondary,
} from "@/app/admin/admin-styles";

type SerializedImage = {
  imageMimeType: string;
  imageBase64: string;
};

type NewsHighlightItem = {
  id: string;
  images: SerializedImage[];
  updatedAt: string;
};

export function NewsHighlightsManagement() {
  const [items, setItems] = useState<NewsHighlightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);

  async function loadItems() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/news-highlights", { cache: "no-store" });
      const data = (await response.json()) as {
        error?: string;
        newsHighlights?: NewsHighlightItem[];
      };
      if (!response.ok) {
        setError(data.error ?? "Could not load news & highlights.");
        return;
      }
      setItems(data.newsHighlights ?? []);
    } catch {
      setError("Could not load news & highlights.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadItems();
  }, []);

  function resetForm() {
    setEditingId(null);
    setFiles([]);
    setFormModalOpen(false);
  }

  function openCreateModal() {
    setEditingId(null);
    setFiles([]);
    setError("");
    setFormModalOpen(true);
  }

  function startEdit(item: NewsHighlightItem) {
    setEditingId(item.id);
    setFiles([]);
    setError("");
    setFormModalOpen(true);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingId && files.length === 0) {
      setError("Select at least one image.");
      return;
    }
    if (editingId && files.length === 0) {
      setError("Select one or more images to replace the current set.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append("images", file);
      }

      const response = await fetch(
        editingId ? `/api/news-highlights/${editingId}` : "/api/news-highlights",
        {
          method: editingId ? "PATCH" : "POST",
          body: formData,
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
      const response = await fetch(`/api/news-highlights/${id}`, {
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
            <h3 className="text-lg font-semibold text-slate-900">News &amp; highlights</h3>
            <p className="mt-1 text-sm text-slate-600">
              Images only—stored in the database. You can select multiple files at once. Edit
              replaces all images in that entry.
            </p>
          </div>
          <button type="button" onClick={openCreateModal} className={adminBtnPrimary}>
            Add entry
          </button>
        </div>

        {error && !formModalOpen ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
        {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
        {!loading && !items.length ? (
          <p className="text-sm text-slate-500">No images added yet.</p>
        ) : null}

        <div className="grid gap-6">
          {items.map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {item.images.map((img, index) => (
                  <Image
                    key={`${item.id}-${index}`}
                    src={`data:${img.imageMimeType};base64,${img.imageBase64}`}
                    alt={`News ${index + 1}`}
                    width={400}
                    height={300}
                    unoptimized
                    className="h-32 w-full rounded-md object-cover"
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {item.images.length} image(s) · Updated {new Date(item.updatedAt).toLocaleString()}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => startEdit(item)} className={adminBtnOutline}>
                  Replace images
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
        title={editingId ? "Replace images" : "Add news & highlights"}
        description={
          editingId
            ? "Upload new images to replace all images in this entry."
            : "Select one or more image files."
        }
        size="md"
      >
        <form onSubmit={submit} className="grid gap-3">
          <input
            type="file"
            accept="image/*"
            multiple
            required={!editingId}
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />

          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2 pt-1">
            <button type="submit" disabled={saving} className={adminBtnPrimary}>
              {saving ? "Saving…" : editingId ? "Replace images" : "Create"}
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
