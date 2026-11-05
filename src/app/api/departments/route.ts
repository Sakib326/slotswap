import { NextResponse } from "next/server";
import { handle } from "@/lib/api";
import { prisma } from "@/lib/prisma";


export const GET = handle(async () => {
  const departments = await prisma.department.findMany({
    select: {
      id: true,
      code: true,
      name: true,
    },
    orderBy: { code: "asc" },
  });

  return NextResponse.json(departments);
});
