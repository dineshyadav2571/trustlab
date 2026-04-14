import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateUserRequest } from "@/lib/auth-guard";
import { AppUser } from "@/lib/models/AppUser";
import { Content, type ContentDocument, type ContentKind } from "@/lib/models/Content";

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

function serializeListItem(
  doc: ContentDocument & { _id: unknown },
): {
  id: string;
  title: string;
  kind: ContentKind;
  textBody: string;
  fileMimeType: string;
  originalFileName: string;
  createdAt: Date;
  updatedAt: Date;
} {
  return {
    id: String(doc._id),
    title: doc.title,
    kind: doc.kind,
    textBody: doc.kind === "text" ? doc.textBody : "",
    fileMimeType: doc.fileMimeType || "",
    originalFileName: doc.originalFileName || "",
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function GET(request: NextRequest) {
  const auth = authenticateUserRequest(request);
  if (!auth) {
    return forbidden();
  }

  await connectToDb();
  const user = await AppUser.findById(auth.sub).select("isActive").lean();
  if (!user || !user.isActive) {
    return forbidden();
  }

  const uid = new Types.ObjectId(auth.sub);
  const docs = await Content.find({ allowedUserIds: uid }).sort({ createdAt: -1 });

  return NextResponse.json({
    contents: docs.map((d) => serializeListItem(d)),
  });
}
