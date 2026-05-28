import type { OtherActivitySectionPublic } from "@/lib/other-activities";

function ActivityListItem({ text, listStyle }: { text: string; listStyle: string }) {
  if (listStyle === "award") {
    const match = text.match(/^(\d{4})\s*[–-]\s*(.+)$/);
    if (match) {
      return (
        <li className="text-sm leading-relaxed text-slate-800 md:text-[15px]">
          <strong className="font-semibold text-slate-900">{match[1]}</strong> – {match[2]}
        </li>
      );
    }
  }

  const labelMatch = text.match(/^([^:]+:)\s*(.+)$/);
  if (labelMatch && labelMatch[1].length <= 24) {
    return (
      <li className="text-sm leading-relaxed text-slate-800 md:text-[15px]">
        <strong className="font-semibold text-slate-900">{labelMatch[1]}</strong> {labelMatch[2]}
      </li>
    );
  }

  return <li className="text-sm leading-relaxed text-slate-800 md:text-[15px]">{text}</li>;
}

function ActivityBlock({ section }: { section: OtherActivitySectionPublic }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white px-5 py-6 shadow-sm md:px-8 md:py-8">
      <h2 className="mb-4 border-b border-slate-200 pb-3 text-xl font-semibold text-[var(--btrust-teal)] md:text-2xl">
        {section.title}
      </h2>
      {section.items.length === 0 ? (
        <p className="text-sm text-slate-500">No entries in this section yet.</p>
      ) : (
        <ul className="list-disc space-y-2 pl-5">
          {section.items.map((item) => (
            <ActivityListItem key={item.id} text={item.text} listStyle={section.listStyle} />
          ))}
        </ul>
      )}
    </article>
  );
}

export function OtherActivitiesPageContent({
  sections,
}: {
  sections: OtherActivitySectionPublic[];
}) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {sections.length === 0 ? (
        <p className="rounded-lg border border-slate-200 bg-white px-5 py-8 text-center text-slate-500 shadow-sm">
          Other activities will appear here once added in the admin panel.
        </p>
      ) : (
        sections.map((section) => <ActivityBlock key={section.id} section={section} />)
      )}
    </div>
  );
}
