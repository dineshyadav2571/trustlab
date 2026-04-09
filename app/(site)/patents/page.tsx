import type { Metadata } from "next";
import { PatentListSections, type PatentPublic } from "@/app/components/site/PatentListSections";
import { connectToDb } from "@/lib/db";
import { Patent } from "@/lib/models/Patent";

export const metadata: Metadata = {
  title: "Patents | BTrust Lab @ IIITM Gwalior",
  description: "Granted and published patents from BTrust Lab, IIITM Gwalior.",
};

export default async function PatentsPage() {
  let granted: PatentPublic[] = [];
  let published: PatentPublic[] = [];
  try {
    await connectToDb();
    const docs = await Patent.find({}).sort({ createdAt: -1 }).lean();
    const mapped: PatentPublic[] = docs.map((p) => ({
      id: String(p._id),
      category: p.category,
      text: p.text,
    }));
    granted = mapped.filter((p) => p.category === "Granted");
    published = mapped.filter((p) => p.category === "Published");
  } catch {
    granted = [];
    published = [];
  }

  return (
    <div className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <h1 className="mx-auto mb-12 w-max text-center font-serif text-3xl font-normal text-[var(--btrust-teal)] md:mb-14 md:text-4xl">
          <span className="border-b-[3px] border-[var(--btrust-teal)] pb-1">Patents</span>
        </h1>

        <PatentListSections granted={granted} published={published} />
      </div>
    </div>
  );
}
