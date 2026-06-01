import { ImportantLinksManagement } from "@/app/admin/ImportantLinksManagement";

export default function ImportantLinksAdminPage() {
  return (
    <div className="space-y-6">
      <header className="border-b border-slate-100 pb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Module</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
          Important Links
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Manage the public Important Links page: sections like &quot;My Content&quot; or
          &quot;Tools &amp; Data Resources&quot;, categories, and individual links with icons.
        </p>
      </header>
      <ImportantLinksManagement />
    </div>
  );
}
