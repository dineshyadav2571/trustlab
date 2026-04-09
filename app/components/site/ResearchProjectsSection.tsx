import Image from "next/image";

export type ResearchProjectPublic = {
  id: string;
  title: string;
  clgName: string;
  bugged: string;
  imageMimeType: string;
  imageBase64: string;
};

function ResearchProjectCards({
  projects,
  showBugged,
  gridClassName,
}: {
  projects: ResearchProjectPublic[];
  showBugged: boolean;
  gridClassName: string;
}) {
  if (projects.length === 0) {
    return (
      <p className="text-center text-slate-500">
        Research projects will appear here once added in the admin panel.
      </p>
    );
  }

  return (
    <div className={gridClassName}>
      {projects.map((project) => (
        <article
          key={project.id}
          className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
        >
          <div className="relative aspect-[16/10] w-full bg-slate-50">
            <Image
              src={`data:${project.imageMimeType};base64,${project.imageBase64}`}
              alt={project.title}
              fill
              unoptimized
              className="h-full w-full object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
          <div className="flex flex-1 flex-col p-5 md:p-6">
            <h3 className="text-lg font-bold text-slate-900 md:text-xl">{project.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{project.clgName}</p>
            {showBugged ? (
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-700 md:text-[15px]">
                {project.bugged}
              </p>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

/** Full-width section + anchor for the home page. */
export function ResearchProjectsSection({
  projects,
}: {
  projects: ResearchProjectPublic[];
}) {
  return (
    <section
      id="research-projects"
      className="scroll-mt-20 border-t border-slate-100 bg-white py-14 md:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="mx-auto mb-12 w-max text-center text-2xl font-semibold text-[var(--btrust-teal)] md:text-3xl">
          <span className="border-b-[3px] border-[var(--btrust-teal)] pb-1">
            Research Projects
          </span>
        </h2>

        <ResearchProjectCards
          projects={projects}
          showBugged
          gridClassName="grid gap-8 md:grid-cols-2 md:gap-10"
        />
      </div>
    </section>
  );
}

/** Standalone grid for `/projects` (no section chrome; tighter card copy). */
export function ResearchProjectsPageGrid({ projects }: { projects: ResearchProjectPublic[] }) {
  return (
    <ResearchProjectCards
      projects={projects}
      showBugged={false}
      gridClassName="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10"
    />
  );
}
