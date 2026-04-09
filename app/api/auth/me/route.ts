import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { getAuthenticatedAdminFromCookies } from "@/lib/auth";
import { Admin } from "@/lib/models/Admin";

export async function GET() {
  const auth = await getAuthenticatedAdminFromCookies();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDb();
  const admin = await Admin.findById(auth.sub).lean();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!admin.isActive) {
    return NextResponse.json({ error: "Account is deactivated." }, { status: 403 });
  }

  return NextResponse.json({
    admin: {
      id: String(admin._id),
      name: admin.name,
      email: admin.email,
      isActive: admin.isActive,
    },
  });
}
