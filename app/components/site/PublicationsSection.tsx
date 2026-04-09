"use client";

import { useMemo, useState, type ReactNode } from "react";

/** Mirrors `PublicationCategory` in `lib/models/Publication` (kept local to avoid bundling mongoose on the client). */
export type SitePublicationCategory = "Journals" | "Conference" | "Books";

export type PublicationPublic = {
  id: string;
  category: SitePublicationCategory;
  text: string;
  link: string;
};

const LEAD_AUTHOR = "Amrendra Singh Yadav";

const TABS: { category: SitePublicationCategory; label: string }[] = [
  { category: "Journals", label: "Journals" },
  { category: "Conference", label: "Conferences" },
  { category: "Books", label: "Books" },
];

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatPublicationBody(text: string): ReactNode {
  const re = new RegExp(`(${escapeRegExp(LEAD_AUTHOR)})`, "gi");
  const parts = text.split(re);
  return parts.map((part, i) => {
    if (part.toLowerCase() === LEAD_AUTHOR.toLowerCase()) {
      return <strong key={i} className="font-semibold text-slate-900">{part}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export function PublicationsSection({ publications }: { publications: PublicationPublic[] }) {
  const [active, setActive] = useState<SitePublicationCategory>("Journals");

  const filtered = useMemo(
    () => publications.filter((p) => p.category === active),
    [publications, active],
  );

  return (
    <>
      <div className="mb-10 grid w-full grid-cols-3 overflow-hidden rounded-lg border border-slate-200 shadow-sm md:mb-12">
        {TABS.map((tab) => {
          const isActive = active === tab.category;
          return (
            <button
              key={tab.category}
              type="button"
              onClick={() => setActive(tab.category)}
              className={
                isActive
                  ? "bg-teal-800 py-3 text-center text-sm font-semibold text-white md:text-base"
                  : "bg-white py-3 text-center text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 md:text-base"
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-slate-500">
          No publications in this category yet. Add entries in the admin panel.
        </p>
      ) : (
        <ol className="list-none space-y-4 p-0">
          {filtered.map((pub, index) => (
            <li
              key={pub.id}
              className="flex gap-3 rounded-lg border border-teal-100/90 bg-[#f0f8fa] p-4 md:gap-4 md:p-5"
            >
              <span className="shrink-0 pt-0.5 font-semibold tabular-nums text-slate-600">
                {index + 1}.
              </span>
              <div className="min-w-0 flex-1 text-[15px] leading-relaxed text-slate-800 md:text-base">
                <p className="text-justify">{formatPublicationBody(pub.text)}</p>
                {pub.link ? (
                  <p className="mt-3 break-all">
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--btrust-teal)] underline hover:opacity-90"
                    >
                      {pub.link}
                    </a>
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
