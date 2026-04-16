import type { Metadata } from "next";
import {
  AchievementsSection,
  type AchievementPublic,
} from "@/app/components/site/AchievementsSection";
import { connectToDb } from "@/lib/db";
import { Achievement } from "@/lib/models/Achievement";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Achievements, invited talks, and short-term programs.",
};

export default async function AchievementsPage() {
  let achievements: AchievementPublic[] = [];
  try {
    await connectToDb();
    const docs = await Achievement.find({}).sort({ createdAt: -1 }).lean();
    achievements = docs.map((a) => ({
      id: String(a._id),
      category: a.category,
      text: a.text,
    }));
  } catch {
    achievements = [];
  }

  return (
    <div className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <h1 className="mx-auto mb-10 w-max text-center text-3xl font-semibold text-[var(--btrust-teal)] md:mb-12 md:text-4xl">
          <span className="border-b-[3px] border-[var(--btrust-teal)] pb-1">Achievements</span>
        </h1>

        <AchievementsSection achievements={achievements} />
      </div>
    </div>
  );
}
