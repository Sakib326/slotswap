import { NextRequest, NextResponse } from "next/server";
import { handle } from "@/lib/api";
import { requireRole } from "@/lib/auth/guards";
import { formatMeUser } from "@/lib/auth/user-format";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";


export const GET = handle(async (_req: NextRequest, ctx?: { params: Promise<Record<string, string>> }) => {
  await requireRole("ADMIN");
  const params = await ctx?.params;
  const id = params?.id;

  if (!id) throw new AppError("NOT_FOUND", 404, "User not found.");

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: {
        include: {
          department: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError("NOT_FOUND", 404, "User not found.");
  }

  const activeSessionCount = await prisma.session.count({
    where: {
      userId: user.id,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
  });

  return NextResponse.json({
    ...formatMeUser(user),
    activeSessionCount,
  });
});

export const DELETE = handle(async (_req: NextRequest, ctx?: { params: Promise<Record<string, string>> }) => {
  const { user: currentAdmin } = await requireRole("ADMIN");
  const params = await ctx?.params;
  const id = params?.id;

  if (!id) throw new AppError("NOT_FOUND", 404, "User not found.");

  // Safety rule: Admin cannot delete themselves
  if (currentAdmin.id === id) {
    throw new AppError("FORBIDDEN", 403, "Admins cannot delete their own account.");
  }

  const targetUser = await prisma.user.findUnique({ where: { id } });
  if (!targetUser) {
    throw new AppError("NOT_FOUND", 404, "User not found.");
  }

  // Safety rule: Never allow leaving zero active admins
  if (targetUser.role === "ADMIN" && targetUser.status === "ACTIVE") {
    const activeAdminCount = await prisma.user.count({
      where: { role: "ADMIN", status: "ACTIVE" },
    });
    if (activeAdminCount <= 1) {
      throw new AppError("LAST_ADMIN", 409, "Cannot delete the last active administrator.");
    }
  }

  // Hard delete cascades to Profile, Session, AuthToken
  await prisma.user.delete({
    where: { id },
  });

  return NextResponse.json({
    message: "User deleted successfully.",
  });
});
