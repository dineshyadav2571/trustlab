import { PublicationsManagement } from "@/app/admin/PublicationsManagement";

export default function PublicationsPage() {
  return (
    <div className="space-y-4">
      <header>
        <p className="text-sm text-slate-500">Module</p>
        <h2 className="text-2xl font-semibold">Publications</h2>
        <p className="mt-1 text-sm text-slate-600">
          Manage publications with category, text, and optional link.
        </p>
      </header>
      <PublicationsManagement />
    </div>
  );
}
