import { NextRequest, NextResponse } from "next/server";
import { handle } from "@/lib/api";
import { requireUser } from "@/lib/auth/guards";
import { changePasswordSchema } from "@/lib/validators/user";
import { verifyPassword, hashPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";

export const PATCH = handle(async (req: NextRequest) => {
  const { user, session: currentSession } = await requireUser();
  const body = await req.json();
  const parsed = changePasswordSchema.parse(body);

  const isValidCurrent = await verifyPassword(user.passwordHash, parsed.currentPassword);
  if (!isValidCurrent) {
    throw new AppError("INVALID_CURRENT_PASSWORD", 400, "Current password is incorrect.");
  }

  const newHash = await hashPassword(parsed.newPassword);
  const now = new Date();

  // Transaction: update password and revoke all other sessions
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    }),
    prisma.session.updateMany({
      where: {
        userId: user.id,
        id: { not: currentSession.id },
        revokedAt: null,
      },
      data: { revokedAt: now },
    }),
  ]);

  return NextResponse.json({
    message: "Password changed successfully. All other active sessions have been revoked.",
  });
});
