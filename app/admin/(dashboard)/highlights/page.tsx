import { HighlightsManagement } from "@/app/admin/HighlightsManagement";

export default function HighlightsAdminPage() {
  return (
    <div className="space-y-6">
      <header className="border-b border-slate-100 pb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Module</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
          Highlights
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Image slides for the home page carousel — research posters, figures, or composite
          graphics like the reference faculty site.
        </p>
      </header>
      <HighlightsManagement />
    </div>
  );
}
