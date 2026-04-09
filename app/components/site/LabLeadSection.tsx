import Image from "next/image";

function ProfileIconLinks({
  scholarUrl,
  researchGateUrl,
}: {
  scholarUrl: string;
  researchGateUrl: string;
}) {
  return (
    <div className="mt-6 flex gap-3">
      <a
        href={scholarUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--btrust-teal)] text-sm font-bold text-[var(--btrust-teal)] transition-colors hover:bg-teal-50"
        aria-label="Google Scholar profile"
      >
        G
      </a>
      <a
        href={researchGateUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--btrust-teal)] text-xs font-bold leading-tight text-[var(--btrust-teal)] transition-colors hover:bg-teal-50"
        aria-label="ResearchGate profile"
      >
        RG
      </a>
    </div>
  );
}

/** Static lab lead — replace profile URLs and copy; image: `public/people-lead.png`. */
export function LabLeadSection() {
  const scholarUrl = "https://scholar.google.com/";
  const researchGateUrl = "https://www.researchgate.net/";

  return (
    <section className="mb-16 md:mb-20">
      <div className="grid gap-10 md:grid-cols-2 md:items-start md:gap-12 lg:gap-16">
        <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
          <Image
            src="/people-lead.png"
            alt="Dr. Amrendra Singh Yadav"
            width={900}
            height={1100}
            className="h-auto w-full object-cover object-top"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className="text-slate-800">
          <h2 className="text-2xl font-bold text-slate-900 md:text-[26px]">
            Dr. Amrendra Singh Yadav
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-600 md:text-[15px]">
            (Assistant Professor, Department of Computer Science and Engineering (CSE), IIITM
            Gwalior)
          </p>

          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-slate-700 md:text-base">
            <p className="text-justify">
              Dr. Amrendra Singh Yadav is an Assistant Professor in the Department of Computer
              Science and Engineering at the Indian Institute of Information Technology and
              Management (IIITM) Gwalior. His research spans blockchain systems, the Internet of
              Things (IoT), information security, and distributed applications for smart
              infrastructure, vehicular networks, and trustworthy data management.
            </p>
            <p className="text-justify">
              He actively contributes to the BTrust Lab&apos;s mission by investigating secure
              and efficient protocols, consensus and sharding strategies, and real-world
              deployments that bridge academic research with societal impact. His work is
              reflected in peer-reviewed publications and ongoing collaborations with students and
              researchers across security and systems.
            </p>
            <p className="text-justify">
              He is committed to mentoring scholars, strengthening the lab&apos;s collaborative
              culture, and advancing practical solutions at the intersection of blockchain,
              networking, and applied security.
            </p>
          </div>

          <ProfileIconLinks scholarUrl={scholarUrl} researchGateUrl={researchGateUrl} />
        </div>
      </div>
    </section>
  );
}
