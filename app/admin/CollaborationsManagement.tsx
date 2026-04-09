"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type CollaborationItem = {
  id: string;
  text: string;
  imageMimeType: string;
  imageBase64: string;
  updatedAt: string;
};

export function CollaborationsManagement() {
  const [items, setItems] = useState<CollaborationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadItems() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/collaborations", { cache: "no-store" });
      const data = (await response.json()) as {
        error?: string;
        collaborations?: CollaborationItem[];
      };
      if (!response.ok) {
        setError(data.error ?? "Could not load collaborations.");
        return;
      }
      setItems(data.collaborations ?? []);
    } catch {
      setError("Could not load collaborations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadItems();
  }, []);

  function resetForm() {
    setEditingId(null);
    setText("");
    setImageFile(null);
  }

  function startEdit(item: CollaborationItem) {
    setEditingId(item.id);
    setText(item.text);
    setImageFile(null);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingId && !imageFile) {
      setError("Image is required for a new collaboration.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("text", text);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch(
        editingId ? `/api/collaborations/${editingId}` : "/api/collaborations",
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
      const response = await fetch(`/api/collaborations/${id}`, {
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
      <section className="rounded-xl border p-5">
        <h3 className="text-lg font-semibold">
          {editingId ? "Edit collaboration" : "Add collaboration"}
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Text plus one image stored in the database.
        </p>

        <form onSubmit={submit} className="mt-4 grid gap-3">
          <textarea
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Collaboration text"
            rows={4}
            className="rounded-md border px-3 py-2"
          />
          <input
            type="file"
            accept="image/*"
            required={!editingId}
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="rounded-md border px-3 py-2"
          />
          {editingId ? (
            <p className="text-xs text-slate-500">
              Leave image empty to keep the current image.
            </p>
          ) : null}

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : editingId ? "Update" : "Create"}
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
        <h3 className="text-lg font-semibold">Collaborations</h3>
        {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
        {!loading && !items.length ? (
          <p className="text-sm text-slate-500">No entries yet.</p>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-xl border">
              <Image
                src={`data:${item.imageMimeType};base64,${item.imageBase64}`}
                alt=""
                width={800}
                height={400}
                unoptimized
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-800">{item.text}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Updated: {new Date(item.updatedAt).toLocaleString()}
                </p>
                <div className="mt-3 flex gap-2">
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
    </div>
  );
}
