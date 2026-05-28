import type { Metadata } from "next";
import { AdministrationPageContent } from "@/app/components/site/AdministrationSection";
import { getPublicAdministrationSections } from "@/lib/administration";

export const metadata: Metadata = {
  title: "Administration",
  description: "Administrative roles and responsibilities.",
};

export default async function AdministrationPage() {
  let sections: Awaited<ReturnType<typeof getPublicAdministrationSections>> = [];
  try {
    sections = await getPublicAdministrationSections();
  } catch {
    sections = [];
  }

  return (
    <div className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <h1 className="mx-auto mb-10 w-max text-center text-3xl font-semibold text-[var(--btrust-teal)] md:mb-12 md:text-4xl">
          <span className="border-b-[3px] border-[var(--btrust-teal)] pb-1">
            Administration
          </span>
        </h1>
        <AdministrationPageContent sections={sections} />
      </div>
    </div>
  );
}
