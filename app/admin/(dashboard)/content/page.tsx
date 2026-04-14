import { ContentManagement } from "@/app/admin/ContentManagement";

export default function ContentPage() {
  return (
    <div className="space-y-4">
      <header>
        <p className="text-sm text-slate-500">Module</p>
        <h2 className="text-2xl font-semibold">Content</h2>
        <p className="mt-1 text-sm text-slate-600">
          Publish text, images, PDFs, or Word files and assign which users can access each item.
        </p>
      </header>
      <ContentManagement />
    </div>
  );
}
