import Image from "next/image";
import Link from "next/link";
import { DownloadResumeButton } from "@/app/components/site/home/DownloadResumeButton";
import { HighlightsCarousel } from "@/app/components/site/home/HighlightsCarousel";
import type { HomePageData } from "@/lib/home-summary";
import type { PublicWebsiteData } from "@/lib/website-data";

function HomeCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`rounded-lg border border-slate-200 bg-white px-5 py-6 shadow-sm md:px-8 md:py-8 ${className}`}
    >
      <h2 className="mb-4 border-b border-slate-200 pb-3 text-xl font-semibold text-[var(--btrust-teal)] md:text-2xl">
        {title}
      </h2>
      {children}
    </article>
  );
}

function ProjectMetaLine({ text }: { text: string }) {
  const trimmed = text.trim();
  const colonIndex = trimmed.indexOf(":");
  if (colonIndex > 0) {
    const label = trimmed.slice(0, colonIndex + 1);
    const value = trimmed.slice(colonIndex + 1).trim();
    return (
      <p className="mt-1 text-sm text-slate-700">
        <span className="font-semibold text-slate-900">{label}</span>
        {value ? ` ${value}` : null}
      </p>
    );
  }
  return <p className="mt-1 text-sm text-slate-700">{trimmed}</p>;
}

function HomeProfileCard({ website }: { website: PublicWebsiteData }) {
  const { lead, contact, home } = website;
  const hasImage =
    Boolean(lead.imageUrl) || (Boolean(lead.imageMimeType) && Boolean(lead.imageBase64));
  const leadImageSrc = lead.imageBase64
    ? `data:${lead.imageMimeType};base64,${lead.imageBase64}`
    : lead.imageUrl;
  const links = [
    ...home.profileLinks,
    ...(lead.scholarUrl
      ? [{ id: "scholar", label: "Google Scholar", url: lead.scholarUrl, sortOrder: 99 }]
      : []),
    ...(lead.researchGateUrl
      ? [{ id: "rg", label: "ResearchGate", url: lead.researchGateUrl, sortOrder: 100 }]
      : []),
    ...(contact.linkedInUrl
      ? [
          {
            id: "li",
            label: contact.linkedInLabel || "LinkedIn",
            url: contact.linkedInUrl,
            sortOrder: 101,
          },
        ]
      : []),
  ];

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white px-5 py-6 shadow-sm md:px-8 md:py-8">
      <div className="grid gap-8 md:grid-cols-2 md:items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{lead.name}</h2>
          <p className="mt-2 text-sm font-medium text-slate-700 md:text-base">{lead.role}</p>
          {lead.location ? <p className="mt-1 text-sm text-slate-600">{lead.location}</p> : null}
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--btrust-teal)] underline hover:opacity-90"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <DownloadResumeButton />
            {lead.cvUrl ? (
              <a
                href={lead.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-md border-2 border-[var(--btrust-teal)] px-4 py-2 text-sm font-medium text-[var(--btrust-teal)] transition hover:bg-teal-50"
              >
                External CV
              </a>
            ) : null}
          </div>
          <div className="mt-5 space-y-1 text-sm text-slate-700">
            {contact.email ? (
              <p>
                <span className="font-medium">Email:</span>{" "}
                <a href={`mailto:${contact.email}`} className="text-[var(--btrust-teal)] underline">
                  {contact.email}
                </a>
              </p>
            ) : null}
            {lead.phone ? (
              <p>
                <span className="font-medium">Phone:</span> {lead.phone}
              </p>
            ) : null}
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          {hasImage && leadImageSrc ? (
            <Image
              src={leadImageSrc}
              alt={lead.name}
              width={600}
              height={720}
              unoptimized
              className="h-auto w-full object-cover object-top"
              priority
            />
          ) : (
            <div className="flex aspect-[4/5] items-center justify-center p-4 text-center text-sm text-slate-400">
              Upload profile photo in Website Data
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function TimelineList({
  items,
}: {
  items: { id: string; title: string; period: string; description: string; thesisUrl?: string }[];
}) {
  if (!items.length) {
    return <p className="text-sm text-slate-500">No entries yet.</p>;
  }

  return (
    <ul className="divide-y divide-dashed divide-slate-300">
      {items.map((item) => (
        <li key={item.id} className="py-4 first:pt-0 last:pb-0">
          <p className="text-sm font-bold text-slate-900 md:text-[15px]">
            {item.title}
            {item.period ? `, ${item.period}` : ""}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">{item.description}</p>
          {item.thesisUrl ? (
            <p className="mt-1">
              <a
                href={item.thesisUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[var(--btrust-teal)] underline"
              >
                Thesis
              </a>
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function HomePageSections({ data }: { data: HomePageData }) {
  const { website, highlightSlides, recentProjects, recentPublications } = data;
  const { home } = website;

  return (
    <div className="space-y-6">
      <HomeProfileCard website={website} />

      <HomeCard title="About">
        <p className="text-sm leading-relaxed text-slate-800 md:text-[15px]">{home.aboutSummary}</p>
      </HomeCard>

      <HomeCard title="Highlights">
        <HighlightsCarousel slides={highlightSlides} />
      </HomeCard>

      <HomeCard title="Research Interests">
        {home.researchInterests.length === 0 ? (
          <p className="text-sm text-slate-500">Add research interests in Website Data.</p>
        ) : (
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-800 md:text-[15px]">
            {home.researchInterests.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}
      </HomeCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <HomeCard title="Employment History">
          <TimelineList
            items={home.employment.map((e) => ({
              id: e.id,
              title: e.title,
              period: e.period,
              description: e.description,
            }))}
          />
        </HomeCard>

        <HomeCard title="Education">
          <TimelineList
            items={home.education.map((e) => ({
              id: e.id,
              title: e.degree,
              period: e.period,
              description: e.details,
              thesisUrl: e.thesisUrl,
            }))}
          />
        </HomeCard>
      </div>

      <HomeCard title="Recent Projects">
        {recentProjects.length === 0 ? (
          <p className="text-sm text-slate-500">Add research projects in the admin panel.</p>
        ) : (
          <ul className="divide-y divide-dashed divide-slate-300">
            {recentProjects.map((project) => {
              const supportLines = project.bugged
                .split(/\r?\n/)
                .map((line) => line.trim())
                .filter(Boolean);

              return (
                <li key={project.id} className="py-4 first:pt-0 last:pb-0">
                  <p className="text-sm font-bold text-slate-900 md:text-[15px]">{project.title}</p>
                  {project.clgName ? (
                    <ProjectMetaLine
                      text={
                        project.clgName.includes(":")
                          ? project.clgName
                          : `Funding Agency: ${project.clgName}`
                      }
                    />
                  ) : null}
                  {supportLines.map((line) => (
                    <ProjectMetaLine key={`${project.id}-${line}`} text={line} />
                  ))}
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-4">
          <Link href="/projects" className="text-sm font-medium text-[var(--btrust-teal)] underline">
            View all projects
          </Link>
        </p>
      </HomeCard>

      <HomeCard title="Recent Publications">
        {recentPublications.length === 0 ? (
          <p className="text-sm text-slate-500">Add publications in the admin panel.</p>
        ) : (
          <ol className="list-none space-y-4">
            {recentPublications.map((pub, index) => (
              <li key={pub.id} className="flex gap-3">
                <span className="shrink-0 font-semibold tabular-nums text-slate-600">
                  {index + 1}.
                </span>
                <p className="min-w-0 flex-1 text-sm leading-relaxed text-slate-800 md:text-[15px]">
                  {pub.text}
                </p>
              </li>
            ))}
          </ol>
        )}
        <p className="mt-4">
          <Link
            href="/publications"
            className="text-sm font-medium text-[var(--btrust-teal)] underline"
          >
            View all publications
          </Link>
        </p>
      </HomeCard>
    </div>
  );
}
