import { NextRequest, NextResponse } from "next/server";
import { handle } from "@/lib/api";
import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import { z } from "zod";


const statusSchema = z.object({
  status: z.enum(["ACTIVE", "SUSPENDED"]),
  reason: z.string().trim().max(255).optional(),
});

export const PATCH = handle(async (req: NextRequest, ctx?: { params: Promise<Record<string, string>> }) => {
  const { user: currentAdmin } = await requireRole("ADMIN");
  const params = await ctx?.params;
  const id = params?.id;

  if (!id) throw new AppError("NOT_FOUND", 404, "User not found.");

  // Safety rule: Admin cannot change own status
  if (currentAdmin.id === id) {
    throw new AppError("FORBIDDEN", 403, "Admins cannot change their own account status.");
  }

  const body = await req.json();
  const parsed = statusSchema.parse(body);

  const targetUser = await prisma.user.findUnique({ where: { id } });
  if (!targetUser) {
    throw new AppError("NOT_FOUND", 404, "User not found.");
  }

  // Safety rule: Never leave zero active admins when suspending
  if (targetUser.role === "ADMIN" && parsed.status === "SUSPENDED" && targetUser.status === "ACTIVE") {
    const activeAdminCount = await prisma.user.count({
      where: { role: "ADMIN", status: "ACTIVE" },
    });
    if (activeAdminCount <= 1) {
      throw new AppError("LAST_ADMIN", 409, "Cannot suspend the last active administrator.");
    }
  }

  const now = new Date();

  // If suspended, store reason and revoke all user sessions in transaction
  if (parsed.status === "SUSPENDED") {
    await prisma.$transaction([
      prisma.user.update({
        where: { id },
        data: {
          status: "SUSPENDED",
          suspendedReason: parsed.reason || "Suspended by an administrator.",
        },
      }),
      prisma.session.updateMany({
        where: {
          userId: id,
          revokedAt: null,
        },
        data: { revokedAt: now },
      }),
    ]);
  } else {
    await prisma.user.update({
      where: { id },
      data: {
        status: "ACTIVE",
        suspendedReason: null,
      },
    });
  }

  return NextResponse.json({
    message: `User status set to ${parsed.status}.`,
    status: parsed.status,
  });
});
