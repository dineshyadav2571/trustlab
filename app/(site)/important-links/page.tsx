import type { Metadata } from "next";
import { ImportantLinksContent } from "@/app/components/site/ImportantLinksContent";
import { getPublicImportantLinkSections } from "@/lib/important-link-sections";

export const metadata: Metadata = {
  title: "Important Links",
  description: "Curated resources, tools, and reference links.",
};

export default async function ImportantLinksPage() {
  let sections: Awaited<ReturnType<typeof getPublicImportantLinkSections>> = [];
  try {
    sections = await getPublicImportantLinkSections();
  } catch {
    sections = [];
  }

  return (
    <div className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <h1 className="mx-auto mb-10 w-max text-center text-3xl font-semibold text-[var(--btrust-teal)] md:mb-12 md:text-4xl">
          <span className="border-b-[3px] border-[var(--btrust-teal)] pb-1">Important Links</span>
        </h1>
        <ImportantLinksContent sections={sections} />
      </div>
    </div>
  );
}
