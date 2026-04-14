import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import {
  clearUserAuthCookies,
  setUserAuthCookies,
  signAccessToken,
  verifyRefreshToken,
} from "@/lib/auth";
import { env } from "@/lib/env";
import { AppUser } from "@/lib/models/AppUser";
import { UserRefreshSession } from "@/lib/models/UserRefreshSession";
import { createUserRefreshSession } from "@/lib/user-refresh-session";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(env.userRefreshCookieName)?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: ReturnType<typeof verifyRefreshToken>;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    clearUserAuthCookies(response);
    return response;
  }

  if (payload.role !== "user") {
    const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    clearUserAuthCookies(response);
    return response;
  }

  await connectToDb();
  const session = await UserRefreshSession.findOne({
    tokenId: payload.tokenId,
    userId: payload.sub,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });
  if (!session) {
    const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    clearUserAuthCookies(response);
    return response;
  }

  const user = await AppUser.findById(payload.sub).lean();
  if (!user || !user.isActive) {
    await UserRefreshSession.updateOne(
      { _id: session._id, revokedAt: null },
      { $set: { revokedAt: new Date() } },
    );
    const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    clearUserAuthCookies(response);
    return response;
  }

  await UserRefreshSession.updateOne(
    { _id: session._id, revokedAt: null },
    { $set: { revokedAt: new Date() } },
  );

  const accessToken = signAccessToken({
    sub: String(user._id),
    email: user.email,
    role: "user",
  });
  const rotated = await createUserRefreshSession(String(user._id), user.email);

  const response = NextResponse.json({ ok: true });
  setUserAuthCookies(response, accessToken, rotated.refreshToken);
  return response;
}
