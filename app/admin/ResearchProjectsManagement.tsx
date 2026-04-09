"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type ResearchProjectItem = {
  id: string;
  title: string;
  clgName: string;
  bugged: string;
  imageMimeType: string;
  imageBase64: string;
  updatedAt: string;
};

const emptyForm = {
  title: "",
  clgName: "",
  bugged: "",
};

export function ResearchProjectsManagement() {
  const [items, setItems] = useState<ResearchProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadItems() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/research-projects", { cache: "no-store" });
      const data = (await response.json()) as {
        error?: string;
        researchProjects?: ResearchProjectItem[];
      };
      if (!response.ok) {
        setError(data.error ?? "Could not load research projects.");
        return;
      }
      setItems(data.researchProjects ?? []);
    } catch {
      setError("Could not load research projects.");
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
    setImageFile(null);
  }

  function startEdit(item: ResearchProjectItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      clgName: item.clgName,
      bugged: item.bugged,
    });
    setImageFile(null);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("clgName", form.clgName);
      formData.append("bugged", form.bugged);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      if (!editingId && !imageFile) {
        setError("Image is required for a new project.");
        return;
      }

      const response = await fetch(
        editingId
          ? `/api/research-projects/${editingId}`
          : "/api/research-projects",
        {
          method: editingId ? "PATCH" : "POST",
          body: formData,
        },
      );
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not save research project.");
        return;
      }
      resetForm();
      await loadItems();
    } catch {
      setError("Could not save research project.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    setError("");
    try {
      const response = await fetch(`/api/research-projects/${id}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not delete research project.");
        return;
      }
      await loadItems();
    } catch {
      setError("Could not delete research project.");
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border p-5">
        <h3 className="text-lg font-semibold">
          {editingId ? "Edit Research Project" : "Create Research Project"}
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Image stored in DB alongside title, college name, and bugged.
        </p>

        <form onSubmit={submit} className="mt-4 grid gap-3">
          <input
            required
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="Title"
            className="rounded-md border px-3 py-2"
          />
          <input
            required
            value={form.clgName}
            onChange={(e) => setForm((p) => ({ ...p, clgName: e.target.value }))}
            placeholder="College name"
            className="rounded-md border px-3 py-2"
          />
          <input
            required
            value={form.bugged}
            onChange={(e) => setForm((p) => ({ ...p, bugged: e.target.value }))}
            placeholder="Bugged"
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
              Leave image empty to keep current image.
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
                  ? "Update Project"
                  : "Create Project"}
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
        <h3 className="text-lg font-semibold">Research Projects</h3>
        {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
        {!loading && !items.length ? (
          <p className="text-sm text-slate-500">No projects yet.</p>
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
                className="h-44 w-full object-cover"
              />
              <div className="space-y-2 p-4">
                <h4 className="text-lg font-semibold">{item.title}</h4>
                <p className="text-sm text-slate-700">College: {item.clgName}</p>
                <p className="text-sm text-slate-700">Bugged: {item.bugged}</p>
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
    </div>
  );
}
