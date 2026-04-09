import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { NewsHighlight } from "@/lib/models/NewsHighlight";

type RouteContext = {
  params: Promise<{ newsHighlightId: string }>;
};

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

function serialize(doc: {
  _id: unknown;
  images: { imageData: Buffer; imageMimeType: string }[];
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: String(doc._id),
    images: doc.images.map((img) => ({
      imageMimeType: img.imageMimeType,
      imageBase64: img.imageData.toString("base64"),
    })),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

async function filesFromFormData(formData: FormData): Promise<File[]> {
  const all = formData.getAll("images");
  const files = all.filter((item): item is File => item instanceof File);
  return files.filter((f) => f.size > 0);
}

export async function GET(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { newsHighlightId } = await context.params;
  if (!Types.ObjectId.isValid(newsHighlightId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  await connectToDb();
  const doc = await NewsHighlight.findById(newsHighlightId).lean();
  if (!doc) {
    return NextResponse.json({ error: "News highlight not found." }, { status: 404 });
  }

  return NextResponse.json({ newsHighlight: serialize(doc) });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { newsHighlightId } = await context.params;
  if (!Types.ObjectId.isValid(newsHighlightId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  await connectToDb();
  const doc = await NewsHighlight.findById(newsHighlightId);
  if (!doc) {
    return NextResponse.json({ error: "News highlight not found." }, { status: 404 });
  }

  const formData = await request.formData();
  const files = await filesFromFormData(formData);

  if (files.length) {
    const images: { imageData: Buffer; imageMimeType: string }[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Only image files are allowed." },
          { status: 400 },
        );
      }
      images.push({
        imageData: Buffer.from(await file.arrayBuffer()),
        imageMimeType: file.type,
      });
    }
    doc.images = images;
  }

  await doc.save();
  return NextResponse.json({ newsHighlight: serialize(doc) });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { newsHighlightId } = await context.params;
  if (!Types.ObjectId.isValid(newsHighlightId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  await connectToDb();
  const deleted = await NewsHighlight.findByIdAndDelete(newsHighlightId);
  if (!deleted) {
    return NextResponse.json({ error: "News highlight not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
