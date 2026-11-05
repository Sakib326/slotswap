import { cookies } from "next/headers";
import { prisma } from "../prisma";
import { env } from "../env";
import { signSessionJwt } from "./jwt";
import { UAParser } from "ua-parser-js";

export const SESSION_COOKIE_NAME = "slotswap_session";

export async function createSession({
  userId,
  role,
  userAgent,
  ip,
}: {
  userId: string;
  role: string;
  userAgent?: string | null;
  ip?: string | null;
}) {
  const expiresAt = new Date(Date.now() + env.SESSION_DAYS * 24 * 60 * 60 * 1000);

  const session = await prisma.session.create({
    data: {
      userId,
      userAgent: userAgent || null,
      ip: ip || null,
      expiresAt,
    },
  });

  const jwt = await signSessionJwt(
    {
      sid: session.id,
      sub: userId,
      role,
    },
    env.SESSION_DAYS
  );

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: env.SESSION_DAYS * 24 * 60 * 60,
  });

  return session;
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function parseDeviceString(ua?: string | null): string {
  if (!ua) return "Unknown device";
  const parser = new UAParser(ua);
  const browser = parser.getBrowser().name || "Browser";
  const os = parser.getOS().name || "Device";
  return `${browser} on ${os}`;
}
