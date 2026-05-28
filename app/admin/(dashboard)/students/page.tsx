import { StudentsManagement } from "@/app/admin/StudentsManagement";

export default function StudentsAdminPage() {
  return (
    <div className="space-y-4">
      <header>
        <p className="text-sm text-slate-500">Module</p>
        <h2 className="text-2xl font-semibold">Students</h2>
        <p className="mt-1 text-sm text-slate-600">
          Manage thesis supervised entries shown on the public Students page.
        </p>
      </header>
      <StudentsManagement />
    </div>
  );
}
