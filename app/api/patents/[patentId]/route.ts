import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import {
  patentCategories,
  Patent,
  PatentCategory,
} from "@/lib/models/Patent";

type RouteContext = {
  params: Promise<{ patentId: string }>;
};

type UpdatePatentBody = {
  category?: string;
  text?: string;
};

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

function isPatentCategory(value: string): value is PatentCategory {
  return patentCategories.includes(value as PatentCategory);
}

function serialize(item: {
  _id: unknown;
  category: PatentCategory;
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

  const { patentId } = await context.params;
  if (!Types.ObjectId.isValid(patentId)) {
    return NextResponse.json({ error: "Invalid patent id." }, { status: 400 });
  }

  await connectToDb();
  const patent = await Patent.findById(patentId).lean();
  if (!patent) {
    return NextResponse.json({ error: "Patent not found." }, { status: 404 });
  }

  return NextResponse.json({ patent: serialize(patent) });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { patentId } = await context.params;
  if (!Types.ObjectId.isValid(patentId)) {
    return NextResponse.json({ error: "Invalid patent id." }, { status: 400 });
  }

  const body = (await request.json()) as UpdatePatentBody;

  await connectToDb();
  const patent = await Patent.findById(patentId);
  if (!patent) {
    return NextResponse.json({ error: "Patent not found." }, { status: 404 });
  }

  if (typeof body.category === "string") {
    const nextCategory = body.category.trim();
    if (!isPatentCategory(nextCategory)) {
      return NextResponse.json(
        { error: "category must be Granted or Published." },
        { status: 400 },
      );
    }
    patent.category = nextCategory;
  }

  if (typeof body.text === "string" && body.text.trim()) {
    patent.text = body.text.trim();
  }

  await patent.save();
  return NextResponse.json({ patent: serialize(patent) });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { patentId } = await context.params;
  if (!Types.ObjectId.isValid(patentId)) {
    return NextResponse.json({ error: "Invalid patent id." }, { status: 400 });
  }

  await connectToDb();
  const deleted = await Patent.findByIdAndDelete(patentId);
  if (!deleted) {
    return NextResponse.json({ error: "Patent not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
