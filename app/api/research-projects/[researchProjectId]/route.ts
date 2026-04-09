import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { ResearchProject } from "@/lib/models/ResearchProject";

type RouteContext = {
  params: Promise<{ researchProjectId: string }>;
};

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

export async function GET(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { researchProjectId } = await context.params;
  if (!Types.ObjectId.isValid(researchProjectId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  await connectToDb();
  const project = await ResearchProject.findById(researchProjectId).lean();
  if (!project) {
    return NextResponse.json({ error: "Research project not found." }, { status: 404 });
  }

  return NextResponse.json({ researchProject: toResponse(project) });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { researchProjectId } = await context.params;
  if (!Types.ObjectId.isValid(researchProjectId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  await connectToDb();
  const project = await ResearchProject.findById(researchProjectId);
  if (!project) {
    return NextResponse.json({ error: "Research project not found." }, { status: 404 });
  }

  const formData = await request.formData();
  const title = String(formData.get("title") ?? "").trim();
  const clgName = String(formData.get("clgName") ?? "").trim();
  const bugged = String(formData.get("bugged") ?? "").trim();
  const imageFile = formData.get("image");

  if (title) project.title = title;
  if (clgName) project.clgName = clgName;
  if (bugged) project.bugged = bugged;
  if (imageFile instanceof File) {
    if (!imageFile.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed." },
        { status: 400 },
      );
    }
    project.imageData = Buffer.from(await imageFile.arrayBuffer());
    project.imageMimeType = imageFile.type;
  }

  await project.save();
  return NextResponse.json({ researchProject: toResponse(project) });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return forbidden();
  }

  const { researchProjectId } = await context.params;
  if (!Types.ObjectId.isValid(researchProjectId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  await connectToDb();
  const deleted = await ResearchProject.findByIdAndDelete(researchProjectId);
  if (!deleted) {
    return NextResponse.json({ error: "Research project not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
