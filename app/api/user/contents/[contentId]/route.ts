import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateUserRequest } from "@/lib/auth-guard";
import { Content, type ContentKind } from "@/lib/models/Content";
import { AppUser } from "@/lib/models/AppUser";

type RouteContext = {
  params: Promise<{ contentId: string }>;
};

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

function serializeDetail(doc: {
  _id: unknown;
  title: string;
  kind: ContentKind;
  textBody: string;
  fileData?: Buffer;
  fileMimeType: string;
  originalFileName: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: String(doc._id),
    title: doc.title,
    kind: doc.kind,
    textBody: doc.kind === "text" ? doc.textBody : "",
    fileMimeType: doc.fileMimeType || "",
    originalFileName: doc.originalFileName || "",
    fileBase64:
      doc.kind !== "text" && doc.fileData && doc.fileData.length
        ? doc.fileData.toString("base64")
        : "",
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function GET(request: NextRequest, context: RouteContext) {
  const auth = authenticateUserRequest(request);
  if (!auth) {
    return forbidden();
  }

  const { contentId } = await context.params;
  if (!Types.ObjectId.isValid(contentId)) {
    return NextResponse.json({ error: "Invalid content id." }, { status: 400 });
  }

  await connectToDb();
  const user = await AppUser.findById(auth.sub).select("isActive").lean();
  if (!user || !user.isActive) {
    return forbidden();
  }

  const uid = new Types.ObjectId(auth.sub);
  const doc = await Content.findOne({
    _id: new Types.ObjectId(contentId),
    allowedUserIds: uid,
  });
  if (!doc) {
    return NextResponse.json({ error: "Content not found." }, { status: 404 });
  }

  return NextResponse.json({ content: serializeDetail(doc) });
}
