import { SignJWT, jwtVerify } from "jose";

export interface SessionJwtPayload {
  sid: string;
  sub: string;
  role: string;
}

function getJwtSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET || "default_auth_secret_minimum_32_chars_123456";
  return new TextEncoder().encode(secret);
}

export async function signSessionJwt(
  payload: SessionJwtPayload,
  expiryDays: number
): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${expiryDays}d`)
    .sign(getJwtSecret());
}

export async function verifySessionJwt(token: string): Promise<SessionJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    if (!payload.sid || !payload.sub || !payload.role) {
      return null;
    }
    return {
      sid: payload.sid as string,
      sub: payload.sub as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}
