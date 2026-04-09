import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { ResearchProject } from "@/lib/models/ResearchProject";

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

function toResponse(project: {
  _id: unknown;
  title: string;
  clgName: string;
  bugged: string;
  imageData: Buffer;
  imageMimeType: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: String(project._id),
    title: project.title,
    clgName: project.clgName,
    bugged: project.bugged,
    imageMimeType: project.imageMimeType,
    imageBase64: project.imageData.toString("base64"),
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  await connectToDb();
  const projects = await ResearchProject.find({}).sort({ createdAt: -1 }).lean();

  return NextResponse.json({
    researchProjects: projects.map(toResponse),
  });
}

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const formData = await request.formData();
  const title = String(formData.get("title") ?? "").trim();
  const clgName = String(formData.get("clgName") ?? "").trim();
  const bugged = String(formData.get("bugged") ?? "").trim();
  const imageFile = formData.get("image");

  if (!title || !clgName || !bugged) {
    return NextResponse.json(
      { error: "title, clgName, and bugged are required." },
      { status: 400 },
    );
  }
  if (!imageFile || !(imageFile instanceof File)) {
    return NextResponse.json({ error: "Image is required." }, { status: 400 });
  }
  if (!imageFile.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only image files are allowed." },
      { status: 400 },
    );
  }

  const imageData = Buffer.from(await imageFile.arrayBuffer());

  await connectToDb();
  const created = await ResearchProject.create({
    title,
    clgName,
    bugged,
    imageData,
    imageMimeType: imageFile.type,
  });

  return NextResponse.json(
    { researchProject: toResponse(created) },
    { status: 201 },
  );
}
