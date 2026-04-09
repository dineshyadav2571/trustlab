import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import {
  publicationCategories,
  Publication,
  PublicationCategory,
} from "@/lib/models/Publication";

type CreatePublicationBody = {
  category?: string;
  text?: string;
  link?: string;
};

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

function isPublicationCategory(value: string): value is PublicationCategory {
  return publicationCategories.includes(value as PublicationCategory);
}

function serialize(item: {
  _id: unknown;
  category: PublicationCategory;
  text: string;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: String(item._id),
    category: item.category,
    text: item.text,
    link: item.link ?? "",
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
  const publications = await Publication.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ publications: publications.map(serialize) });
}

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const body = (await request.json()) as CreatePublicationBody;
  const category = String(body.category ?? "").trim();
  const text = String(body.text ?? "").trim();
  const link = String(body.link ?? "").trim();

  if (!isPublicationCategory(category)) {
    return NextResponse.json(
      { error: "category must be one of Journals, Conference, Books." },
      { status: 400 },
    );
  }
  if (!text) {
    return NextResponse.json({ error: "text is required." }, { status: 400 });
  }

  await connectToDb();
  const created = await Publication.create({
    category,
    text,
    link,
  });

  return NextResponse.json({ publication: serialize(created) }, { status: 201 });
}
