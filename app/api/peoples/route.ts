import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { People } from "@/lib/models/People";

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

export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  await connectToDb();
  const peoples = await People.find({}).sort({ createdAt: -1 }).lean();

  return NextResponse.json({
    peoples: peoples.map(serialize),
  });
}

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

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

  if (
    !name ||
    !title ||
    !department ||
    !email ||
    !researchInterests ||
    !profileUrl1 ||
    !profileUrl2 ||
    !profileImage ||
    !(profileImage instanceof File)
  ) {
    return NextResponse.json(
      {
        error:
          "name, title, department, email, researchInterests, profileImage, profileUrl1 and profileUrl2 are required.",
      },
      { status: 400 },
    );
  }
  if (!profileImage.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Profile image must be an image file." },
      { status: 400 },
    );
  }
  const profileImageBuffer = Buffer.from(await profileImage.arrayBuffer());

  await connectToDb();
  const created = await People.create({
    name,
    title,
    department,
    email,
    researchInterests,
    profileImageData: profileImageBuffer,
    profileImageMimeType: profileImage.type,
    profileUrl1,
    profileUrl2,
  });

  return NextResponse.json(
    {
      people: serialize(created),
    },
    { status: 201 },
  );
}
