import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import {
  Content,
  contentKinds,
  type ContentKind,
} from "@/lib/models/Content";
import { AppUser } from "@/lib/models/AppUser";

const MAX_FILE_BYTES = 12 * 1024 * 1024;

type RouteContext = {
  params: Promise<{ contentId: string }>;
};

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

function isContentKind(v: string): v is ContentKind {
  return contentKinds.includes(v as ContentKind);
}

function mimeMatchesKind(kind: ContentKind, mime: string): boolean {
  switch (kind) {
    case "image":
      return mime.startsWith("image/");
    case "pdf":
      return mime === "application/pdf";
    case "word":
      return (
        mime === "application/msword" ||
        mime ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
    default:
      return false;
  }
}

async function buildUserMap(ids: Types.ObjectId[]) {
  if (!ids.length) {
    return new Map<string, { name: string; email: string }>();
  }
  const users = await AppUser.find(
    { _id: { $in: ids } },
    { name: 1, email: 1 },
  ).lean();
  return new Map(
    users.map((u) => [
      String(u._id),
      { name: u.name, email: u.email },
    ]),
  );
}

function serialize(
  doc: {
    _id: unknown;
    title: string;
    kind: ContentKind;
    textBody: string;
    fileData?: Buffer;
    fileMimeType: string;
    originalFileName: string;
    allowedUserIds: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
  },
  userMap: Map<string, { name: string; email: string }>,
) {
  const allowedUserIds = doc.allowedUserIds.map((id) => String(id));
  const allowedUsers = allowedUserIds.map((id) => {
    const u = userMap.get(id);
    return { id, name: u?.name ?? "", email: u?.email ?? "" };
  });

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
    allowedUserIds,
    allowedUsers,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function GET(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { contentId } = await context.params;
  if (!Types.ObjectId.isValid(contentId)) {
    return NextResponse.json({ error: "Invalid content id." }, { status: 400 });
  }

  await connectToDb();
  const doc = await Content.findById(contentId);
  if (!doc) {
    return NextResponse.json({ error: "Content not found." }, { status: 404 });
  }

  const userMap = await buildUserMap(doc.allowedUserIds);
  return NextResponse.json({ content: serialize(doc, userMap) });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { contentId } = await context.params;
  if (!Types.ObjectId.isValid(contentId)) {
    return NextResponse.json({ error: "Invalid content id." }, { status: 400 });
  }

  await connectToDb();
  const doc = await Content.findById(contentId);
  if (!doc) {
    return NextResponse.json({ error: "Content not found." }, { status: 404 });
  }

  const formData = await request.formData();
  const title = formData.get("title");
  const textBody = formData.get("textBody");
  const userIdsRaw = formData.getAll("userIds");
  const file = formData.get("file");

  if (typeof title === "string" && title.trim()) {
    doc.title = title.trim();
  }

  if (doc.kind === "text" && typeof textBody === "string") {
    const t = textBody.trim();
    if (t.length < 1) {
      return NextResponse.json(
        { error: "Text content cannot be empty." },
        { status: 400 },
      );
    }
    doc.textBody = t;
  }

  const userIds = userIdsRaw
    .map((v) => String(v).trim())
    .filter((id) => Types.ObjectId.isValid(id));
  if (userIds.length < 1) {
    return NextResponse.json(
      { error: "Select at least one user who can access this content." },
      { status: 400 },
    );
  }
  const activeUsers = await AppUser.find({
    _id: { $in: userIds.map((id) => new Types.ObjectId(id)) },
    isActive: true,
  }).select("_id");
  if (activeUsers.length !== userIds.length) {
    return NextResponse.json(
      { error: "One or more selected users are invalid or inactive." },
      { status: 400 },
    );
  }
  doc.allowedUserIds = userIds.map((id) => new Types.ObjectId(id));

  if (doc.kind !== "text" && file instanceof File && file.size > 0) {
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: "File is too large (max 12 MB)." },
        { status: 400 },
      );
    }
    if (!mimeMatchesKind(doc.kind, file.type)) {
      return NextResponse.json(
        { error: "File type does not match content kind." },
        { status: 400 },
      );
    }
    doc.fileData = Buffer.from(await file.arrayBuffer());
    doc.fileMimeType = file.type;
    doc.originalFileName = file.name || doc.originalFileName;
  }

  await doc.save();
  const userMap = await buildUserMap(doc.allowedUserIds);
  return NextResponse.json({ content: serialize(doc, userMap) });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { contentId } = await context.params;
  if (!Types.ObjectId.isValid(contentId)) {
    return NextResponse.json({ error: "Invalid content id." }, { status: 400 });
  }

  await connectToDb();
  const deleted = await Content.findByIdAndDelete(contentId);
  if (!deleted) {
    return NextResponse.json({ error: "Content not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
