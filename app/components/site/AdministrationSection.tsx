import type { AdministrationSectionPublic } from "@/lib/administration";

function AdministrationBlock({ section }: { section: AdministrationSectionPublic }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white px-5 py-6 shadow-sm md:px-8 md:py-8">
      <h2 className="mb-4 border-b border-slate-200 pb-3 text-xl font-semibold text-[var(--btrust-teal)] md:text-2xl">
        {section.title}
      </h2>
      {section.items.length === 0 ? (
        <p className="text-sm text-slate-500">No entries in this section yet.</p>
      ) : (
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-800 md:text-[15px]">
          {section.items.map((item) => (
            <li key={item.id}>{item.text}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

export function AdministrationPageContent({
  sections,
}: {
  sections: AdministrationSectionPublic[];
}) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {sections.length === 0 ? (
        <p className="rounded-lg border border-slate-200 bg-white px-5 py-8 text-center text-slate-500 shadow-sm">
          Administration entries will appear here once added in the admin panel.
        </p>
      ) : (
        sections.map((section) => <AdministrationBlock key={section.id} section={section} />)
      )}
    </div>
  );
}
