import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { ResearchArea } from "@/lib/models/ResearchArea";

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

export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  await connectToDb();
  const areas = await ResearchArea.find({}).sort({ createdAt: -1 }).lean();

  return NextResponse.json({
    researchAreas: areas.map(toResponse),
  });
}

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const formData = await request.formData();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageFile = formData.get("image");

  if (!title || !description) {
    return NextResponse.json(
      { error: "Title and description are required." },
      { status: 400 },
    );
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

  const bytes = await imageFile.arrayBuffer();
  const imageData = Buffer.from(bytes);

  await connectToDb();
  const created = await ResearchArea.create({
    title,
    description,
    imageData,
    imageMimeType: imageFile.type,
  });

  return NextResponse.json({ researchArea: toResponse(created) }, { status: 201 });
}
