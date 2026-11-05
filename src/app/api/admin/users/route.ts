import { NextRequest, NextResponse } from "next/server";
import { handle } from "@/lib/api";
import { requireRole } from "@/lib/auth/guards";
import { formatMeUser } from "@/lib/auth/user-format";
import { prisma } from "@/lib/prisma";


export const GET = handle(async (req: NextRequest) => {
  await requireRole("ADMIN");

  const searchParams = req.nextUrl.searchParams;
  const q = searchParams.get("q")?.trim() || "";
  const role = searchParams.get("role")?.trim();
  const status = searchParams.get("status")?.trim();
  const departmentId = searchParams.get("departmentId")?.trim();

  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const rawPageSize = parseInt(searchParams.get("pageSize") || "20", 10);
  const pageSize = Math.min(100, Math.max(1, isNaN(rawPageSize) ? 20 : rawPageSize));

  const whereClause: any = {};

  if (q) {
    whereClause.OR = [
      { email: { contains: q, mode: "insensitive" } },
      { profile: { name: { contains: q, mode: "insensitive" } } },
      { profile: { studentId: { contains: q, mode: "insensitive" } } },
    ];
  }

  if (role === "STUDENT" || role === "ADMIN") {
    whereClause.role = role;
  }

  if (status === "ACTIVE" || status === "SUSPENDED") {
    whereClause.status = status;
  }

  if (departmentId) {
    whereClause.profile = {
      ...(whereClause.profile || {}),
      departmentId,
    };
  }

  const [total, users] = await prisma.$transaction([
    prisma.user.count({ where: whereClause }),
    prisma.user.findMany({
      where: whereClause,
      include: {
        profile: {
          include: {
            department: true,
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({
    items: users.map(formatMeUser),
    page,
    pageSize,
    total,
  });
});
