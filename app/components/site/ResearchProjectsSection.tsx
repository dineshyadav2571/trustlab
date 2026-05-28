export type ResearchProjectPublic = {
  id: string;
  title: string;
  clgName: string;
  bugged: string;
};

function MetadataLine({ text }: { text: string }) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const colonIndex = trimmed.indexOf(":");
  if (colonIndex > 0) {
    const label = trimmed.slice(0, colonIndex + 1);
    const value = trimmed.slice(colonIndex + 1).trim();
    return (
      <p className="mt-1 text-sm leading-relaxed text-slate-800 md:text-[15px]">
        <span className="font-semibold text-slate-900">{label}</span>
        {value ? ` ${value}` : null}
      </p>
    );
  }

  return (
    <p className="mt-1 text-sm leading-relaxed text-slate-800 md:text-[15px]">{trimmed}</p>
  );
}

function ResearchProjectsList({ projects }: { projects: ResearchProjectPublic[] }) {
  if (projects.length === 0) {
    return (
      <p className="text-center text-slate-500">
        Research projects will appear here once added in the admin panel.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-dashed divide-slate-300">
      {projects.map((project) => {
        const supportLines = project.bugged
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean);

        return (
          <li key={project.id} className="py-5 first:pt-0 last:pb-0 md:py-6">
            <h3 className="text-base font-bold leading-snug text-slate-900 md:text-lg">
              {project.title}
            </h3>
            {project.clgName ? (
              <MetadataLine
                text={
                  project.clgName.includes(":")
                    ? project.clgName
                    : `College name: ${project.clgName}`
                }
              />
            ) : null}
            {supportLines.map((line) => (
              <MetadataLine key={`${project.id}-${line}`} text={line} />
            ))}
          </li>
        );
      })}
    </ul>
  );
}

type ResearchProjectsPanelProps = {
  projects: ResearchProjectPublic[];
  /** When true, renders the bordered panel title inside the box (projects page style). */
  showPanelTitle?: boolean;
};

function ResearchProjectsPanel({
  projects,
  showPanelTitle = false,
}: ResearchProjectsPanelProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-5 py-6 shadow-sm md:px-8 md:py-8">
      {showPanelTitle ? (
        <h2 className="mb-4 border-b border-slate-200 pb-3 text-xl font-semibold text-[var(--btrust-teal)] md:text-2xl">
          Research Projects
        </h2>
      ) : null}
      <ResearchProjectsList projects={projects} />
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
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <h2 className="mx-auto mb-10 w-max text-center text-2xl font-semibold text-[var(--btrust-teal)] md:mb-12 md:text-3xl">
          <span className="border-b-[3px] border-[var(--btrust-teal)] pb-1">
            Research Projects
          </span>
        </h2>

        <ResearchProjectsPanel projects={projects} />
      </div>
    </section>
  );
}

/** Standalone panel for `/projects`. */
export function ResearchProjectsPageContent({
  projects,
}: {
  projects: ResearchProjectPublic[];
}) {
  return (
    <div className="mx-auto max-w-4xl">
      <ResearchProjectsPanel projects={projects} showPanelTitle />
    </div>
  );
}
