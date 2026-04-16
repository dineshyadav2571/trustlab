import type { Metadata } from "next";
import {
  NewsHighlightsSection,
  type NewsHighlightPublic,
} from "@/app/components/site/NewsHighlightsSection";
import { connectToDb } from "@/lib/db";
import { NewsHighlight } from "@/lib/models/NewsHighlight";

export const metadata: Metadata = {
  title: "News & Highlights",
  description: "Recent news, events, and highlights.",
};

export default async function NewsPage() {
  let items: NewsHighlightPublic[] = [];
  try {
    await connectToDb();
    const docs = await NewsHighlight.find({}).sort({ createdAt: -1 });
    items = docs.map((doc) => ({
      id: String(doc._id),
      images: doc.images.map((img) => ({
        imageMimeType: img.imageMimeType,
        imageBase64: img.imageData.toString("base64"),
      })),
    }));
  } catch {
    items = [];
  }

  return (
    <div className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h1 className="mx-auto mb-12 flex flex-wrap items-end justify-center gap-x-2 text-3xl font-semibold text-[var(--btrust-teal)] md:mb-14 md:text-4xl">
          <span>News &amp;</span>
          <span className="border-b-[3px] border-[var(--btrust-teal)] pb-1">Highlights</span>
        </h1>

        <NewsHighlightsSection items={items} />
      </div>
    </div>
  );
}
