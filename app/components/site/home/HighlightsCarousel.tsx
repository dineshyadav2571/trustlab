"use client";

import { useCallback, useEffect, useState } from "react";
import { HighlightSlideImage } from "@/app/components/site/home/HighlightSlideImage";
import type { HomeHighlightPublic } from "@/lib/home-highlights";

type HighlightsCarouselProps = {
  slides: HomeHighlightPublic[];
};

export function HighlightsCarousel({ slides }: HighlightsCarouselProps) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const goTo = useCallback(
    (next: number) => {
      if (!count) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (index >= count && count > 0) setIndex(0);
  }, [count, index]);

  useEffect(() => {
    if (count <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [count]);

  if (!count) {
    return (
      <p className="text-sm text-slate-500">
        Upload highlight images in Admin → Highlights to show a carousel here.
      </p>
    );
  }

  const slide = slides[index];

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
        <div className="relative aspect-[16/10] w-full md:aspect-[16/9]">
          <HighlightSlideImage
            key={slide.id}
            src={slide.imageUrl}
            alt={slide.alt || `Highlight ${index + 1}`}
            priority={index === 0}
          />
        </div>
      </div>

      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/80 bg-white/95 text-slate-700 shadow-md transition hover:bg-white md:left-3 md:h-11 md:w-11"
            aria-label="Previous highlight"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path
                fillRule="evenodd"
                d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/80 bg-white/95 text-slate-700 shadow-md transition hover:bg-white md:right-3 md:h-11 md:w-11"
            aria-label="Next highlight"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.25 4.5a.75.75 0 0 1 0 1.08l-4.25 4.25a.75.75 0 0 1-1.06-.02Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div
            className="mt-4 flex flex-wrap items-center justify-center gap-2"
            role="tablist"
            aria-label="Highlight slides"
          >
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to highlight ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  i === index ? "bg-[var(--btrust-teal)]" : "bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
