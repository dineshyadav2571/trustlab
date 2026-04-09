import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { ResearchArea } from "@/lib/models/ResearchArea";

type RouteContext = {
  params: Promise<{ researchAreaId: string }>;
};

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

function toResponse(area: {
  _id: unknown;
  title: string;
  description: string;
  imageData: Buffer;
  imageMimeType: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: String(area._id),
    title: area.title,
    description: area.description,
    imageMimeType: area.imageMimeType,
    imageBase64: area.imageData.toString("base64"),
    createdAt: area.createdAt,
    updatedAt: area.updatedAt,
  };
}

export async function GET(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { researchAreaId } = await context.params;
  if (!Types.ObjectId.isValid(researchAreaId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  await connectToDb();
  const area = await ResearchArea.findById(researchAreaId).lean();

  if (!area) {
    return NextResponse.json({ error: "Research area not found." }, { status: 404 });
  }

  return NextResponse.json({ researchArea: toResponse(area) });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { researchAreaId } = await context.params;
  if (!Types.ObjectId.isValid(researchAreaId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  const formData = await request.formData();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageFile = formData.get("image");

  await connectToDb();
  const area = await ResearchArea.findById(researchAreaId);
  if (!area) {
    return NextResponse.json({ error: "Research area not found." }, { status: 404 });
  }

  if (title) {
    area.title = title;
  }
  if (description) {
    area.description = description;
  }
  if (imageFile instanceof File) {
    if (!imageFile.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed." },
        { status: 400 },
      );
    }
    const bytes = await imageFile.arrayBuffer();
    area.imageData = Buffer.from(bytes);
    area.imageMimeType = imageFile.type;
  }

  await area.save();
  return NextResponse.json({ researchArea: toResponse(area) });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { researchAreaId } = await context.params;
  if (!Types.ObjectId.isValid(researchAreaId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  await connectToDb();
  const deleted = await ResearchArea.findByIdAndDelete(researchAreaId);
  if (!deleted) {
    return NextResponse.json({ error: "Research area not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
