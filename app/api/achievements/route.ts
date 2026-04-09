import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import {
  achievementCategories,
  Achievement,
  AchievementCategory,
} from "@/lib/models/Achievement";

type CreateAchievementBody = {
  category?: string;
  text?: string;
};

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

function isAchievementCategory(value: string): value is AchievementCategory {
  return achievementCategories.includes(value as AchievementCategory);
}

function serialize(item: {
  _id: unknown;
  category: AchievementCategory;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: String(item._id),
    category: item.category,
    text: item.text,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  await connectToDb();
  const achievements = await Achievement.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ achievements: achievements.map(serialize) });
}

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const body = (await request.json()) as CreateAchievementBody;
  const category = String(body.category ?? "").trim();
  const text = String(body.text ?? "").trim();

  if (!isAchievementCategory(category)) {
    return NextResponse.json(
      {
        error:
          "category must be Achievements, Invited Talks, or Short term program conducted.",
      },
      { status: 400 },
    );
  }
  if (!text) {
    return NextResponse.json({ error: "text is required." }, { status: 400 });
  }

  await connectToDb();
  const created = await Achievement.create({ category, text });

  return NextResponse.json({ achievement: serialize(created) }, { status: 201 });
}
