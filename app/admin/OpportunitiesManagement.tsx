"use client";

import { useEffect, useState } from "react";

type Opportunity = {
  id: string;
  text: string;
  updatedAt: string;
};

export function OpportunitiesManagement() {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [text, setText] = useState("");

  async function loadItems() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/opportunities", { cache: "no-store" });
      const data = (await response.json()) as {
        error?: string;
        opportunities?: Opportunity[];
      };
      if (!response.ok) {
        setError(data.error ?? "Could not load opportunities.");
        return;
      }
      setItems(data.opportunities ?? []);
    } catch {
      setError("Could not load opportunities.");
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
  }

  function startEdit(item: Opportunity) {
    setEditingId(item.id);
    setText(item.text);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch(
        editingId ? `/api/opportunities/${editingId}` : "/api/opportunities",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
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
      const response = await fetch(`/api/opportunities/${id}`, {
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
          {editingId ? "Edit opportunity" : "Add opportunity"}
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Text only. On the public site, wrap phrases in <code className="rounded bg-slate-100 px-1">**double asterisks**</code>{" "}
          for bold.
        </p>

        <form onSubmit={submit} className="mt-4 grid gap-3">
          <textarea
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Opportunity text"
            rows={5}
            className="rounded-md border px-3 py-2"
          />
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
        <h3 className="text-lg font-semibold">Opportunities</h3>
        {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
        {!loading && !items.length ? (
          <p className="text-sm text-slate-500">No entries yet.</p>
        ) : null}
        <div className="grid gap-4">
          {items.map((item) => (
            <article key={item.id} className="rounded-xl border p-4">
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
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
