import type { Metadata } from "next";
import { LabLeadSection } from "@/app/components/site/LabLeadSection";
import {
  ResearchScholarsSection,
  type ResearchScholarPublic,
} from "@/app/components/site/ResearchScholarsSection";
import { connectToDb } from "@/lib/db";
import { People } from "@/lib/models/People";

export const metadata: Metadata = {
  title: "People | BTrust Lab @ IIITM Gwalior",
  description: "Faculty and research scholars at BTrust Lab, IIITM Gwalior.",
};

export default async function PeoplePage() {
  let scholars: ResearchScholarPublic[] = [];
  try {
    await connectToDb();
    const docs = await People.find({}).sort({ createdAt: -1 });
    scholars = docs.map((p) => ({
      id: String(p._id),
      name: p.name,
      title: p.title,
      department: p.department,
      email: p.email,
      researchInterests: p.researchInterests,
      profileImageMimeType: p.profileImageMimeType,
      profileImageBase64: p.profileImageData.toString("base64"),
      profileUrl1: p.profileUrl1,
      profileUrl2: p.profileUrl2,
    }));
  } catch {
    scholars = [];
  }

  return (
    <div className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h1 className="mx-auto mb-14 w-max text-center font-serif text-3xl font-normal text-[var(--btrust-teal)] md:mb-16 md:text-4xl">
          <span className="border-b border-[var(--btrust-teal)] pb-1">People</span>
        </h1>

        <LabLeadSection />
        <ResearchScholarsSection scholars={scholars} />
      </div>
    </div>
  );
}
