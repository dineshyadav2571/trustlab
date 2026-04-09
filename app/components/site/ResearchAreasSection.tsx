import Image from "next/image";

export type ResearchAreaPublic = {
  id: string;
  title: string;
  description: string;
  imageMimeType: string;
  imageBase64: string;
};

export function ResearchAreasSection({ areas }: { areas: ResearchAreaPublic[] }) {
  return (
    <section id="research-areas" className="scroll-mt-20 bg-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="mx-auto mb-12 w-max text-center text-2xl font-semibold text-[var(--btrust-teal)] md:text-3xl">
          <span className="border-b-[3px] border-[var(--btrust-teal)] pb-1">
            Research Areas
          </span>
        </h2>

        {areas.length === 0 ? (
          <p className="text-center text-slate-500">
            Research areas will appear here once added in the admin panel.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 md:gap-10">
            {areas.map((area) => (
              <article
                key={area.id}
                className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative aspect-[16/10] w-full bg-slate-50">
                  <Image
                    src={`data:${area.imageMimeType};base64,${area.imageBase64}`}
                    alt=""
                    fill
                    unoptimized
                    className="h-full w-full object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <h3 className="text-lg font-bold text-slate-900 md:text-xl">
                    {area.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-700 md:text-[15px]">
                    {area.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
