import { ResearchProjectsManagement } from "@/app/admin/ResearchProjectsManagement";

export default function ResearchProjectsPage() {
  return (
    <div className="space-y-4">
      <header>
        <p className="text-sm text-slate-500">Module</p>
        <h2 className="text-2xl font-semibold">Research Projects</h2>
        <p className="mt-1 text-sm text-slate-600">
          Image, title, college name, and bugged.
        </p>
      </header>
      <ResearchProjectsManagement />
    </div>
  );
}
