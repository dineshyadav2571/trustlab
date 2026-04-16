import type { Metadata } from "next";
import {
  CollaborationsList,
  type CollaborationPublic,
} from "@/app/components/site/CollaborationsList";
import { connectToDb } from "@/lib/db";
import { Collaboration } from "@/lib/models/Collaboration";

export const metadata: Metadata = {
  title: "Collaborations",
  description: "Institutional and international collaborations.",
};

export default async function CollaborationsPage() {
  let items: CollaborationPublic[] = [];
  try {
    await connectToDb();
    const docs = await Collaboration.find({}).sort({ createdAt: 1 });
    items = docs.map((c) => ({
      id: String(c._id),
      text: c.text,
      imageMimeType: c.imageMimeType,
      imageBase64: c.imageData.toString("base64"),
    }));
  } catch {
    items = [];
  }

  return (
    <div className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <h1 className="mx-auto mb-10 w-max text-center text-3xl font-semibold text-[var(--btrust-teal)] md:mb-12 md:text-4xl">
          <span className="border-b-[3px] border-[var(--btrust-teal)] pb-1">Collaborations</span>
        </h1>

        <CollaborationsList items={items} />
      </div>
    </div>
  );
}
