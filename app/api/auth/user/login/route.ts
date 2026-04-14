import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { AppUser } from "@/lib/models/AppUser";
import { setUserAuthCookies, signAccessToken, verifyPassword } from "@/lib/auth";
import { createUserRefreshSession } from "@/lib/user-refresh-session";

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
      { error: "Client ID (email) and password are required." },
      { status: 400 },
    );
  }

  await connectToDb();
  const user = await AppUser.findOne({ email }).lean();

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  if (!user.isActive) {
    return NextResponse.json({ error: "Account is deactivated." }, { status: 403 });
  }

  const passwordMatches = await verifyPassword(password, user.passwordHash);

  if (!passwordMatches) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const accessToken = signAccessToken({
    sub: String(user._id),
    email: user.email,
    role: "user",
  });
  const { refreshToken } = await createUserRefreshSession(
    String(user._id),
    user.email,
  );

  const response = NextResponse.json({
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
    },
  });

  setUserAuthCookies(response, accessToken, refreshToken);

  return response;
}
