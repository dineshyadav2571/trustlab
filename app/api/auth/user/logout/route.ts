import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { clearUserAuthCookies } from "@/lib/auth";
import { env } from "@/lib/env";
import { revokeUserRefreshSessionFromToken } from "@/lib/user-refresh-session";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(env.userRefreshCookieName)?.value;
  if (refreshToken) {
    await revokeUserRefreshSessionFromToken(refreshToken);
  }

  const response = NextResponse.json({ ok: true });
  clearUserAuthCookies(response);
  return response;
}
