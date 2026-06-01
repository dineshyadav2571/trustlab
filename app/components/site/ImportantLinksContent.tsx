import { ImportantLinkIcon } from "@/app/components/site/ImportantLinkIcon";
import type {
  ImportantLinkCategoryPublic,
  ImportantLinkItemPublic,
  ImportantLinkSectionPublic,
} from "@/lib/important-link-sections";

function LinkRow({ link }: { link: ImportantLinkItemPublic }) {
  return (
    <li className="flex gap-4 border-b border-slate-100 py-4 last:border-b-0">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50"
        aria-hidden
      >
        <ImportantLinkIcon icon={link.icon} />
      </div>
      <div className="min-w-0 flex-1">
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-base font-semibold text-[var(--btrust-teal)] underline hover:opacity-90"
        >
          {link.title}
        </a>
        {link.description ? (
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{link.description}</p>
        ) : null}
      </div>
    </li>
  );
}

function CategoryCard({ category }: { category: ImportantLinkCategoryPublic }) {
  if (!category.links.length) return null;

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {category.title ? (
        <h3 className="border-b border-[var(--btrust-teal)] bg-[var(--btrust-teal)] px-4 py-2.5 text-sm font-semibold text-white md:px-5 md:text-base">
          {category.title}
        </h3>
      ) : null}
      <ul className="px-4 md:px-5">{category.links.map((link) => <LinkRow key={link.id} link={link} />)}</ul>
    </article>
  );
}

function SimpleSectionLinks({ categories }: { categories: ImportantLinkCategoryPublic[] }) {
  const links = categories.flatMap((c) => c.links);
  if (!links.length) {
    return <p className="text-sm text-slate-500">No links in this section yet.</p>;
  }

  return (
    <ul className="rounded-lg border border-slate-200 bg-white px-4 shadow-sm md:px-5">
      {links.map((link) => (
        <LinkRow key={link.id} link={link} />
      ))}
    </ul>
  );
}

function SectionBlock({ section }: { section: ImportantLinkSectionPublic }) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-bold text-slate-900 md:text-2xl">{section.title}</h2>
      {section.intro ? (
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-slate-700 md:text-base">
          {section.intro}
        </p>
      ) : null}

      {section.layout === "simple" ? (
        <SimpleSectionLinks categories={section.categories} />
      ) : (
        <div className="space-y-5">
          {section.categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
          {section.categories.every((c) => c.links.length === 0) ? (
            <p className="text-sm text-slate-500">No categories or links yet.</p>
          ) : null}
        </div>
      )}
    </section>
  );
}

export function ImportantLinksContent({ sections }: { sections: ImportantLinkSectionPublic[] }) {
  if (!sections.length) {
    return (
      <p className="rounded-lg border border-slate-200 bg-white px-5 py-8 text-center text-slate-500 shadow-sm">
        Important links will appear here once added in the admin panel.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      {sections.map((section) => (
        <SectionBlock key={section.id} section={section} />
      ))}
    </div>
  );
}
