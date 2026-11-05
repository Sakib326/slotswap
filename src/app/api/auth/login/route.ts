import { NextRequest, NextResponse } from "next/server";
import { handle, getClientIp } from "@/lib/api";
import { loginSchema } from "@/lib/validators/auth";
import { prisma } from "@/lib/prisma";
import { verifyPassword, verifyDummyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { formatMeUser } from "@/lib/auth/user-format";
import { checkRateLimit, clearRateLimit } from "@/lib/rate-limit";
import { AppError } from "@/lib/errors";


export const POST = handle(async (req: NextRequest) => {
  const ip = getClientIp(req);
  const body = await req.json();
  const parsed = loginSchema.parse(body);

  const rateLimitKey = `login:${ip}:${parsed.email}`;
  // 5 failed attempts per 15 minutes per email+IP
  checkRateLimit(rateLimitKey, 5, 15 * 60);

  const user = await prisma.user.findUnique({
    where: { email: parsed.email },
    include: {
      profile: {
        include: {
          department: true,
        },
      },
    },
  });

  if (!user) {
    // Constant-time dummy verify
    await verifyDummyPassword(parsed.password);
    throw new AppError("INVALID_CREDENTIALS", 401, "Invalid email or password.");
  }

  const isValidPassword = await verifyPassword(user.passwordHash, parsed.password);
  if (!isValidPassword) {
    throw new AppError("INVALID_CREDENTIALS", 401, "Invalid email or password.");
  }

  if (!user.emailVerifiedAt) {
    throw new AppError(
      "EMAIL_NOT_VERIFIED",
      403,
      "Your email is not verified yet. Please verify your email before logging in."
    );
  }

  if (user.status === "SUSPENDED") {
    throw new AppError(
      "ACCOUNT_SUSPENDED",
      403,
      user.suspendedReason
        ? `Your account has been suspended: ${user.suspendedReason}`
        : "Your account has been suspended."
    );
  }

  // Clear failed login attempts on success
  clearRateLimit(rateLimitKey);

  const userAgent = req.headers.get("user-agent");

  // Create session and set cookie
  await createSession({
    userId: user.id,
    role: user.role,
    userAgent,
    ip,
  });

  // Update lastLoginAt
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  return NextResponse.json({
    user: formatMeUser(user),
  });
});
