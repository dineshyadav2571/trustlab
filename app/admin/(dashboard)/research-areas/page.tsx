import { ResearchAreaManagement } from "@/app/admin/ResearchAreaManagement";

export default function ResearchAreasPage() {
  return (
    <div className="space-y-4">
      <header>
        <p className="text-sm text-slate-500">Module</p>
        <h2 className="text-2xl font-semibold">Research Areas</h2>
        <p className="mt-1 text-sm text-slate-600">
          Manage research areas with image, title, and description.
        </p>
      </header>
      <ResearchAreaManagement />
    </div>
  );
}
