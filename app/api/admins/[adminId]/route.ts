import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { Admin } from "@/lib/models/Admin";
import { RefreshSession } from "@/lib/models/RefreshSession";

type RouteContext = {
  params: Promise<{ adminId: string }>;
};

type UpdateAdminBody = {
  isActive?: boolean;
};

function unauthorized() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return unauthorized();
  }

  const { adminId } = await context.params;
  if (!Types.ObjectId.isValid(adminId)) {
    return NextResponse.json({ error: "Invalid admin id." }, { status: 400 });
  }

  const body = (await request.json()) as UpdateAdminBody;
  if (typeof body.isActive !== "boolean") {
    return NextResponse.json({ error: "isActive must be boolean." }, { status: 400 });
  }

  await connectToDb();
  const target = await Admin.findById(adminId);
  if (!target) {
    return NextResponse.json({ error: "Admin not found." }, { status: 404 });
  }

  if (target.isActive && !body.isActive) {
    const activeCount = await Admin.countDocuments({ isActive: true });
    if (activeCount <= 1) {
      return NextResponse.json(
        { error: "Cannot deactivate the last active admin." },
        { status: 400 },
      );
    }
  }

  target.isActive = body.isActive;
  await target.save();

  if (!target.isActive) {
    await RefreshSession.updateMany(
      { adminId: target._id, revokedAt: null },
      { $set: { revokedAt: new Date() } },
    );
  }

  return NextResponse.json({
    admin: {
      id: String(target._id),
      name: target.name,
      email: target.email,
      isActive: target.isActive,
      createdAt: target.createdAt,
    },
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return unauthorized();
  }

  const { adminId } = await context.params;
  if (!Types.ObjectId.isValid(adminId)) {
    return NextResponse.json({ error: "Invalid admin id." }, { status: 400 });
  }
  if (auth.sub === adminId) {
    return NextResponse.json(
      { error: "You cannot delete your own account." },
      { status: 400 },
    );
  }

  await connectToDb();
  const target = await Admin.findById(adminId);
  if (!target) {
    return NextResponse.json({ error: "Admin not found." }, { status: 404 });
  }

  const totalAdmins = await Admin.countDocuments();
  if (totalAdmins <= 1) {
    return NextResponse.json(
      { error: "Cannot delete the last admin." },
      { status: 400 },
    );
  }

  await RefreshSession.updateMany(
    { adminId: target._id, revokedAt: null },
    { $set: { revokedAt: new Date() } },
  );
  await Admin.deleteOne({ _id: target._id });

  return NextResponse.json({ ok: true });
}
