import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { Admin } from "@/lib/models/Admin";
import { setAuthCookies, signAccessToken, verifyPassword } from "@/lib/auth";
import { createRefreshSession } from "@/lib/refresh-session";

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBody;
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  await connectToDb();
  const admin = await Admin.findOne({ email }).lean();

  if (!admin) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  if (!admin.isActive) {
    return NextResponse.json({ error: "Account is deactivated." }, { status: 403 });
  }

  const passwordMatches = await verifyPassword(password, admin.passwordHash);

  if (!passwordMatches) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const accessToken = signAccessToken({
    sub: String(admin._id),
    email: admin.email,
    role: "admin",
  });
  const { refreshToken } = await createRefreshSession(
    String(admin._id),
    admin.email,
  );

  const response = NextResponse.json({
    admin: {
      id: String(admin._id),
      name: admin.name,
      email: admin.email,
    },
  });

  setAuthCookies(response, accessToken, refreshToken);

  return response;
}
