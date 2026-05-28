"use client";

import { useState } from "react";

type DownloadResumeButtonProps = {
  label?: string;
  className?: string;
};

export function DownloadResumeButton({
  label = "Download Resume (PDF)",
  className = "inline-block rounded-md border-2 border-[var(--btrust-teal)] bg-[var(--btrust-teal)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60",
}: DownloadResumeButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const response = await fetch("/api/resume");
      if (!response.ok) {
        const json = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(json?.error ?? "Download failed");
      }
      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition");
      const match = disposition?.match(/filename="([^"]+)"/);
      const filename = match?.[1] ?? "Resume.pdf";

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      window.alert("Could not generate resume PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button type="button" onClick={() => void handleDownload()} disabled={loading} className={className}>
      {loading ? "Generating PDF…" : label}
    </button>
  );
}
