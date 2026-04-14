"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type ContentKind = "text" | "image" | "pdf" | "word";

type UserOption = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
};

type ContentItem = {
  id: string;
  title: string;
  kind: ContentKind;
  textBody: string;
  fileMimeType: string;
  originalFileName: string;
  fileBase64: string;
  allowedUserIds: string[];
  allowedUsers: { id: string; name: string; email: string }[];
  updatedAt: string;
};

const KINDS: { value: ContentKind; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "image", label: "Image" },
  { value: "pdf", label: "PDF" },
  { value: "word", label: "Word (.doc / .docx)" },
];

function fileAccept(kind: ContentKind): string {
  switch (kind) {
    case "image":
      return "image/*";
    case "pdf":
      return "application/pdf";
    case "word":
      return ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    default:
      return "";
  }
}

export function ContentManagement() {
  const [users, setUsers] = useState<UserOption[]>([]);
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<ContentKind>("text");
  const [textBody, setTextBody] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadAll() {
    setLoading(true);
    setError("");
    try {
      const [uRes, cRes] = await Promise.all([
        fetch("/api/users", { cache: "no-store" }),
        fetch("/api/contents", { cache: "no-store" }),
      ]);
      const uData = (await uRes.json()) as { users?: UserOption[]; error?: string };
      const cData = (await cRes.json()) as { contents?: ContentItem[]; error?: string };
      if (!uRes.ok) {
        setError(uData.error ?? "Could not load users.");
        return;
      }
      if (!cRes.ok) {
        setError(cData.error ?? "Could not load content.");
        return;
      }
      setUsers(uData.users ?? []);
      setContents(cData.contents ?? []);
    } catch {
      setError("Could not load data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAll();
  }, []);

  function toggleUser(id: string) {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setKind("text");
    setTextBody("");
    setFile(null);
    setSelectedUserIds(new Set());
  }

  function startEdit(item: ContentItem) {
    setEditingId(item.id);
    setTitle(item.title);
    setKind(item.kind);
    setTextBody(item.textBody ?? "");
    setFile(null);
    setSelectedUserIds(new Set(item.allowedUserIds));
  }

  async function submitCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selectedUserIds.size < 1) {
      setError("Select at least one user with access.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("kind", kind);
      for (const id of selectedUserIds) {
        formData.append("userIds", id);
      }
      if (kind === "text") {
        formData.append("textBody", textBody);
      } else {
        if (!file) {
          setError("Choose a file for this content type.");
          setSaving(false);
          return;
        }
        formData.append("file", file);
      }

      const response = await fetch("/api/contents", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not publish content.");
        return;
      }
      resetForm();
      await loadAll();
    } catch {
      setError("Could not publish content.");
    } finally {
      setSaving(false);
    }
  }

  async function submitEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingId) return;
    if (selectedUserIds.size < 1) {
      setError("Select at least one user with access.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("title", title);
      for (const id of selectedUserIds) {
        formData.append("userIds", id);
      }
      if (kind === "text") {
        formData.append("textBody", textBody);
      } else if (file) {
        formData.append("file", file);
      }

      const response = await fetch(`/api/contents/${editingId}`, {
        method: "PATCH",
        body: formData,
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not update content.");
        return;
      }
      resetForm();
      await loadAll();
    } catch {
      setError("Could not update content.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this published content?")) return;
    setError("");
    try {
      const response = await fetch(`/api/contents/${id}`, { method: "DELETE" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not delete.");
        return;
      }
      if (editingId === id) resetForm();
      await loadAll();
    } catch {
      setError("Could not delete.");
    }
  }

  const activeUsers = users.filter((u) => u.isActive);

  return (
    <div className="space-y-8">
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          {editingId ? "Edit content" : "Publish content"}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Choose type (text, image, PDF, or Word), then tick which users may access it.
        </p>

        <form
          onSubmit={editingId ? submitEdit : submitCreate}
          className="mt-4 grid gap-4"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Title</span>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border px-3 py-2"
                placeholder="Title"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Type</span>
              <select
                value={kind}
                disabled={!!editingId}
                onChange={(e) => {
                  setKind(e.target.value as ContentKind);
                  setFile(null);
                }}
                className="w-full rounded-md border px-3 py-2 disabled:bg-slate-100"
              >
                {KINDS.map((k) => (
                  <option key={k.value} value={k.value}>
                    {k.label}
                  </option>
                ))}
              </select>
              {editingId ? (
                <p className="mt-1 text-xs text-slate-500">Type cannot be changed after publish.</p>
              ) : null}
            </label>
          </div>

          {kind === "text" ? (
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Text</span>
              <textarea
                required
                value={textBody}
                onChange={(e) => setTextBody(e.target.value)}
                rows={6}
                className="w-full rounded-md border px-3 py-2 font-mono text-sm"
                placeholder="Plain text or notes…"
              />
            </label>
          ) : (
            <label className="block">
              <span className="mb-1 block text-sm font-medium">
                File {editingId ? "(optional — leave empty to keep current)" : ""}
              </span>
              <input
                type="file"
                required={!editingId}
                accept={fileAccept(kind)}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
            </label>
          )}

          <fieldset className="rounded-lg border border-slate-200 p-4">
            <legend className="px-1 text-sm font-medium text-slate-800">
              Users with access (required)
            </legend>
            {activeUsers.length === 0 ? (
              <p className="text-sm text-slate-500">No active users — create users first.</p>
            ) : (
              <ul className="mt-2 grid max-h-48 gap-2 overflow-y-auto sm:grid-cols-2">
                {activeUsers.map((u) => (
                  <li key={u.id}>
                    <label className="flex cursor-pointer items-start gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedUserIds.has(u.id)}
                        onChange={() => toggleUser(u.id)}
                        className="mt-1"
                      />
                      <span>
                        <span className="font-medium text-slate-900">{u.name}</span>
                        <span className="block text-xs text-slate-600">{u.email}</span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </fieldset>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={saving || activeUsers.length === 0}
              className="rounded-md bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
            >
              {saving ? "Saving…" : editingId ? "Update" : "Publish"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border px-4 py-2"
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Published content</h2>
        {loading ? (
          <p className="mt-2 text-sm text-slate-500">Loading…</p>
        ) : contents.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">Nothing published yet.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {contents.map((c) => (
              <li
                key={c.id}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900">{c.title}</p>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      {c.kind} · {c.allowedUsers.length} user(s)
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      {c.allowedUsers.map((u) => u.name).join(", ") || "—"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(c)}
                      className="rounded-md border px-3 py-1.5 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void remove(c.id)}
                      className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {c.kind === "text" ? (
                  <pre className="mt-3 max-h-32 overflow-auto rounded bg-slate-50 p-2 text-xs text-slate-800">
                    {c.textBody}
                  </pre>
                ) : c.kind === "image" && c.fileBase64 ? (
                  <div className="relative mt-3 h-40 w-full max-w-md">
                    <Image
                      src={`data:${c.fileMimeType};base64,${c.fileBase64}`}
                      alt=""
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 28rem"
                      className="rounded object-contain"
                    />
                  </div>
                ) : c.fileBase64 ? (
                  <p className="mt-2 text-sm text-slate-600">
                    File: {c.originalFileName || "attachment"} ({c.fileMimeType}) —{" "}
                    <a
                      href={`data:${c.fileMimeType};base64,${c.fileBase64}`}
                      download={c.originalFileName || "file"}
                      className="font-medium text-slate-900 underline"
                    >
                      Download
                    </a>
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
