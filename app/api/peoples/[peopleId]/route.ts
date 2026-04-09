import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { People } from "@/lib/models/People";

type RouteContext = {
  params: Promise<{ peopleId: string }>;
};

type UpdatePeopleBody = {
  name?: string;
  title?: string;
  department?: string;
  email?: string;
  researchInterests?: string;
  profileUrl1?: string;
  profileUrl2?: string;
};

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

function serialize(item: {
  _id: unknown;
  name: string;
  title: string;
  department: string;
  email: string;
  researchInterests: string;
  profileImageData: Buffer;
  profileImageMimeType: string;
  profileUrl1: string;
  profileUrl2: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: String(item._id),
    name: item.name,
    title: item.title,
    department: item.department,
    email: item.email,
    researchInterests: item.researchInterests,
    profileImageMimeType: item.profileImageMimeType,
    profileImageBase64: item.profileImageData.toString("base64"),
    profileUrl1: item.profileUrl1,
    profileUrl2: item.profileUrl2,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export async function GET(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { peopleId } = await context.params;
  if (!Types.ObjectId.isValid(peopleId)) {
    return NextResponse.json({ error: "Invalid people id." }, { status: 400 });
  }

  await connectToDb();
  const item = await People.findById(peopleId).lean();
  if (!item) {
    return NextResponse.json({ error: "People not found." }, { status: 404 });
  }

  return NextResponse.json({
    people: serialize(item),
  });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { peopleId } = await context.params;
  if (!Types.ObjectId.isValid(peopleId)) {
    return NextResponse.json({ error: "Invalid people id." }, { status: 400 });
  }

  const contentType = request.headers.get("content-type") ?? "";

  await connectToDb();
  const item = await People.findById(peopleId);
  if (!item) {
    return NextResponse.json({ error: "People not found." }, { status: 404 });
  }

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const name = String(formData.get("name") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const department = String(formData.get("department") ?? "").trim();
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    const researchInterests = String(formData.get("researchInterests") ?? "").trim();
    const profileUrl1 = String(formData.get("profileUrl1") ?? "").trim();
    const profileUrl2 = String(formData.get("profileUrl2") ?? "").trim();
    const profileImage = formData.get("profileImage");

    if (name) item.name = name;
    if (title) item.title = title;
    if (department) item.department = department;
    if (email) item.email = email;
    if (researchInterests) item.researchInterests = researchInterests;
    if (profileUrl1) item.profileUrl1 = profileUrl1;
    if (profileUrl2) item.profileUrl2 = profileUrl2;
    if (profileImage instanceof File) {
      if (!profileImage.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Profile image must be an image file." },
          { status: 400 },
        );
      }
      item.profileImageData = Buffer.from(await profileImage.arrayBuffer());
      item.profileImageMimeType = profileImage.type;
    }
  } else {
    const body = (await request.json()) as UpdatePeopleBody;
    if (typeof body.name === "string" && body.name.trim()) {
      item.name = body.name.trim();
    }
    if (typeof body.title === "string" && body.title.trim()) {
      item.title = body.title.trim();
    }
    if (typeof body.department === "string" && body.department.trim()) {
      item.department = body.department.trim();
    }
    if (typeof body.email === "string" && body.email.trim()) {
      item.email = body.email.trim().toLowerCase();
    }
    if (
      typeof body.researchInterests === "string" &&
      body.researchInterests.trim()
    ) {
      item.researchInterests = body.researchInterests.trim();
    }
    if (typeof body.profileUrl1 === "string" && body.profileUrl1.trim()) {
      item.profileUrl1 = body.profileUrl1.trim();
    }
    if (typeof body.profileUrl2 === "string" && body.profileUrl2.trim()) {
      item.profileUrl2 = body.profileUrl2.trim();
    }
  }

  await item.save();

  return NextResponse.json({
    people: serialize(item),
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { peopleId } = await context.params;
  if (!Types.ObjectId.isValid(peopleId)) {
    return NextResponse.json({ error: "Invalid people id." }, { status: 400 });
  }

  await connectToDb();
  const deleted = await People.findByIdAndDelete(peopleId);
  if (!deleted) {
    return NextResponse.json({ error: "People not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
