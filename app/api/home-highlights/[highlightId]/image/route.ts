import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";
import { toImageBuffer } from "@/lib/image-buffer";
import { HomeHighlight } from "@/lib/models/HomeHighlight";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ highlightId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { highlightId } = await context.params;
    if (!Types.ObjectId.isValid(highlightId)) {
      return new NextResponse(null, { status: 404 });
    }

    const doc = await dbQuery(() =>
      HomeHighlight.findById(highlightId).select("imageData imageMimeType").lean(),
    );

    if (!doc) {
      return new NextResponse(null, { status: 404 });
    }

    const body = toImageBuffer(doc.imageData);
    if (!body.length) {
      return new NextResponse(null, { status: 404 });
    }

    return new NextResponse(new Uint8Array(body), {
      status: 200,
      headers: {
        "Content-Type": doc.imageMimeType || "image/jpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("home-highlights image:", error);
    return new NextResponse(null, { status: 500 });
  }
}
