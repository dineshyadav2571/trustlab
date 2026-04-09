import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import {
  publicationCategories,
  Publication,
  PublicationCategory,
} from "@/lib/models/Publication";

type RouteContext = {
  params: Promise<{ publicationId: string }>;
};

type UpdatePublicationBody = {
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

export async function GET(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { publicationId } = await context.params;
  if (!Types.ObjectId.isValid(publicationId)) {
    return NextResponse.json({ error: "Invalid publication id." }, { status: 400 });
  }

  await connectToDb();
  const publication = await Publication.findById(publicationId).lean();
  if (!publication) {
    return NextResponse.json({ error: "Publication not found." }, { status: 404 });
  }

  return NextResponse.json({ publication: serialize(publication) });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { publicationId } = await context.params;
  if (!Types.ObjectId.isValid(publicationId)) {
    return NextResponse.json({ error: "Invalid publication id." }, { status: 400 });
  }

  const body = (await request.json()) as UpdatePublicationBody;

  await connectToDb();
  const publication = await Publication.findById(publicationId);
  if (!publication) {
    return NextResponse.json({ error: "Publication not found." }, { status: 404 });
  }

  if (typeof body.category === "string") {
    const nextCategory = body.category.trim();
    if (!isPublicationCategory(nextCategory)) {
      return NextResponse.json(
        { error: "category must be one of Journals, Conference, Books." },
        { status: 400 },
      );
    }
    publication.category = nextCategory;
  }

  if (typeof body.text === "string" && body.text.trim()) {
    publication.text = body.text.trim();
  }
  if (typeof body.link === "string") {
    publication.link = body.link.trim();
  }

  await publication.save();
  return NextResponse.json({ publication: serialize(publication) });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { publicationId } = await context.params;
  if (!Types.ObjectId.isValid(publicationId)) {
    return NextResponse.json({ error: "Invalid publication id." }, { status: 400 });
  }

  await connectToDb();
  const deleted = await Publication.findByIdAndDelete(publicationId);
  if (!deleted) {
    return NextResponse.json({ error: "Publication not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
