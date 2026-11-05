import { NextRequest, NextResponse } from "next/server";
import { handle } from "@/lib/api";
import { requireUser } from "@/lib/auth/guards";
import { updateProfileSchema } from "@/lib/validators/user";
import { formatMeUser } from "@/lib/auth/user-format";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";

export const GET = handle(async () => {
  const { user } = await requireUser();
  return NextResponse.json(formatMeUser(user));
});

export const PATCH = handle(async (req: NextRequest) => {
  const { user } = await requireUser();
  const body = await req.json();
  const parsed = updateProfileSchema.parse(body);

  if (parsed.departmentId) {
    const dept = await prisma.department.findUnique({
      where: { id: parsed.departmentId },
    });
    if (!dept) {
      throw new AppError("VALIDATION_ERROR", 400, "Department does not exist.", {
        departmentId: "Select a valid department",
      });
    }
  }

  const updatedProfile = await prisma.profile.update({
    where: { userId: user.id },
    data: {
      ...(parsed.name !== undefined ? { name: parsed.name } : {}),
      ...(parsed.departmentId !== undefined ? { departmentId: parsed.departmentId } : {}),
      ...(parsed.batch !== undefined ? { batch: parsed.batch } : {}),
      ...(parsed.phone !== undefined ? { phone: parsed.phone } : {}),
      ...(parsed.contactVisibility !== undefined ? { contactVisibility: parsed.contactVisibility } : {}),
      ...(parsed.preferredDays !== undefined ? { preferredDays: parsed.preferredDays } : {}),
      ...(parsed.preferredTimeRange !== undefined ? { preferredTimeRange: parsed.preferredTimeRange } : {}),
      ...(parsed.allowMultiWaySwaps !== undefined ? { allowMultiWaySwaps: parsed.allowMultiWaySwaps } : {}),
      ...(parsed.notifyByEmail !== undefined ? { notifyByEmail: parsed.notifyByEmail } : {}),
      ...(parsed.notifyInApp !== undefined ? { notifyInApp: parsed.notifyInApp } : {}),
    },
    include: {
      department: true,
      user: true,
    },
  });

  const fullUpdatedUser = {
    ...user,
    profile: updatedProfile,
  };

  return NextResponse.json(formatMeUser(fullUpdatedUser));
});
