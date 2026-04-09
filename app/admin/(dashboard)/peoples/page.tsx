import { PeopleManagement } from "@/app/admin/PeopleManagement";

export default function PeoplesPage() {
  return (
    <div className="space-y-4">
      <header>
        <p className="text-sm text-slate-500">Module</p>
        <h2 className="text-2xl font-semibold">Peoples</h2>
        <p className="mt-1 text-sm text-slate-600">
          Manage people details along with two research profile URLs.
        </p>
      </header>
      <PeopleManagement />
    </div>
  );
}
