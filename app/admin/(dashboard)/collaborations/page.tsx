import { CollaborationsManagement } from "@/app/admin/CollaborationsManagement";

export default function CollaborationsPage() {
  return (
    <div className="space-y-4">
      <header>
        <p className="text-sm text-slate-500">Module</p>
        <h2 className="text-2xl font-semibold">Collaborations</h2>
        <p className="mt-1 text-sm text-slate-600">
          Text and one image per entry (image stored in MongoDB).
        </p>
      </header>
      <CollaborationsManagement />
    </div>
  );
}
