import { NextRequest, NextResponse } from "next/server";
import { handle } from "@/lib/api";
import { resetPasswordSchema } from "@/lib/validators/auth";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/auth/tokens";
import { hashPassword } from "@/lib/auth/password";
import { AppError } from "@/lib/errors";


export const POST = handle(async (req: NextRequest) => {
  const body = await req.json();
  const parsed = resetPasswordSchema.parse(body);

  const tokenHash = hashToken(parsed.token);
  const authToken = await prisma.authToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!authToken || authToken.type !== "PASSWORD_RESET" || authToken.usedAt) {
    throw new AppError("INVALID_TOKEN", 400, "Invalid or already used password reset token.");
  }

  if (new Date() > authToken.expiresAt) {
    throw new AppError("INVALID_TOKEN", 400, "Password reset token has expired.");
  }

  const passwordHash = await hashPassword(parsed.newPassword);
  const now = new Date();

  // Transaction: update passwordHash, mark token used, revoke all user sessions
  await prisma.$transaction([
    prisma.user.update({
      where: { id: authToken.userId },
      data: { passwordHash },
    }),
    prisma.authToken.update({
      where: { id: authToken.id },
      data: { usedAt: now },
    }),
    prisma.session.updateMany({
      where: {
        userId: authToken.userId,
        revokedAt: null,
      },
      data: { revokedAt: now },
    }),
  ]);

  return NextResponse.json({
    message: "Password has been successfully reset. Please log in with your new password.",
  });
});
