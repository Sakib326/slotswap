import { NextRequest, NextResponse } from "next/server";
import { handle } from "@/lib/api";
import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import { z } from "zod";


const roleSchema = z.object({
  role: z.enum(["STUDENT", "ADMIN"]),
});

export const PATCH = handle(async (req: NextRequest, ctx?: { params: Promise<Record<string, string>> }) => {
  const { user: currentAdmin } = await requireRole("ADMIN");
  const params = await ctx?.params;
  const id = params?.id;

  if (!id) throw new AppError("NOT_FOUND", 404, "User not found.");

  // Safety rule: Admin cannot change own role
  if (currentAdmin.id === id) {
    throw new AppError("FORBIDDEN", 403, "Admins cannot modify their own role.");
  }

  const body = await req.json();
  const parsed = roleSchema.parse(body);

  const targetUser = await prisma.user.findUnique({ where: { id } });
  if (!targetUser) {
    throw new AppError("NOT_FOUND", 404, "User not found.");
  }

  // Safety rule: Never leave zero active admins when demoting
  if (targetUser.role === "ADMIN" && parsed.role === "STUDENT" && targetUser.status === "ACTIVE") {
    const activeAdminCount = await prisma.user.count({
      where: { role: "ADMIN", status: "ACTIVE" },
    });
    if (activeAdminCount <= 1) {
      throw new AppError("LAST_ADMIN", 409, "Cannot demote the last active administrator.");
    }
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { role: parsed.role },
  });

  return NextResponse.json({
    message: `User role updated to ${updated.role}.`,
    role: updated.role,
  });
});
