import type { ReactNode } from "react";

export type PatentPublic = {
  id: string;
  category: "Granted" | "Published";
  text: string;
};

function stripLeadingIndex(text: string) {
  return text.replace(/^\s*\d+[\.)]\s*/, "").trim();
}

/** Bolds the substring between single quotes, e.g. Indian Patent, 'My Title', Application No.: … */
function formatPatentText(text: string): ReactNode {
  const body = stripLeadingIndex(text);
  const parts = body.split(/('[^']*')/g);
  return parts.map((part, i) => {
    if (part.startsWith("'") && part.endsWith("'") && part.length >= 2) {
      const inner = part.slice(1, -1);
      return (
        <span key={i}>
          &apos;<strong className="font-semibold text-slate-900">{inner}</strong>&apos;
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function SectionRuleTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-8 mt-14 flex items-center gap-4 first:mt-0 md:mb-10">
      <div className="h-px min-w-0 flex-1 bg-slate-300" />
      <h2 className="shrink-0 font-serif text-xl text-slate-800 md:text-2xl">{children}</h2>
      <div className="h-px min-w-0 flex-1 bg-slate-300" />
    </div>
  );
}

function PatentList({ items }: { items: PatentPublic[] }) {
  if (items.length === 0) {
    return (
      <p className="text-center text-slate-500">
        No entries in this category yet. Add them in the admin panel.
      </p>
    );
  }

  return (
    <ol className="list-none space-y-4 p-0">
      {items.map((patent, index) => (
        <li
          key={patent.id}
          className="flex gap-3 rounded-lg border border-cyan-100/90 bg-[#e8f7f9] p-4 md:gap-4 md:p-5"
        >
          <span className="shrink-0 pt-0.5 font-semibold tabular-nums text-slate-600">
            {index + 1}.
          </span>
          <p className="min-w-0 flex-1 text-[15px] leading-relaxed text-slate-800 md:text-base">
            {formatPatentText(patent.text)}
          </p>
        </li>
      ))}
    </ol>
  );
}

export function PatentListSections({
  granted,
  published,
}: {
  granted: PatentPublic[];
  published: PatentPublic[];
}) {
  return (
    <>
      <SectionRuleTitle>Patents Granted</SectionRuleTitle>
      <PatentList items={granted} />

      <SectionRuleTitle>Patents Published</SectionRuleTitle>
      <PatentList items={published} />
    </>
  );
}
