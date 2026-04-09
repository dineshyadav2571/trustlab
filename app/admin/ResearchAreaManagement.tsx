"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

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

  const editingItem = useMemo(
    () => items.find((item) => item.id === editingId) ?? null,
    [items, editingId],
  );

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setImageFile(null);
  }

  function startEdit(item: ResearchArea) {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setImageFile(null);
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
      <section className="rounded-xl border p-5">
        <h3 className="text-lg font-semibold">
          {editingId ? "Edit Research Area" : "Create Research Area"}
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Image is stored as binary blob in MongoDB.
        </p>

        <form onSubmit={submit} className="mt-4 grid gap-3">
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Title"
            className="rounded-md border px-3 py-2"
          />
          <textarea
            required
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Description"
            rows={4}
            className="rounded-md border px-3 py-2"
          />
          <input
            type="file"
            accept="image/*"
            required={!editingId}
            onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
            className="rounded-md border px-3 py-2"
          />
          {editingId ? (
            <p className="text-xs text-slate-500">
              Leave image empty to keep current one.
            </p>
          ) : null}

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Research Area"
                  : "Create Research Area"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border px-4 py-2"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Research Areas</h3>
        {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}

        {!loading && !items.length ? (
          <p className="text-sm text-slate-500">No research areas added yet.</p>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-xl border">
              <Image
                src={`data:${item.imageMimeType};base64,${item.imageBase64}`}
                alt={item.title}
                width={1200}
                height={500}
                unoptimized
                className="h-52 w-full object-cover"
              />
              <div className="space-y-2 p-4">
                <h4 className="text-lg font-semibold">{item.title}</h4>
                <p className="text-sm text-slate-700">{item.description}</p>
                <p className="text-xs text-slate-500">
                  Updated: {new Date(item.updatedAt).toLocaleString()}
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="rounded-md border px-3 py-1.5 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(item.id)}
                    className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {editingItem ? (
        <p className="text-xs text-slate-500">
          Editing: <span className="font-medium">{editingItem.title}</span>
        </p>
      ) : null}
    </div>
  );
}
