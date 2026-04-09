import { OpportunitiesManagement } from "@/app/admin/OpportunitiesManagement";

export default function OpportunitiesPage() {
  return (
    <div className="space-y-4">
      <header>
        <p className="text-sm text-slate-500">Module</p>
        <h2 className="text-2xl font-semibold">Opportunities</h2>
        <p className="mt-1 text-sm text-slate-600">
          Text-only entries for opportunities.
        </p>
      </header>
      <OpportunitiesManagement />
    </div>
  );
}
