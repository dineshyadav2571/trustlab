import Link from "next/link";

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <header className="border-b border-slate-100 pb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Overview
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
          Dashboard
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Each module has its own page. Use the sidebar or the cards below to jump
          in; the main panel scrolls independently on larger screens.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Link
          href="/admin/admins"
          className="group rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm ring-1 ring-transparent transition hover:border-slate-300 hover:shadow-md hover:ring-slate-200/80"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Module
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900 group-hover:text-[var(--btrust-teal)]">
            Admin Management
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Manage admin accounts from a dedicated full-page endpoint.
          </p>
        </Link>

        <Link
          href="/admin/users"
          className="group rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm ring-1 ring-transparent transition hover:border-slate-300 hover:shadow-md hover:ring-slate-200/80"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Module
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900 group-hover:text-[var(--btrust-teal)]">Users</h3>
          <p className="mt-1 text-sm text-slate-600">
            Normal user accounts with onboarding email and password reset flows.
          </p>
        </Link>

        <Link
          href="/admin/content"
          className="group rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm ring-1 ring-transparent transition hover:border-slate-300 hover:shadow-md hover:ring-slate-200/80"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Module
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900 group-hover:text-[var(--btrust-teal)]">Content</h3>
          <p className="mt-1 text-sm text-slate-600">
            Text, image, PDF, or Word — assign access per user.
          </p>
        </Link>

        <Link
          href="/admin/research-areas"
          className="group rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm ring-1 ring-transparent transition hover:border-slate-300 hover:shadow-md hover:ring-slate-200/80"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Module
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900 group-hover:text-[var(--btrust-teal)]">Research Areas</h3>
          <p className="mt-1 text-sm text-slate-600">
            CRUD endpoint and admin UI for image, title, and description.
          </p>
        </Link>

        <Link
          href="/admin/peoples"
          className="group rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm ring-1 ring-transparent transition hover:border-slate-300 hover:shadow-md hover:ring-slate-200/80"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Module
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900 group-hover:text-[var(--btrust-teal)]">Peoples</h3>
          <p className="mt-1 text-sm text-slate-600">
            CRUD for person profiles with two image URLs and research details.
          </p>
        </Link>

        <Link
          href="/admin/publications"
          className="group rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm ring-1 ring-transparent transition hover:border-slate-300 hover:shadow-md hover:ring-slate-200/80"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Module
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900 group-hover:text-[var(--btrust-teal)]">Publications</h3>
          <p className="mt-1 text-sm text-slate-600">
            Category enum, text details, and optional external link.
          </p>
        </Link>

        <Link
          href="/admin/patents"
          className="group rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm ring-1 ring-transparent transition hover:border-slate-300 hover:shadow-md hover:ring-slate-200/80"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Module
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900 group-hover:text-[var(--btrust-teal)]">Patents</h3>
          <p className="mt-1 text-sm text-slate-600">
            Granted or Published category with text.
          </p>
        </Link>

        <Link
          href="/admin/achievements"
          className="group rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm ring-1 ring-transparent transition hover:border-slate-300 hover:shadow-md hover:ring-slate-200/80"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Module
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900 group-hover:text-[var(--btrust-teal)]">Achievements</h3>
          <p className="mt-1 text-sm text-slate-600">
            Achievements, invited talks, or short-term programs—with text.
          </p>
        </Link>

        <Link
          href="/admin/news-highlights"
          className="group rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm ring-1 ring-transparent transition hover:border-slate-300 hover:shadow-md hover:ring-slate-200/80"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Module
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900 group-hover:text-[var(--btrust-teal)]">News &amp; highlights</h3>
          <p className="mt-1 text-sm text-slate-600">
            Image-only gallery entries stored in MongoDB.
          </p>
        </Link>

        <Link
          href="/admin/opportunities"
          className="group rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm ring-1 ring-transparent transition hover:border-slate-300 hover:shadow-md hover:ring-slate-200/80"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Module
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900 group-hover:text-[var(--btrust-teal)]">Opportunities</h3>
          <p className="mt-1 text-sm text-slate-600">Text-only opportunity entries.</p>
        </Link>

        <Link
          href="/admin/collaborations"
          className="group rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm ring-1 ring-transparent transition hover:border-slate-300 hover:shadow-md hover:ring-slate-200/80"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Module
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900 group-hover:text-[var(--btrust-teal)]">Collaborations</h3>
          <p className="mt-1 text-sm text-slate-600">
            Text and image per entry, stored in the database.
          </p>
        </Link>

        <Link
          href="/admin/research-projects"
          className="group rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm ring-1 ring-transparent transition hover:border-slate-300 hover:shadow-md hover:ring-slate-200/80"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Module
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900 group-hover:text-[var(--btrust-teal)]">Research Projects</h3>
          <p className="mt-1 text-sm text-slate-600">
            Image, title, college name, and supporting text.
          </p>
        </Link>

        <Link
          href="/admin/workspace"
          className="group rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm ring-1 ring-transparent transition hover:border-slate-300 hover:shadow-md hover:ring-slate-200/80"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Module
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900 group-hover:text-[var(--btrust-teal)]">Workspace</h3>
          <p className="mt-1 text-sm text-slate-600">
            Extra endpoint reserved for upcoming admin features.
          </p>
        </Link>
      </section>
    </div>
  );
}
