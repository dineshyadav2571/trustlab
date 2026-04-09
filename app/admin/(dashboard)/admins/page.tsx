import { AdminManagement } from "@/app/admin/AdminManagement";

export default function AdminManagementPage() {
  return (
    <div className="space-y-4">
      <header>
        <p className="text-sm text-slate-500">Module</p>
        <h2 className="text-2xl font-semibold">Admin Management</h2>
        <p className="mt-1 text-sm text-slate-600">
          Dedicated endpoint for creating and viewing all admin accounts.
        </p>
      </header>
      <AdminManagement />
    </div>
  );
}
