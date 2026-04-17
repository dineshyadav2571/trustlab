import Image from "next/image";
import type { Metadata } from "next";
import { getPublicWebsiteData } from "@/lib/website-data";

export const metadata: Metadata = {
  title: "About Us",
  description: "Mission, research focus, and team information.",
};

export default async function AboutPage() {
  const websiteData = await getPublicWebsiteData();
  const paragraphs = websiteData.about.body.split(/\n\s*\n/).filter(Boolean);
  const hasImage = websiteData.about.imageMimeType && websiteData.about.imageBase64;

  return (
    <div className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h1 className="mb-12 text-center text-3xl font-semibold text-[var(--btrust-teal)] md:text-4xl">
          {websiteData.about.title}
        </h1>
        <div className="grid gap-10 md:grid-cols-2 md:items-start md:gap-12 lg:gap-16">
          <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
            {hasImage ? (
              <Image
                src={`data:${websiteData.about.imageMimeType};base64,${websiteData.about.imageBase64}`}
                alt={websiteData.about.title}
                width={1200}
                height={900}
                className="h-auto w-full object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
              />
            ) : (
              <Image
                src="/about-team.png"
                alt={websiteData.about.title}
                width={1200}
                height={900}
                className="h-auto w-full object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>

          <div className="space-y-5 text-left text-[15px] leading-relaxed text-slate-700 md:text-base">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
