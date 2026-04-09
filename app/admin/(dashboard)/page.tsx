import Link from "next/link";

export default function AdminOverviewPage() {
  return (
    <div className="space-y-4">
      <header>
        <p className="text-sm text-slate-500">Overview</p>
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-600">
          Each module is now on its own endpoint for clean navigation and full
          workspace usage.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <Link
          href="/admin/admins"
          className="rounded-xl border p-5 transition hover:bg-slate-50"
        >
          <p className="text-sm text-slate-500">Module</p>
          <h3 className="text-lg font-semibold">Admin Management</h3>
          <p className="mt-1 text-sm text-slate-600">
            Manage admin accounts from a dedicated full-page endpoint.
          </p>
        </Link>

        <Link
          href="/admin/research-areas"
          className="rounded-xl border p-5 transition hover:bg-slate-50"
        >
          <p className="text-sm text-slate-500">Module</p>
          <h3 className="text-lg font-semibold">Research Areas</h3>
          <p className="mt-1 text-sm text-slate-600">
            CRUD endpoint and admin UI for image, title, and description.
          </p>
        </Link>

        <Link
          href="/admin/peoples"
          className="rounded-xl border p-5 transition hover:bg-slate-50"
        >
          <p className="text-sm text-slate-500">Module</p>
          <h3 className="text-lg font-semibold">Peoples</h3>
          <p className="mt-1 text-sm text-slate-600">
            CRUD for person profiles with two image URLs and research details.
          </p>
        </Link>

        <Link
          href="/admin/publications"
          className="rounded-xl border p-5 transition hover:bg-slate-50"
        >
          <p className="text-sm text-slate-500">Module</p>
          <h3 className="text-lg font-semibold">Publications</h3>
          <p className="mt-1 text-sm text-slate-600">
            Category enum, text details, and optional external link.
          </p>
        </Link>

        <Link
          href="/admin/patents"
          className="rounded-xl border p-5 transition hover:bg-slate-50"
        >
          <p className="text-sm text-slate-500">Module</p>
          <h3 className="text-lg font-semibold">Patents</h3>
          <p className="mt-1 text-sm text-slate-600">
            Granted or Published category with text.
          </p>
        </Link>

        <Link
          href="/admin/achievements"
          className="rounded-xl border p-5 transition hover:bg-slate-50"
        >
          <p className="text-sm text-slate-500">Module</p>
          <h3 className="text-lg font-semibold">Achievements</h3>
          <p className="mt-1 text-sm text-slate-600">
            Achievements, invited talks, or short-term programs—with text.
          </p>
        </Link>

        <Link
          href="/admin/news-highlights"
          className="rounded-xl border p-5 transition hover:bg-slate-50"
        >
          <p className="text-sm text-slate-500">Module</p>
          <h3 className="text-lg font-semibold">News &amp; highlights</h3>
          <p className="mt-1 text-sm text-slate-600">
            Image-only gallery entries stored in MongoDB.
          </p>
        </Link>

        <Link
          href="/admin/opportunities"
          className="rounded-xl border p-5 transition hover:bg-slate-50"
        >
          <p className="text-sm text-slate-500">Module</p>
          <h3 className="text-lg font-semibold">Opportunities</h3>
          <p className="mt-1 text-sm text-slate-600">Text-only opportunity entries.</p>
        </Link>

        <Link
          href="/admin/collaborations"
          className="rounded-xl border p-5 transition hover:bg-slate-50"
        >
          <p className="text-sm text-slate-500">Module</p>
          <h3 className="text-lg font-semibold">Collaborations</h3>
          <p className="mt-1 text-sm text-slate-600">
            Text and image per entry, stored in the database.
          </p>
        </Link>

        <Link
          href="/admin/research-projects"
          className="rounded-xl border p-5 transition hover:bg-slate-50"
        >
          <p className="text-sm text-slate-500">Module</p>
          <h3 className="text-lg font-semibold">Research Projects</h3>
          <p className="mt-1 text-sm text-slate-600">
            Image, title, college name, and bugged.
          </p>
        </Link>

        <Link
          href="/admin/workspace"
          className="rounded-xl border p-5 transition hover:bg-slate-50"
        >
          <p className="text-sm text-slate-500">Module</p>
          <h3 className="text-lg font-semibold">Workspace</h3>
          <p className="mt-1 text-sm text-slate-600">
            Extra endpoint reserved for upcoming admin features.
          </p>
        </Link>
      </section>
    </div>
  );
}
