import { OtherActivitiesManagement } from "@/app/admin/OtherActivitiesManagement";

export default function OtherActivitiesAdminPage() {
  return (
    <div className="space-y-4">
      <header>
        <p className="text-sm text-slate-500">Module</p>
        <h2 className="text-2xl font-semibold">Other Activities</h2>
        <p className="mt-1 text-sm text-slate-600">
          Section headings with unlimited list items for the public Other Activities page.
        </p>
      </header>
      <OtherActivitiesManagement />
    </div>
  );
}
