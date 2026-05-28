import { AdministrationManagement } from "@/app/admin/AdministrationManagement";

export default function AdministrationAdminPage() {
  return (
    <div className="space-y-4">
      <header>
        <p className="text-sm text-slate-500">Module</p>
        <h2 className="text-2xl font-semibold">Administration</h2>
        <p className="mt-1 text-sm text-slate-600">
          Headings with unlimited bullet items for the public Administration page.
        </p>
      </header>
      <AdministrationManagement />
    </div>
  );
}
