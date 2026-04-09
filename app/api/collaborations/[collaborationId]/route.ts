import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { Collaboration } from "@/lib/models/Collaboration";

type RouteContext = {
  params: Promise<{ collaborationId: string }>;
};

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

function toResponse(doc: {
  _id: unknown;
  text: string;
  imageData: Buffer;
  imageMimeType: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: String(doc._id),
    text: doc.text,
    imageMimeType: doc.imageMimeType,
    imageBase64: doc.imageData.toString("base64"),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function GET(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { collaborationId } = await context.params;
  if (!Types.ObjectId.isValid(collaborationId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  await connectToDb();
  const doc = await Collaboration.findById(collaborationId).lean();
  if (!doc) {
    return NextResponse.json({ error: "Collaboration not found." }, { status: 404 });
  }

  return NextResponse.json({ collaboration: toResponse(doc) });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { collaborationId } = await context.params;
  if (!Types.ObjectId.isValid(collaborationId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  await connectToDb();
  const doc = await Collaboration.findById(collaborationId);
  if (!doc) {
    return NextResponse.json({ error: "Collaboration not found." }, { status: 404 });
  }

  const formData = await request.formData();
  const text = String(formData.get("text") ?? "").trim();
  const imageFile = formData.get("image");

  if (text) doc.text = text;
  if (imageFile instanceof File) {
    if (!imageFile.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed." },
        { status: 400 },
      );
    }
    doc.imageData = Buffer.from(await imageFile.arrayBuffer());
    doc.imageMimeType = imageFile.type;
  }

  await doc.save();
  return NextResponse.json({ collaboration: toResponse(doc) });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { collaborationId } = await context.params;
  if (!Types.ObjectId.isValid(collaborationId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  await connectToDb();
  const deleted = await Collaboration.findByIdAndDelete(collaborationId);
  if (!deleted) {
    return NextResponse.json({ error: "Collaboration not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
