import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import {
  achievementCategories,
  Achievement,
  AchievementCategory,
} from "@/lib/models/Achievement";

type RouteContext = {
  params: Promise<{ achievementId: string }>;
};

type UpdateAchievementBody = {
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

export async function GET(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { achievementId } = await context.params;
  if (!Types.ObjectId.isValid(achievementId)) {
    return NextResponse.json({ error: "Invalid achievement id." }, { status: 400 });
  }

  await connectToDb();
  const achievement = await Achievement.findById(achievementId).lean();
  if (!achievement) {
    return NextResponse.json({ error: "Achievement not found." }, { status: 404 });
  }

  return NextResponse.json({ achievement: serialize(achievement) });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { achievementId } = await context.params;
  if (!Types.ObjectId.isValid(achievementId)) {
    return NextResponse.json({ error: "Invalid achievement id." }, { status: 400 });
  }

  const body = (await request.json()) as UpdateAchievementBody;

  await connectToDb();
  const achievement = await Achievement.findById(achievementId);
  if (!achievement) {
    return NextResponse.json({ error: "Achievement not found." }, { status: 404 });
  }

  if (typeof body.category === "string") {
    const nextCategory = body.category.trim();
    if (!isAchievementCategory(nextCategory)) {
      return NextResponse.json(
        {
          error:
            "category must be Achievements, Invited Talks, or Short term program conducted.",
        },
        { status: 400 },
      );
    }
    achievement.category = nextCategory;
  }

  if (typeof body.text === "string" && body.text.trim()) {
    achievement.text = body.text.trim();
  }

  await achievement.save();
  return NextResponse.json({ achievement: serialize(achievement) });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { achievementId } = await context.params;
  if (!Types.ObjectId.isValid(achievementId)) {
    return NextResponse.json({ error: "Invalid achievement id." }, { status: 400 });
  }

  await connectToDb();
  const deleted = await Achievement.findByIdAndDelete(achievementId);
  if (!deleted) {
    return NextResponse.json({ error: "Achievement not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
