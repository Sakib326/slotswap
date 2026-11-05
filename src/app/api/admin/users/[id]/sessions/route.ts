import { NextRequest, NextResponse } from "next/server";
import { handle } from "@/lib/api";
import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { parseDeviceString } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";


export const GET = handle(async (_req: NextRequest, ctx?: { params: Promise<Record<string, string>> }) => {
  await requireRole("ADMIN");
  const params = await ctx?.params;
  const id = params?.id;

  if (!id) throw new AppError("NOT_FOUND", 404, "User not found.");

  const targetUser = await prisma.user.findUnique({ where: { id } });
  if (!targetUser) throw new AppError("NOT_FOUND", 404, "User not found.");

  const sessions = await prisma.session.findMany({
    where: {
      userId: id,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  const list = sessions.map((s) => ({
    id: s.id,
    device: parseDeviceString(s.userAgent),
    ip: s.ip || "Unknown IP",
    createdAt: s.createdAt,
    lastActiveAt: s.lastActiveAt,
  }));

  return NextResponse.json(list);
});

export const DELETE = handle(async (_req: NextRequest, ctx?: { params: Promise<Record<string, string>> }) => {
  await requireRole("ADMIN");
  const params = await ctx?.params;
  const id = params?.id;

  if (!id) throw new AppError("NOT_FOUND", 404, "User not found.");

  const targetUser = await prisma.user.findUnique({ where: { id } });
  if (!targetUser) throw new AppError("NOT_FOUND", 404, "User not found.");

  const result = await prisma.session.updateMany({
    where: {
      userId: id,
      revokedAt: null,
    },
    data: { revokedAt: new Date() },
  });

  return NextResponse.json({
    message: `Revoked all ${result.count} active sessions for this user.`,
    revokedCount: result.count,
  });
});
