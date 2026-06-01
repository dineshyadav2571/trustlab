"use client";

import { useEffect, useMemo, useState } from "react";

type AdminImageFieldProps = {
  label: string;
  hint?: string;
  /** Saved image from the database */
  currentMimeType?: string;
  currentBase64?: string;
  /** Optional URL when base64 is not available (e.g. highlights API) */
  currentUrl?: string;
  pendingFile: File | null;
  onFileChange: (file: File | null) => void;
  /** Controls thumbnail shape */
  variant?: "icon" | "banner" | "portrait";
  required?: boolean;
};

const frameClass: Record<NonNullable<AdminImageFieldProps["variant"]>, string> = {
  icon: "h-16 w-16",
  banner: "h-24 w-36",
  portrait: "h-32 w-28",
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AdminImageField({
  label,
  hint,
  currentMimeType = "",
  currentBase64 = "",
  currentUrl = "",
  pendingFile,
  onFileChange,
  variant = "banner",
  required = false,
}: AdminImageFieldProps) {
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!pendingFile) {
      setPendingPreview(null);
      return;
    }
    const url = URL.createObjectURL(pendingFile);
    setPendingPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [pendingFile]);

  const savedSrc = useMemo(() => {
    if (currentBase64 && currentMimeType) {
      return `data:${currentMimeType};base64,${currentBase64}`;
    }
    if (currentUrl) return currentUrl;
    return "";
  }, [currentBase64, currentMimeType, currentUrl]);

  const frame = frameClass[variant];

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex shrink-0 flex-col gap-2">
          <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500">
            Current
          </p>
          {savedSrc ? (
            <div
              className={`overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm ${frame}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={savedSrc}
                alt={`${label} — saved`}
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <div
              className={`flex items-center justify-center rounded-md border border-dashed border-slate-300 bg-white px-2 text-center text-[0.65rem] leading-snug text-slate-400 ${frame}`}
            >
              No image saved
            </div>
          )}
        </div>

        {pendingPreview ? (
          <div className="flex shrink-0 flex-col gap-2">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-teal-700">
              New (unsaved)
            </p>
            <div
              className={`overflow-hidden rounded-md border-2 border-teal-500 bg-white shadow-sm ${frame}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pendingPreview}
                alt={`${label} — pending upload`}
                className="h-full w-full object-contain"
              />
            </div>
            <p className="max-w-[9rem] truncate text-[0.65rem] text-slate-600" title={pendingFile?.name}>
              {pendingFile?.name}
            </p>
            <p className="text-[0.65rem] text-slate-500">
              {pendingFile ? formatBytes(pendingFile.size) : null}
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-3 space-y-1.5">
        <label className="block text-xs font-medium text-slate-700">
          {label}
          {required ? <span className="text-red-600"> *</span> : null}
        </label>
        {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          className="block w-full max-w-md text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-200 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-800"
        />
        {savedSrc && !pendingFile ? (
          <p className="text-xs text-slate-500">Choose a file above to replace the current image.</p>
        ) : null}
      </div>
    </div>
  );
}
