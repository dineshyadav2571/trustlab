"use client";

import { useEffect, useState } from "react";

type PublicationCategory = "Journals" | "Conference" | "Books";
type Publication = {
  id: string;
  category: PublicationCategory;
  text: string;
  link: string;
  updatedAt: string;
};

const categories: PublicationCategory[] = ["Journals", "Conference", "Books"];

const defaultForm = {
  category: "Journals" as PublicationCategory,
  text: "",
  link: "",
};

export function PublicationsManagement() {
  const [items, setItems] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);

  async function loadItems() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/publications", { cache: "no-store" });
      const data = (await response.json()) as {
        error?: string;
        publications?: Publication[];
      };
      if (!response.ok) {
        setError(data.error ?? "Could not load publications.");
        return;
      }
      setItems(data.publications ?? []);
    } catch {
      setError("Could not load publications.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadItems();
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm(defaultForm);
  }

  function startEdit(item: Publication) {
    setEditingId(item.id);
    setForm({
      category: item.category,
      text: item.text,
      link: item.link ?? "",
    });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch(
        editingId ? `/api/publications/${editingId}` : "/api/publications",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not save publication.");
        return;
      }
      resetForm();
      await loadItems();
    } catch {
      setError("Could not save publication.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    setError("");
    try {
      const response = await fetch(`/api/publications/${id}`, { method: "DELETE" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not delete publication.");
        return;
      }
      await loadItems();
    } catch {
      setError("Could not delete publication.");
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border p-5">
        <h3 className="text-lg font-semibold">
          {editingId ? "Edit Publication" : "Create Publication"}
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Category + text are required. Link is optional.
        </p>

        <form onSubmit={submit} className="mt-4 grid gap-3">
          <select
            value={form.category}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                category: e.target.value as PublicationCategory,
              }))
            }
            className="rounded-md border px-3 py-2"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <textarea
            required
            value={form.text}
            onChange={(e) => setForm((prev) => ({ ...prev, text: e.target.value }))}
            placeholder="Publication text"
            rows={4}
            className="rounded-md border px-3 py-2"
          />
          <input
            type="url"
            value={form.link}
            onChange={(e) => setForm((prev) => ({ ...prev, link: e.target.value }))}
            placeholder="Optional link"
            className="rounded-md border px-3 py-2"
          />

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
                  ? "Update Publication"
                  : "Create Publication"}
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
        <h3 className="text-lg font-semibold">Publications</h3>
        {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
        {!loading && !items.length ? (
          <p className="text-sm text-slate-500">No publications added yet.</p>
        ) : null}

        <div className="grid gap-4">
          {items.map((item) => (
            <article key={item.id} className="rounded-xl border p-4">
              <p className="text-xs uppercase text-slate-500">{item.category}</p>
              <p className="mt-1 text-sm text-slate-800">{item.text}</p>
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-sm text-blue-700 underline"
                >
                  Open link
                </a>
              ) : null}
              <p className="mt-1 text-xs text-slate-500">
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
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
