"use client";

import { useMemo, useState, type ReactNode } from "react";

/** Mirrors achievement categories in `lib/models/Achievement` (no mongoose on client). */
export type SiteAchievementCategory =
  | "Achievements"
  | "Invited Talks"
  | "Short term program conducted";

export type AchievementPublic = {
  id: string;
  category: SiteAchievementCategory;
  text: string;
};

const LEAD_AUTHOR = "Dr. Amrendra Singh Yadav";

const TABS: { category: SiteAchievementCategory; label: string }[] = [
  { category: "Achievements", label: "Achievements" },
  { category: "Invited Talks", label: "Invited Talks" },
  {
    category: "Short term program conducted",
    label: "Short-Term Programs Conducted",
  },
];

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatAchievementText(text: string): ReactNode {
  const cleaned = text
    .replace(/^\s*\[\d+\]\s*/, "")
    .replace(/^\s*\d+[\.)]\s*/, "")
    .trim();
  const re = new RegExp(`(${escapeRegExp(LEAD_AUTHOR)})`, "gi");
  const parts = cleaned.split(re);
  return parts.map((part, i) => {
    if (part.toLowerCase() === LEAD_AUTHOR.toLowerCase()) {
      return (
        <strong key={i} className="font-semibold text-slate-900">
          {part}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function AchievementsSection({ achievements }: { achievements: AchievementPublic[] }) {
  const [active, setActive] = useState<SiteAchievementCategory>("Achievements");

  const filtered = useMemo(
    () => achievements.filter((a) => a.category === active),
    [achievements, active],
  );

  return (
    <>
      <div className="mb-10 grid w-full grid-cols-1 overflow-hidden rounded-lg border border-slate-200 shadow-sm sm:grid-cols-3 md:mb-12">
        {TABS.map((tab) => {
          const isActive = active === tab.category;
          return (
            <button
              key={tab.category}
              type="button"
              onClick={() => setActive(tab.category)}
              className={
                isActive
                  ? "bg-teal-800 px-2 py-3 text-center text-sm font-semibold leading-snug text-white md:px-3 md:text-[15px]"
                  : "bg-white px-2 py-3 text-center text-sm font-semibold leading-snug text-[var(--btrust-teal)] transition-colors hover:bg-slate-50 md:px-3 md:text-[15px]"
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-slate-500">
          No items in this category yet. Add them in the admin panel.
        </p>
      ) : (
        <ul className="list-none overflow-hidden rounded-lg border border-slate-200 p-0">
          {filtered.map((item, index) => (
            <li
              key={item.id}
              className={`flex gap-3 border-b border-slate-200 px-4 py-4 last:border-b-0 md:gap-4 md:px-5 md:py-5 ${
                index % 2 === 0 ? "bg-white" : "bg-slate-50"
              }`}
            >
              <span className="shrink-0 pt-0.5 font-semibold tabular-nums text-[var(--btrust-teal)]">
                [{index + 1}]
              </span>
              <p className="min-w-0 flex-1 text-[15px] leading-relaxed text-slate-800 md:text-base">
                {formatAchievementText(item.text)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
