import { NextRequest } from "next/server";
import { env } from "@/lib/env";
import { verifyAccessToken } from "@/lib/auth";

export function getBearerToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice("Bearer ".length).trim();
}

export function authenticateRequest(request: NextRequest) {
  const cookieToken = request.cookies.get(env.adminAccessCookieName)?.value;
  const bearerToken = getBearerToken(request);
  const token = cookieToken ?? bearerToken;

  if (!token) {
    return null;
  }

  try {
    return verifyAccessToken(token);
  } catch {
    return null;
  }
}
