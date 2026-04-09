"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type PeopleItem = {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  researchInterests: string;
  profileImageBase64: string;
  profileImageMimeType: string;
  profileUrl1: string;
  profileUrl2: string;
  updatedAt: string;
};

const defaultForm = {
  name: "Aditi Tripathi",
  title: "Ph.D. Scholar",
  department: "DoCSE",
  email: "adititripathi@iiitm.ac.in",
  researchInterests:
    "Energy Trading Game Strategies in Electric Vehicles using Blockchain",
  profileUrl1: "",
  profileUrl2: "",
};

export function PeopleManagement() {
  const [items, setItems] = useState<PeopleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/peoples", { cache: "no-store" });
      const data = (await response.json()) as {
        error?: string;
        peoples?: PeopleItem[];
      };
      if (!response.ok) {
        setError(data.error ?? "Could not load people records.");
        return;
      }
      setItems(data.peoples ?? []);
    } catch {
      setError("Could not load people records.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function onFieldChange(field: keyof typeof defaultForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function resetForm() {
    setEditingId(null);
    setForm(defaultForm);
    setProfileImageFile(null);
  }

  function startEdit(item: PeopleItem) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      title: item.title,
      department: item.department,
      email: item.email,
      researchInterests: item.researchInterests,
      profileUrl1: item.profileUrl1,
      profileUrl2: item.profileUrl2,
    });
    setProfileImageFile(null);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("title", form.title);
      formData.append("department", form.department);
      formData.append("email", form.email);
      formData.append("researchInterests", form.researchInterests);
      formData.append("profileUrl1", form.profileUrl1);
      formData.append("profileUrl2", form.profileUrl2);
      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }
      if (!editingId && !profileImageFile) {
        setError("Profile image is required.");
        return;
      }

      const response = await fetch(
        editingId ? `/api/peoples/${editingId}` : "/api/peoples",
        {
          method: editingId ? "PATCH" : "POST",
          body: formData,
        },
      );
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not save people record.");
        return;
      }

      resetForm();
      await load();
    } catch {
      setError("Could not save people record.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    setError("");
    try {
      const response = await fetch(`/api/peoples/${id}`, { method: "DELETE" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not delete people record.");
        return;
      }
      await load();
    } catch {
      setError("Could not delete people record.");
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border p-5">
        <h3 className="text-lg font-semibold">
          {editingId ? "Edit People" : "Create People"}
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Add person profile with a primary image and two research profile URLs.
        </p>

        <form onSubmit={submit} className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            required
            value={form.name}
            onChange={(e) => onFieldChange("name", e.target.value)}
            placeholder="Name"
            className="rounded-md border px-3 py-2"
          />
          <input
            required
            value={form.title}
            onChange={(e) => onFieldChange("title", e.target.value)}
            placeholder="Title"
            className="rounded-md border px-3 py-2"
          />
          <input
            required
            value={form.department}
            onChange={(e) => onFieldChange("department", e.target.value)}
            placeholder="Department"
            className="rounded-md border px-3 py-2"
          />
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => onFieldChange("email", e.target.value)}
            placeholder="Email"
            className="rounded-md border px-3 py-2"
          />
          <input
            type="file"
            accept="image/*"
            required={!editingId}
            onChange={(e) => setProfileImageFile(e.target.files?.[0] ?? null)}
            className="rounded-md border px-3 py-2"
          />
          <input
            required
            type="url"
            value={form.profileUrl1}
            onChange={(e) => onFieldChange("profileUrl1", e.target.value)}
            placeholder="Profile URL 1 (Google Scholar)"
            className="rounded-md border px-3 py-2"
          />
          <input
            required
            type="url"
            value={form.profileUrl2}
            onChange={(e) => onFieldChange("profileUrl2", e.target.value)}
            placeholder="Profile URL 2 (ResearchGate)"
            className="rounded-md border px-3 py-2"
          />
          <textarea
            required
            value={form.researchInterests}
            onChange={(e) => onFieldChange("researchInterests", e.target.value)}
            placeholder="Research interests"
            rows={4}
            className="rounded-md border px-3 py-2 md:col-span-2"
          />
          {editingId ? (
            <p className="text-xs text-slate-500 md:col-span-2">
              Leave profile image empty to keep current image.
            </p>
          ) : null}

          {error ? <p className="text-sm text-red-600 md:col-span-2">{error}</p> : null}

          <div className="flex gap-2 md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : editingId ? "Update People" : "Create People"}
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
        <h3 className="text-lg font-semibold">People Records</h3>
        {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
        {!loading && !items.length ? (
          <p className="text-sm text-slate-500">No people records added yet.</p>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <article key={item.id} className="rounded-xl border p-4">
              <Image
                src={`data:${item.profileImageMimeType};base64,${item.profileImageBase64}`}
                alt={`${item.name} profile`}
                width={700}
                height={350}
                unoptimized
                className="h-40 w-full rounded-md object-cover"
              />
              <div className="mt-2 grid grid-cols-2 gap-2">
                <a
                  href={item.profileUrl1}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border bg-slate-50 px-3 py-2 text-sm text-slate-800 underline"
                >
                  Profile URL 1
                </a>
                <a
                  href={item.profileUrl2}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border bg-slate-50 px-3 py-2 text-sm text-slate-800 underline"
                >
                  Profile URL 2
                </a>
              </div>
              <h4 className="mt-3 text-lg font-semibold">{item.name}</h4>
              <p className="text-sm text-slate-700">{item.title}</p>
              <p className="text-sm text-slate-700">Department: {item.department}</p>
              <p className="text-sm text-slate-700">Email: {item.email}</p>
              <p className="mt-1 text-sm text-slate-700">
                Research Interests: {item.researchInterests}
              </p>
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
