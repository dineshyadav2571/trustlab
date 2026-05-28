import { TeachingManagement } from "@/app/admin/TeachingManagement";

export default function TeachingAdminPage() {
  return (
    <div className="space-y-4">
      <header>
        <p className="text-sm text-slate-500">Module</p>
        <h2 className="text-2xl font-semibold">Teaching</h2>
        <p className="mt-1 text-sm text-slate-600">
          Manage the list of courses shown on the public Teaching page.
        </p>
      </header>
      <TeachingManagement />
    </div>
  );
}
