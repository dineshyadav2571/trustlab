import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export type AccessTokenPayload = {
  sub: string;
  email: string;
  role: "admin";
  type: "access";
};

export type RefreshTokenPayload = {
  sub: string;
  email: string;
  role: "admin";
  type: "refresh";
  tokenId: string;
};

export async function hashPassword(rawPassword: string) {
  return bcrypt.hash(rawPassword, 12);
}

export async function verifyPassword(rawPassword: string, hash: string) {
  return bcrypt.compare(rawPassword, hash);
}

export function hashToken(rawToken: string) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export function createRandomToken(bytes = 48) {
  return crypto.randomBytes(bytes).toString("hex");
}

function parseDurationToSeconds(duration: string) {
  const match = /^(\d+)([smhd])$/i.exec(duration.trim());
  if (!match) {
    throw new Error(`Unsupported duration format: ${duration}`);
  }
  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multiplier =
    unit === "s" ? 1 : unit === "m" ? 60 : unit === "h" ? 3600 : 86400;
  return amount * multiplier;
}

export function getAccessTokenMaxAgeSeconds() {
  return parseDurationToSeconds(env.jwtAccessExpiresIn);
}

export function getRefreshTokenMaxAgeSeconds() {
  return parseDurationToSeconds(env.jwtRefreshExpiresIn);
}

export function signAccessToken(payload: Omit<AccessTokenPayload, "type">) {
  return jwt.sign({ ...payload, type: "access" }, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiresIn as jwt.SignOptions["expiresIn"],
  });
}

export function signRefreshToken(payload: Omit<RefreshTokenPayload, "type">) {
  return jwt.sign({ ...payload, type: "refresh" }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn as jwt.SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string) {
  const decoded = jwt.verify(token, env.jwtAccessSecret) as AccessTokenPayload;
  if (decoded.type !== "access") {
    throw new Error("Invalid access token type");
  }
  return decoded;
}

export function verifyRefreshToken(token: string) {
  const decoded = jwt.verify(token, env.jwtRefreshSecret) as RefreshTokenPayload;
  if (decoded.type !== "refresh") {
    throw new Error("Invalid refresh token type");
  }
  return decoded;
}

export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
) {
  const common = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
  };
  response.cookies.set(env.adminAccessCookieName, accessToken, {
    ...common,
    maxAge: getAccessTokenMaxAgeSeconds(),
  });
  response.cookies.set(env.adminRefreshCookieName, refreshToken, {
    ...common,
    maxAge: getRefreshTokenMaxAgeSeconds(),
  });
}

export function clearAuthCookies(response: NextResponse) {
  const common = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 0,
    path: "/",
  };
  response.cookies.set(env.adminAccessCookieName, "", common);
  response.cookies.set(env.adminRefreshCookieName, "", common);
}

export async function getAuthenticatedAdminFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(env.adminAccessCookieName)?.value;

  if (!token) {
    return null;
  }

  try {
    return verifyAccessToken(token);
  } catch {
    return null;
  }
}
