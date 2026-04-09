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
