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

type ResearchArea = {
  id: string;
  title: string;
  description: string;
  imageMimeType: string;
  imageBase64: string;
  createdAt: string;
  updatedAt: string;
};

export function ResearchAreaManagement() {
  const [items, setItems] = useState<ResearchArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);

  async function loadItems() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/research-areas", { cache: "no-store" });
      const data = (await response.json()) as {
        error?: string;
        researchAreas?: ResearchArea[];
      };
      if (!response.ok) {
        setError(data.error ?? "Could not load research areas.");
        return;
      }
      setItems(data.researchAreas ?? []);
    } catch {
      setError("Could not load research areas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadItems();
  }, []);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setImageFile(null);
    setFormModalOpen(false);
  }

  function openCreateModal() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setImageFile(null);
    setError("");
    setFormModalOpen(true);
  }

  function startEdit(item: ResearchArea) {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setImageFile(null);
    setError("");
    setFormModalOpen(true);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const isEdit = Boolean(editingId);
      if (!isEdit && !imageFile) {
        setError("Image is required for new research area.");
        setSaving(false);
        return;
      }

      const response = await fetch(
        isEdit ? `/api/research-areas/${editingId}` : "/api/research-areas",
        {
          method: isEdit ? "PATCH" : "POST",
          body: formData,
        },
      );

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not save research area.");
        return;
      }

      resetForm();
      await loadItems();
    } catch {
      setError("Could not save research area.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    setError("");
    try {
      const response = await fetch(`/api/research-areas/${id}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not delete research area.");
        return;
      }
      await loadItems();
    } catch {
      setError("Could not delete research area.");
    }
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Research areas</h3>
            <p className="mt-1 text-sm text-slate-600">
              Image is stored as binary in MongoDB. Add opens a blank form; Edit keeps the current
              image unless you upload a new file.
            </p>
          </div>
          <button type="button" onClick={openCreateModal} className={adminBtnPrimary}>
            Add research area
          </button>
        </div>

        {error && !formModalOpen ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
        {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}

        {!loading && !items.length ? (
          <p className="text-sm text-slate-500">No research areas added yet.</p>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <Image
                src={`data:${item.imageMimeType};base64,${item.imageBase64}`}
                alt={item.title}
                width={1200}
                height={500}
                unoptimized
                className="h-52 w-full object-cover"
              />
              <div className="space-y-2 p-4">
                <h4 className="text-lg font-semibold text-slate-900">{item.title}</h4>
                <p className="text-sm text-slate-700">{item.description}</p>
                <p className="text-xs text-slate-500">
                  Updated: {new Date(item.updatedAt).toLocaleString()}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
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
              </div>
            </article>
          ))}
        </div>
      </section>

      <AdminFormModal
        open={formModalOpen}
        onClose={resetForm}
        title={editingId ? "Edit research area" : "Add research area"}
        description={
          editingId
            ? "Leave image empty to keep the current one."
            : "Title, description, and an image are required."
        }
        size="lg"
      >
        <form onSubmit={submit} className="grid gap-3">
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Title"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <textarea
            required
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Description"
            rows={4}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="file"
            accept="image/*"
            required={!editingId}
            onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />

          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2 pt-1">
            <button type="submit" disabled={saving} className={adminBtnPrimary}>
              {saving ? "Saving…" : editingId ? "Update research area" : "Create research area"}
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
