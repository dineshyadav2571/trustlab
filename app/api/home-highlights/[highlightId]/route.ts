import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { serializeHomeHighlightAdmin } from "@/lib/home-highlights";
import { HomeHighlight } from "@/lib/models/HomeHighlight";

type RouteContext = { params: Promise<{ highlightId: string }> };

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { highlightId } = await context.params;
  if (!Types.ObjectId.isValid(highlightId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  const formData = await request.formData();
  const alt = formData.has("alt") ? String(formData.get("alt") ?? "").trim() : undefined;
  const sortOrderRaw = formData.get("sortOrder");
  const imageFile = formData.get("image");

  await connectToDb();
  const item = await HomeHighlight.findById(highlightId);
  if (!item) {
    return NextResponse.json({ error: "Highlight not found." }, { status: 404 });
  }

  if (alt !== undefined) item.alt = alt;
  if (sortOrderRaw !== null && Number.isFinite(Number(sortOrderRaw))) {
    item.sortOrder = Number(sortOrderRaw);
  }
  if (imageFile && imageFile instanceof File) {
    if (!imageFile.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
    }
    item.imageData = Buffer.from(await imageFile.arrayBuffer());
    item.imageMimeType = imageFile.type;
  }

  await item.save();
  revalidatePath("/");
  revalidatePath(`/api/home-highlights/${highlightId}/image`);
  return NextResponse.json({
    homeHighlight: serializeHomeHighlightAdmin({
      _id: item._id,
      alt: item.alt,
      sortOrder: item.sortOrder,
      imageData: item.imageData,
      imageMimeType: item.imageMimeType,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }),
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { highlightId } = await context.params;
  if (!Types.ObjectId.isValid(highlightId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  await connectToDb();
  const deleted = await HomeHighlight.findByIdAndDelete(highlightId);
  if (!deleted) {
    return NextResponse.json({ error: "Highlight not found." }, { status: 404 });
  }

  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
