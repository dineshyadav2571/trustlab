import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import {
  patentCategories,
  Patent,
  PatentCategory,
} from "@/lib/models/Patent";

type CreatePatentBody = {
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

export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  await connectToDb();
  const patents = await Patent.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ patents: patents.map(serialize) });
}

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const body = (await request.json()) as CreatePatentBody;
  const category = String(body.category ?? "").trim();
  const text = String(body.text ?? "").trim();

  if (!isPatentCategory(category)) {
    return NextResponse.json(
      { error: "category must be Granted or Published." },
      { status: 400 },
    );
  }
  if (!text) {
    return NextResponse.json({ error: "text is required." }, { status: 400 });
  }

  await connectToDb();
  const created = await Patent.create({ category, text });

  return NextResponse.json({ patent: serialize(created) }, { status: 201 });
}
