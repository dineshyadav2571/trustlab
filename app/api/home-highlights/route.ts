import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { serializeHomeHighlightAdmin } from "@/lib/home-highlights";
import { HomeHighlight } from "@/lib/models/HomeHighlight";

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  await connectToDb();
  const items = await HomeHighlight.find({}).lean();
  items.sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  return NextResponse.json({
    homeHighlights: items.map((doc) =>
      serializeHomeHighlightAdmin({
        _id: doc._id,
        alt: doc.alt,
        sortOrder: doc.sortOrder,
        imageData: doc.imageData,
        imageMimeType: doc.imageMimeType,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    ),
  });
}

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const formData = await request.formData();
  const alt = String(formData.get("alt") ?? "").trim();
  const sortOrderRaw = formData.get("sortOrder");
  const sortOrder = Number.isFinite(Number(sortOrderRaw)) ? Number(sortOrderRaw) : 0;
  const imageFile = formData.get("image");

  if (!imageFile || !(imageFile instanceof File)) {
    return NextResponse.json({ error: "Image is required." }, { status: 400 });
  }
  if (!imageFile.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
  }

  const imageData = Buffer.from(await imageFile.arrayBuffer());

  await connectToDb();
  const created = await HomeHighlight.create({
    alt,
    sortOrder,
    imageData,
    imageMimeType: imageFile.type,
  });

  revalidatePath("/");
  return NextResponse.json(
    {
      homeHighlight: serializeHomeHighlightAdmin({
        _id: created._id,
        alt: created.alt,
        sortOrder: created.sortOrder,
        imageData: created.imageData,
        imageMimeType: created.imageMimeType,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
      }),
    },
    { status: 201 },
  );
}
