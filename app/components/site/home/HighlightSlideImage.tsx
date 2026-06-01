"use client";

import { useState } from "react";

type HighlightSlideImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
};

/** Native img — reliable for /api/... image routes on localhost and production. */
export function HighlightSlideImage({
  src,
  alt,
  priority = false,
  className = "h-full w-full object-contain p-1",
}: HighlightSlideImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full min-h-[12rem] items-center justify-center p-4 text-center text-sm text-slate-500">
        Could not load image. Try re-uploading this slide in Admin → Highlights.
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      onError={() => setFailed(true)}
    />
  );
}
