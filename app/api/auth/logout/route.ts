import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clearAuthCookies } from "@/lib/auth";
import { env } from "@/lib/env";
import { revokeRefreshSession } from "@/lib/refresh-session";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(env.adminRefreshCookieName)?.value;
  if (refreshToken) {
    await revokeRefreshSession(refreshToken);
  }

  const response = NextResponse.json({ ok: true });
  clearAuthCookies(response);
  return response;
}
