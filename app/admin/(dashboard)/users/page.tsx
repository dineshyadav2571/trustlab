import { UsersManagement } from "@/app/admin/UsersManagement";

export default function UsersPage() {
  return (
    <div className="space-y-4">
      <header>
        <p className="text-sm text-slate-500">Module</p>
        <h2 className="text-2xl font-semibold">Users</h2>
        <p className="mt-1 text-sm text-slate-600">
          Normal user accounts (managed by admins). Sign-in UI can be connected later.
        </p>
      </header>
      <UsersManagement />
    </div>
  );
}
