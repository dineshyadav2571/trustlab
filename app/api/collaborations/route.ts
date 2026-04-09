import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { Collaboration } from "@/lib/models/Collaboration";

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

export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  await connectToDb();
  const items = await Collaboration.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ collaborations: items.map(toResponse) });
}

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const formData = await request.formData();
  const text = String(formData.get("text") ?? "").trim();
  const imageFile = formData.get("image");

  if (!text) {
    return NextResponse.json({ error: "text is required." }, { status: 400 });
  }
  if (!imageFile || !(imageFile instanceof File)) {
    return NextResponse.json({ error: "Image is required." }, { status: 400 });
  }
  if (!imageFile.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only image files are allowed." },
      { status: 400 },
    );
  }

  const imageData = Buffer.from(await imageFile.arrayBuffer());

  await connectToDb();
  const created = await Collaboration.create({
    text,
    imageData,
    imageMimeType: imageFile.type,
  });

  return NextResponse.json({ collaboration: toResponse(created) }, { status: 201 });
}
