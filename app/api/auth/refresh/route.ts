import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import {
  clearAuthCookies,
  setAuthCookies,
  signAccessToken,
  verifyRefreshToken,
} from "@/lib/auth";
import { env } from "@/lib/env";
import { Admin } from "@/lib/models/Admin";
import { RefreshSession } from "@/lib/models/RefreshSession";
import { createRefreshSession } from "@/lib/refresh-session";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(env.adminRefreshCookieName)?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: ReturnType<typeof verifyRefreshToken>;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    clearAuthCookies(response);
    return response;
  }

  await connectToDb();
  const session = await RefreshSession.findOne({
    tokenId: payload.tokenId,
    adminId: payload.sub,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });
  if (!session) {
    const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    clearAuthCookies(response);
    return response;
  }

  const admin = await Admin.findById(payload.sub).lean();
  if (!admin || !admin.isActive) {
    await RefreshSession.updateOne(
      { _id: session._id, revokedAt: null },
      { $set: { revokedAt: new Date() } },
    );
    const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    clearAuthCookies(response);
    return response;
  }

  await RefreshSession.updateOne(
    { _id: session._id, revokedAt: null },
    { $set: { revokedAt: new Date() } },
  );

  const accessToken = signAccessToken({
    sub: String(admin._id),
    email: admin.email,
    role: "admin",
  });
  const rotated = await createRefreshSession(String(admin._id), admin.email);

  const response = NextResponse.json({ ok: true });
  setAuthCookies(response, accessToken, rotated.refreshToken);
  return response;
}
