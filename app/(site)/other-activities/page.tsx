import type { Metadata } from "next";
import { OtherActivitiesPageContent } from "@/app/components/site/OtherActivitiesSection";
import { getPublicOtherActivitySections } from "@/lib/other-activities";

export const metadata: Metadata = {
  title: "Other Activities",
  description: "Expert lectures, programmes, awards, memberships, and other professional activities.",
};

export default async function OtherActivitiesPage() {
  let sections: Awaited<ReturnType<typeof getPublicOtherActivitySections>> = [];
  try {
    sections = await getPublicOtherActivitySections();
  } catch {
    sections = [];
  }

  return (
    <div className="bg-slate-50 py-14 md:py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <h1 className="mx-auto mb-10 w-max text-center text-3xl font-semibold text-[var(--btrust-teal)] md:mb-12 md:text-4xl">
          <span className="border-b-[3px] border-[var(--btrust-teal)] pb-1">
            Other Activities
          </span>
        </h1>
        <OtherActivitiesPageContent sections={sections} />
      </div>
    </div>
  );
}
