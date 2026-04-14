"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type ContentKind = "text" | "image" | "pdf" | "word";

const KIND_LABEL: Record<ContentKind, string> = {
  text: "Text",
  image: "Image",
  pdf: "PDF",
  word: "Word",
};

type ContentListItem = {
  id: string;
  title: string;
  kind: ContentKind;
  textBody: string;
  fileMimeType: string;
  originalFileName: string;
  createdAt: string;
  updatedAt: string;
};

type ContentDetail = ContentListItem & {
  fileBase64: string;
};

async function fetchWithUserRefresh(input: RequestInfo | URL, init?: RequestInit) {
  let res = await fetch(input, { ...init, credentials: "include" });
  if (res.status === 401) {
    const refreshed = await fetch("/api/auth/user/refresh", {
      method: "POST",
      credentials: "include",
    });
    if (refreshed.ok) {
      res = await fetch(input, { ...init, credentials: "include" });
    }
  }
  return res;
}

function base64ToBlob(base64: string, mime: string): Blob {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime || "application/octet-stream" });
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "download";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function UserContentPage() {
  const router = useRouter();
  const [items, setItems] = useState<ContentListItem[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [detail, setDetail] = useState<ContentDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const revokePreview = useCallback(() => {
    setPreviewUrl((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });
  }, []);

  useEffect(() => {
    return () => {
      revokePreview();
    };
  }, [revokePreview]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetchWithUserRefresh("/api/user/contents");
      if (cancelled) {
        return;
      }
      if (res.status === 401) {
        router.replace("/user/login?next=/user/content");
        return;
      }
      if (!res.ok) {
        setLoadError("Could not load your content.");
        setItems([]);
        return;
      }
      const data = (await res.json()) as { contents?: ContentListItem[] };
      setItems(data.contents ?? []);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const openDetail = useCallback(
    async (id: string) => {
      revokePreview();
      setDetail(null);
      setDetailLoading(true);
      try {
        const res = await fetchWithUserRefresh(`/api/user/contents/${id}`);
        if (res.status === 401) {
          router.replace("/user/login?next=/user/content");
          return;
        }
        if (!res.ok) {
          setLoadError("Could not open this item.");
          return;
        }
        const data = (await res.json()) as { content?: ContentDetail };
        if (data.content) {
          setDetail(data.content);
          const c = data.content;
          if (c.kind === "image" || c.kind === "pdf") {
            if (c.fileBase64) {
              const blob = base64ToBlob(c.fileBase64, c.fileMimeType);
              setPreviewUrl(URL.createObjectURL(blob));
            }
          }
        }
      } finally {
        setDetailLoading(false);
      }
    },
    [router, revokePreview],
  );

  const closeDetail = useCallback(() => {
    revokePreview();
    setDetail(null);
  }, [revokePreview]);

  const downloadCurrent = useCallback(() => {
    if (!detail) {
      return;
    }
    if (detail.kind === "text") {
      const blob = new Blob([detail.textBody], { type: "text/plain;charset=utf-8" });
      triggerDownload(blob, `${detail.title || "content"}.txt`);
      return;
    }
    if (!detail.fileBase64) {
      return;
    }
    const blob = base64ToBlob(detail.fileBase64, detail.fileMimeType);
    const name = detail.originalFileName || `${detail.title || "file"}`;
    triggerDownload(blob, name);
  }, [detail]);

  const logout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/user/logout", { method: "POST", credentials: "include" });
    } finally {
      router.replace("/");
      router.refresh();
      setLoggingOut(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Your content</h1>
          <p className="mt-1 text-sm text-slate-600">
            Files and text your administrator assigned to you. Open an item to view or download.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700"
          >
            Home
          </Link>
          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 disabled:opacity-50"
          >
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </div>

      {items === null ? (
        <p className="mt-10 text-sm text-slate-600">Loading…</p>
      ) : loadError && items.length === 0 ? (
        <p className="mt-10 text-sm text-red-600">{loadError}</p>
      ) : items.length === 0 ? (
        <p className="mt-10 text-sm text-slate-600">No content has been assigned to your account yet.</p>
      ) : (
        <ul className="mt-10 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
          {items.map((row) => (
            <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="font-medium text-slate-900">{row.title}</p>
                <p className="text-xs text-slate-500">{KIND_LABEL[row.kind]}</p>
              </div>
              <button
                type="button"
                onClick={() => openDetail(row.id)}
                className="shrink-0 rounded-md bg-[var(--btrust-teal)] px-3 py-1.5 text-sm font-medium text-white"
              >
                Open
              </button>
            </li>
          ))}
        </ul>
      )}

      {detail || detailLoading ? (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="content-detail-title"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeDetail();
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
            {detailLoading ? (
              <p className="text-sm text-slate-600">Loading…</p>
            ) : detail ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 id="content-detail-title" className="text-lg font-semibold text-slate-900">
                    {detail.title}
                  </h2>
                  <button
                    type="button"
                    onClick={closeDetail}
                    className="rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-700"
                  >
                    Close
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={downloadCurrent}
                    className="rounded-md bg-[var(--btrust-teal)] px-3 py-1.5 text-sm font-medium text-white"
                  >
                    Download
                  </button>
                </div>
                <div className="mt-6">
                  {detail.kind === "text" ? (
                    <pre className="whitespace-pre-wrap rounded-md bg-slate-50 p-4 text-sm text-slate-800">
                      {detail.textBody}
                    </pre>
                  ) : null}
                  {detail.kind === "image" && previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- blob URL from assigned content
                    <img
                      src={previewUrl}
                      alt={detail.title}
                      className="max-h-[60vh] w-auto max-w-full rounded-md border border-slate-200"
                    />
                  ) : null}
                  {detail.kind === "pdf" && previewUrl ? (
                    <iframe
                      title={detail.title}
                      src={previewUrl}
                      className="mt-2 h-[70vh] w-full rounded-md border border-slate-200"
                    />
                  ) : null}
                  {detail.kind === "word" ? (
                    <p className="text-sm text-slate-600">
                      Word documents cannot be previewed in the browser. Use Download to save the file.
                    </p>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </main>
  );
}
