import type { Metadata } from "next";
import { OpportunityRichText } from "@/app/components/site/OpportunityRichText";
import { connectToDb } from "@/lib/db";
import { Opportunity } from "@/lib/models/Opportunity";

export const metadata: Metadata = {
  title: "Opportunities",
  description: "Research fellowships, openings, and academic opportunities.",
};

export default async function OpportunitiesPage() {
  let items: { id: string; text: string }[] = [];
  try {
    await connectToDb();
    const docs = await Opportunity.find({}).sort({ createdAt: -1 }).lean();
    items = docs.map((d) => ({ id: String(d._id), text: d.text }));
  } catch {
    items = [];
  }

  return (
    <div className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <h1 className="mx-auto mb-10 w-max text-center text-3xl font-semibold text-[var(--btrust-teal)] md:mb-12 md:text-4xl">
          <span className="border-b-[3px] border-[var(--btrust-teal)] pb-1">Opportunities</span>
        </h1>

        {items.length === 0 ? (
          <p className="text-center text-slate-500">
            Opportunities will be listed here once they are added in the admin panel.
          </p>
        ) : (
          <ul className="list-outside list-disc space-y-8 pl-6 text-[15px] leading-relaxed text-slate-800 marker:text-[var(--btrust-teal)] md:pl-8 md:text-base">
            {items.map((item) => (
              <li key={item.id} className="pl-2 text-justify">
                <OpportunityRichText text={item.text} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
