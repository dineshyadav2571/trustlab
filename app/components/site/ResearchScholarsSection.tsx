import Image from "next/image";

export type ResearchScholarPublic = {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  researchInterests: string;
  profileImageMimeType: string;
  profileImageBase64: string;
  profileUrl1: string;
  profileUrl2: string;
};

function ScholarProfileLinks({ url1, url2 }: { url1: string; url2: string }) {
  return (
    <div className="flex gap-3 border-t border-slate-200 px-4 py-3">
      <a
        href={url1}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--btrust-teal)] text-sm font-bold text-[var(--btrust-teal)] transition-colors hover:bg-teal-50"
        aria-label="Research profile (Google Scholar)"
      >
        G
      </a>
      <a
        href={url2}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--btrust-teal)] text-[10px] font-bold leading-tight text-[var(--btrust-teal)] transition-colors hover:bg-teal-50"
        aria-label="Research profile (ResearchGate)"
      >
        RG
      </a>
    </div>
  );
}

function ScholarCard({ scholar }: { scholar: ResearchScholarPublic }) {
  const src = `data:${scholar.profileImageMimeType};base64,${scholar.profileImageBase64}`;

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-[4/5] w-full bg-slate-100">
        <Image
          src={src}
          alt={scholar.name}
          fill
          unoptimized
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="flex flex-1 flex-col px-4 pb-0 pt-4">
        <h3 className="text-lg font-bold text-slate-900">{scholar.name}</h3>
        <p className="mt-1 text-sm text-slate-600">{scholar.title}</p>
        <dl className="mt-4 space-y-2 text-sm text-slate-700">
          <div>
            <dt className="inline font-semibold text-slate-900">Department: </dt>
            <dd className="inline">{scholar.department}</dd>
          </div>
          <div>
            <dt className="inline font-semibold text-slate-900">Email: </dt>
            <dd className="inline">
              <a href={`mailto:${scholar.email}`} className="text-[var(--btrust-teal)] underline">
                {scholar.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="mb-0.5 font-semibold text-slate-900">Research Interests: </dt>
            <dd>{scholar.researchInterests}</dd>
          </div>
        </dl>
      </div>
      <ScholarProfileLinks url1={scholar.profileUrl1} url2={scholar.profileUrl2} />
    </article>
  );
}

export function ResearchScholarsSection({ scholars }: { scholars: ResearchScholarPublic[] }) {
  return (
    <section aria-labelledby="research-scholars-heading">
      <div className="mb-10 flex items-center gap-4 md:mb-12">
        <div className="h-px min-w-0 flex-1 bg-slate-300" />
        <h2
          id="research-scholars-heading"
          className="shrink-0 font-serif text-xl text-slate-800 md:text-2xl"
        >
          Research Scholars
        </h2>
        <div className="h-px min-w-0 flex-1 bg-slate-300" />
      </div>

      {scholars.length === 0 ? (
        <p className="text-center text-slate-500">
          Research scholar profiles will appear here once added in the admin panel.
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {scholars.map((s) => (
            <ScholarCard key={s.id} scholar={s} />
          ))}
        </div>
      )}
    </section>
  );
}
