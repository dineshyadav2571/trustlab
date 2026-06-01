import Link from "next/link";

const siteModules = [
  {
    href: "/admin/website-data",
    title: "Website Data",
    description:
      "Branding, home summary, profile links (Important Links page), lead profile, and contact.",
  },
  {
    href: "/admin/highlights",
    title: "Highlights",
    description: "Image carousel slides on the home page (posters, figures, graphics).",
  },
  {
    href: "/admin/other-activities",
    title: "Other Activities",
    description: "Lectures, programmes, awards, memberships, and skills.",
  },
  {
    href: "/admin/publications",
    title: "Publications",
    description: "Publications listed on the site, grouped by category.",
  },
  {
    href: "/admin/research-projects",
    title: "Projects",
    description: "Research projects shown on the public Projects page.",
  },
  {
    href: "/admin/teaching",
    title: "Teaching",
    description: "Courses taught on the public Teaching page.",
  },
  {
    href: "/admin/students",
    title: "Students",
    description: "Supervised students by category.",
  },
  {
    href: "/admin/administration",
    title: "Administration",
    description: "Administrative roles and responsibilities.",
  },
  {
    href: "/admin/important-links",
    title: "Important Links",
    description:
      "Sections, categories, and resource links shown on the public Important Links page.",
  },
];

const systemModules = [
  {
    href: "/admin/admins",
    title: "Admin Management",
    description: "Manage admin accounts.",
  },
  {
    href: "/admin/users",
    title: "Users",
    description: "User accounts, onboarding, and password reset.",
  },
  {
    href: "/admin/content",
    title: "Content",
    description: "Protected files assigned per user.",
  },
];

function ModuleCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm ring-1 ring-transparent transition hover:border-slate-300 hover:shadow-md hover:ring-slate-200/80"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Module</p>
      <h3 className="mt-1 text-lg font-semibold text-slate-900 group-hover:text-[var(--btrust-teal)]">
        {title}
      </h3>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
    </Link>
  );
}

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8">
      <header className="border-b border-slate-100 pb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Overview</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
          Dashboard
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Manage all public site sections from the modules below, including Important Links.
        </p>
      </header>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">Site content</h3>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {siteModules.map((module) => (
            <ModuleCard key={module.href} {...module} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">System</h3>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {systemModules.map((module) => (
            <ModuleCard key={module.href} {...module} />
          ))}
        </div>
      </section>
    </div>
  );
}
