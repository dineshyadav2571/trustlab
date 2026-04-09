import type { Metadata } from "next";
import {
  PublicationsSection,
  type PublicationPublic,
} from "@/app/components/site/PublicationsSection";
import { connectToDb } from "@/lib/db";
import { Publication } from "@/lib/models/Publication";

export const metadata: Metadata = {
  title: "Publications | BTrust Lab @ IIITM Gwalior",
  description: "Journal articles, conference papers, and books from BTrust Lab, IIITM Gwalior.",
};

export default async function PublicationsPage() {
  let publications: PublicationPublic[] = [];
  try {
    await connectToDb();
    const docs = await Publication.find({}).sort({ createdAt: -1 }).lean();
    publications = docs.map((p) => ({
      id: String(p._id),
      category: p.category,
      text: p.text,
      link: p.link ?? "",
    }));
  } catch {
    publications = [];
  }

  return (
    <div className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <h1 className="mx-auto mb-10 w-max text-center text-3xl font-semibold text-[var(--btrust-teal)] md:mb-12 md:text-4xl">
          <span className="border-b-[3px] border-[var(--btrust-teal)] pb-1">Publications</span>
        </h1>

        <PublicationsSection publications={publications} />
      </div>
    </div>
  );
}
