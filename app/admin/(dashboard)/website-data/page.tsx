import { WebsiteDataManagement } from "@/app/admin/WebsiteDataManagement";

export default function WebsiteDataPage() {
  return (
    <div className="space-y-4">
      <header>
        <p className="text-sm text-slate-500">Module</p>
        <h2 className="text-2xl font-semibold">Website Data</h2>
        <p className="mt-1 text-sm text-slate-600">
          Manage singleton website content such as branding, hero text, about copy, lead profile,
          and contact details.
        </p>
      </header>
      <WebsiteDataManagement />
    </div>
  );
}
