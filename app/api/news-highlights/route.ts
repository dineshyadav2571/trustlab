import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { NewsHighlight } from "@/lib/models/NewsHighlight";

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

export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  await connectToDb();
  const items = await NewsHighlight.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({
    newsHighlights: items.map(serialize),
  });
}

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const formData = await request.formData();
  const files = await filesFromFormData(formData);

  if (!files.length) {
    return NextResponse.json(
      { error: "At least one image is required (field name: images)." },
      { status: 400 },
    );
  }

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

  await connectToDb();
  const created = await NewsHighlight.create({ images });

  return NextResponse.json(
    { newsHighlight: serialize(created) },
    { status: 201 },
  );
}
