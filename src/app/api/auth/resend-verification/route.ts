import { NextRequest, NextResponse } from "next/server";
import { handle, getClientIp } from "@/lib/api";
import { resendVerificationSchema } from "@/lib/validators/auth";
import { prisma } from "@/lib/prisma";
import { generateRawToken, hashToken } from "@/lib/auth/tokens";
import { sendEmail } from "@/lib/mail";
import { checkRateLimit } from "@/lib/rate-limit";
import { env } from "@/lib/env";


export const POST = handle(async (req: NextRequest) => {
  const ip = getClientIp(req);
  const body = await req.json();
  const parsed = resendVerificationSchema.parse(body);

  checkRateLimit(`resend-verification:${ip}:${parsed.email}`, 3, 3600); // 3 per hour

  const user = await prisma.user.findUnique({
    where: { email: parsed.email },
    include: { profile: true },
  });

  // Always return identical success message to prevent user enumeration
  if (user && !user.emailVerifiedAt) {
    const rawToken = generateRawToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.$transaction([
      prisma.authToken.updateMany({
        where: {
          userId: user.id,
          type: "EMAIL_VERIFY",
          usedAt: null,
        },
        data: { usedAt: new Date() },
      }),
      prisma.authToken.create({
        data: {
          userId: user.id,
          type: "EMAIL_VERIFY",
          tokenHash,
          expiresAt,
        },
      }),
    ]);

    const verifyUrl = `${env.APP_URL}/api/auth/verify-email?token=${rawToken}`;
    await sendEmail({
      to: user.email,
      subject: "Verify your email - SlotSwap",
      text: `Hello ${user.profile?.name || "Student"},\n\nPlease verify your email by clicking the link below:\n${verifyUrl}\n\nThis link expires in 24 hours.`,
      html: `<p>Hello ${user.profile?.name || "Student"},</p><p>Please verify your email by clicking the link below:</p><p><a href="${verifyUrl}">Verify My Email</a></p><p>This link expires in 24 hours.</p>`,
    });
  }

  return NextResponse.json({
    message: "If that email is registered and unverified, a verification link has been sent.",
  });
});
