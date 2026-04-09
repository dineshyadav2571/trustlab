import { PatentsManagement } from "@/app/admin/PatentsManagement";

export default function PatentsPage() {
  return (
    <div className="space-y-4">
      <header>
        <p className="text-sm text-slate-500">Module</p>
        <h2 className="text-2xl font-semibold">Patents</h2>
        <p className="mt-1 text-sm text-slate-600">
          Granted or Published category with patent text.
        </p>
      </header>
      <PatentsManagement />
    </div>
  );
}
