import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";
import { toImageBuffer } from "@/lib/image-buffer";
import { WebsiteData } from "@/lib/models/WebsiteData";

export const dynamic = "force-dynamic";

const SLOTS = ["lead", "branding", "about"] as const;
type ImageSlot = (typeof SLOTS)[number];

function isImageSlot(value: string): value is ImageSlot {
  return SLOTS.includes(value as ImageSlot);
}

type RouteContext = { params: Promise<{ slot: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slot } = await context.params;
    if (!isImageSlot(slot)) {
      return new NextResponse(null, { status: 404 });
    }

    const doc = await dbQuery(() => WebsiteData.findOne().lean());
    if (!doc) {
      return new NextResponse(null, { status: 404 });
    }

    let imageMimeType = "";
    let imageData: unknown;

    if (slot === "lead") {
      imageMimeType = doc.lead?.imageMimeType ?? "";
      imageData = doc.lead?.imageData;
    } else if (slot === "branding") {
      imageMimeType = doc.branding?.iconMimeType ?? "";
      imageData = doc.branding?.iconData;
    } else {
      imageMimeType = doc.about?.imageMimeType ?? "";
      imageData = doc.about?.imageData;
    }

    const body = toImageBuffer(imageData);
    if (!body.length) {
      return new NextResponse(null, { status: 404 });
    }

    return new NextResponse(new Uint8Array(body), {
      status: 200,
      headers: {
        "Content-Type": imageMimeType || "image/jpeg",
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (error) {
    console.error("website-data image:", error);
    return new NextResponse(null, { status: 500 });
  }
}
