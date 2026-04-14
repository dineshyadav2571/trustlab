import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import {
  Content,
  contentKinds,
  type ContentDocument,
  type ContentKind,
} from "@/lib/models/Content";
import { AppUser } from "@/lib/models/AppUser";

const MAX_FILE_BYTES = 12 * 1024 * 1024;

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

function serialize(
  doc: ContentDocument & { _id: unknown },
  userMap: Map<string, { name: string; email: string }>,
) {
  const allowedUserIds = doc.allowedUserIds.map((id) => String(id));
  const allowedUsers = allowedUserIds.map((id) => {
    const u = userMap.get(id);
    return {
      id,
      name: u?.name ?? "",
      email: u?.email ?? "",
    };
  });

  const base = {
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
  return base;
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

export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  await connectToDb();
  const docs = await Content.find({}).sort({ createdAt: -1 });
  const allIds = [
    ...new Set(
      docs.flatMap((d) => d.allowedUserIds.map((id) => String(id))),
    ),
  ].map((id) => new Types.ObjectId(id));
  const userMap = await buildUserMap(allIds);

  return NextResponse.json({
    contents: docs.map((d) => serialize(d, userMap)),
  });
}

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const formData = await request.formData();
  const title = String(formData.get("title") ?? "").trim();
  const kindRaw = String(formData.get("kind") ?? "").trim();
  const textBody = String(formData.get("textBody") ?? "");
  const rawUserIds = formData.getAll("userIds");
  const userIds = rawUserIds
    .map((v) => String(v).trim())
    .filter((id) => Types.ObjectId.isValid(id));

  if (!title || !isContentKind(kindRaw)) {
    return NextResponse.json(
      { error: "Title and a valid kind (text, image, pdf, word) are required." },
      { status: 400 },
    );
  }

  if (userIds.length === 0) {
    return NextResponse.json(
      { error: "Select at least one user who can access this content." },
      { status: 400 },
    );
  }

  const kind = kindRaw;

  await connectToDb();
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

  if (kind === "text") {
    const trimmed = textBody.trim();
    if (trimmed.length < 1) {
      return NextResponse.json(
        { error: "Text content is required for type “text”." },
        { status: 400 },
      );
    }

    const created = await Content.create({
      title,
      kind,
      textBody: trimmed,
      fileMimeType: "",
      originalFileName: "",
      allowedUserIds: userIds.map((id) => new Types.ObjectId(id)),
    });

    const userMap = await buildUserMap(created.allowedUserIds);
    return NextResponse.json(
      { content: serialize(created, userMap) },
      { status: 201 },
    );
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "A file is required for image, pdf, or word content." },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      { error: "File is too large (max 12 MB)." },
      { status: 400 },
    );
  }

  if (!mimeMatchesKind(kind, file.type)) {
    return NextResponse.json(
      {
        error:
          "File type does not match selected kind (image, PDF, or Word document).",
      },
      { status: 400 },
    );
  }

  const buf = Buffer.from(await file.arrayBuffer());

  const created = await Content.create({
    title,
    kind,
    textBody: "",
    fileData: buf,
    fileMimeType: file.type,
    originalFileName: file.name || "file",
    allowedUserIds: userIds.map((id) => new Types.ObjectId(id)),
  });

  const userMap = await buildUserMap(created.allowedUserIds);
  return NextResponse.json(
    { content: serialize(created, userMap) },
    { status: 201 },
  );
}
