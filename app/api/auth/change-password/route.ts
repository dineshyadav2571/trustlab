import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { authenticateRequest } from "@/lib/auth-guard";
import { clearAuthCookies, hashPassword, verifyPassword } from "@/lib/auth";
import { Admin } from "@/lib/models/Admin";
import { RefreshSession } from "@/lib/models/RefreshSession";

type ChangePasswordBody = {
  currentPassword?: string;
  newPassword?: string;
};

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as ChangePasswordBody;
  const currentPassword = body.currentPassword ?? "";
  const newPassword = body.newPassword ?? "";
  if (!currentPassword || newPassword.length < 8) {
    return NextResponse.json(
      { error: "Current password and new password (min 8 chars) are required." },
      { status: 400 },
    );
  }

  await connectToDb();
  const admin = await Admin.findById(auth.sub);
  if (!admin || !admin.isActive) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ok = await verifyPassword(currentPassword, admin.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
  }
  admin.passwordHash = await hashPassword(newPassword);
  await admin.save();

  await RefreshSession.updateMany(
    { adminId: admin._id, revokedAt: null },
    { $set: { revokedAt: new Date() } },
  );

  const response = NextResponse.json({
    ok: true,
    message: "Password changed successfully. Please login again.",
  });
  clearAuthCookies(response);
  return response;
}
