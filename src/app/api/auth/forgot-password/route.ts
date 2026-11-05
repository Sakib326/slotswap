import { NextRequest, NextResponse } from "next/server";
import { handle, getClientIp } from "@/lib/api";
import { forgotPasswordSchema } from "@/lib/validators/auth";
import { prisma } from "@/lib/prisma";
import { generateRawToken, hashToken } from "@/lib/auth/tokens";
import { sendEmail } from "@/lib/mail";
import { checkRateLimit } from "@/lib/rate-limit";
import { env } from "@/lib/env";


export const POST = handle(async (req: NextRequest) => {
  const ip = getClientIp(req);
  const body = await req.json();
  const parsed = forgotPasswordSchema.parse(body);

  checkRateLimit(`forgot-password:${ip}:${parsed.email}`, 3, 3600); // 3 per hour

  const user = await prisma.user.findUnique({
    where: { email: parsed.email },
    include: { profile: true },
  });

  // Always return identical success message to prevent user enumeration
  if (user && user.status === "ACTIVE") {
    const rawToken = generateRawToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h

    await prisma.$transaction([
      prisma.authToken.updateMany({
        where: {
          userId: user.id,
          type: "PASSWORD_RESET",
          usedAt: null,
        },
        data: { usedAt: new Date() },
      }),
      prisma.authToken.create({
        data: {
          userId: user.id,
          type: "PASSWORD_RESET",
          tokenHash,
          expiresAt,
        },
      }),
    ]);

    const resetUrl = `${env.APP_URL}/reset-password?token=${rawToken}`;
    await sendEmail({
      to: user.email,
      subject: "Reset your password - SlotSwap",
      text: `Hello ${user.profile?.name || "Student"},\n\nYou requested to reset your password. Click the link below:\n${resetUrl}\n\nThis link is valid for 1 hour. If you didn't request this, ignore this email.`,
      html: `<p>Hello ${user.profile?.name || "Student"},</p><p>You requested to reset your password. Click the link below:</p><p><a href="${resetUrl}">Reset Password</a></p><p>This link is valid for 1 hour. If you didn't request this, ignore this email.</p>`,
    });
  }

  return NextResponse.json({
    message: "If an active account exists for that email, a password reset link has been sent.",
  });
});
