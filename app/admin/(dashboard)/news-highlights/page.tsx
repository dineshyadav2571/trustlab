import { NewsHighlightsManagement } from "@/app/admin/NewsHighlightsManagement";

export default function NewsHighlightsPage() {
  return (
    <div className="space-y-4">
      <header>
        <p className="text-sm text-slate-500">Module</p>
        <h2 className="text-2xl font-semibold">News &amp; highlights</h2>
        <p className="mt-1 text-sm text-slate-600">
          Image-only entries stored in the database (multiple images per entry).
        </p>
      </header>
      <NewsHighlightsManagement />
    </div>
  );
}
