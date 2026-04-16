import Image from "next/image";
import type { PublicWebsiteData } from "@/lib/website-data";

function ProfileIconLinks({ scholarUrl, researchGateUrl }: { scholarUrl: string; researchGateUrl: string }) {
  return (
    <div className="mt-6 flex gap-3">
      <a href={scholarUrl} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--btrust-teal)] text-sm font-bold text-[var(--btrust-teal)] transition-colors hover:bg-teal-50" aria-label="Google Scholar profile">G</a>
      <a href={researchGateUrl} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--btrust-teal)] text-xs font-bold leading-tight text-[var(--btrust-teal)] transition-colors hover:bg-teal-50" aria-label="ResearchGate profile">RG</a>
    </div>
  );
}

export function LabLeadSection({ lead }: { lead: PublicWebsiteData["lead"] }) {
  const paragraphs = lead.bio.split(/\n\s*\n/).filter(Boolean);
  const hasImage = lead.imageMimeType && lead.imageBase64;

  return (
    <section className="mb-16 md:mb-20">
      <div className="grid gap-10 md:grid-cols-2 md:items-start md:gap-12 lg:gap-16">
        <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
          {hasImage ? (
            <Image src={`data:${lead.imageMimeType};base64,${lead.imageBase64}`} alt={lead.name} width={900} height={1100} className="h-auto w-full object-cover object-top" priority sizes="(max-width: 768px) 100vw, 50vw" unoptimized />
          ) : (
            <Image src="/people-lead.png" alt={lead.name} width={900} height={1100} className="h-auto w-full object-cover object-top" priority sizes="(max-width: 768px) 100vw, 50vw" />
          )}
        </div>
        <div className="text-slate-800">
          <h2 className="text-2xl font-bold text-slate-900 md:text-[26px]">{lead.name}</h2>
          <p className="mt-2 text-sm font-semibold text-slate-600 md:text-[15px]">({lead.role})</p>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-slate-700 md:text-base">
            {paragraphs.map((paragraph) => <p key={paragraph.slice(0, 40)} className="text-justify">{paragraph}</p>)}
          </div>
          <ProfileIconLinks scholarUrl={lead.scholarUrl} researchGateUrl={lead.researchGateUrl} />
        </div>
      </div>
    </section>
  );
}
