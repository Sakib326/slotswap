import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/lib/auth/password";
import { env } from "../src/lib/env";

const DEPARTMENTS = [
  { code: "CSE", name: "Computer Science and Engineering" },
  { code: "EEE", name: "Electrical and Electronic Engineering" },
  { code: "BBA", name: "Bachelor of Business Administration" },
  { code: "ENG", name: "English and Modern Languages" },
  { code: "MAT", name: "Mathematics and Physics" },
];

export async function seedDatabase() {
  console.log("🌱 Seeding database...");

  // 1. Upsert departments
  for (const dept of DEPARTMENTS) {
    await prisma.department.upsert({
      where: { code: dept.code },
      update: { name: dept.name },
      create: { code: dept.code, name: dept.name },
    });
  }
  console.log("✅ Departments seeded (CSE, EEE, BBA, ENG, MAT)");

  // 2. Upsert admin user
  const adminEmail = (env.ADMIN_EMAIL || "admin@slotswap.example").toLowerCase();
  const adminPassword = env.ADMIN_PASSWORD || "AdminPassword123";
  const passwordHash = await hashPassword(adminPassword);

  const cseDept = await prisma.department.findUnique({
    where: { code: "CSE" },
  });

  if (!cseDept) {
    throw new Error("CSE Department not found during seed");
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
    include: { profile: true },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        role: "ADMIN",
        status: "ACTIVE",
        emailVerifiedAt: new Date(),
        profile: {
          create: {
            name: "System Admin",
            studentId: "ADMIN-0001",
            departmentId: cseDept.id,
            batch: "Staff",
            contactVisibility: "HIDDEN",
          },
        },
      },
    });
    console.log(`✅ Admin user created: ${adminEmail}`);
  } else {
    await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        role: "ADMIN",
        status: "ACTIVE",
        emailVerifiedAt: existingAdmin.emailVerifiedAt || new Date(),
        passwordHash,
      },
    });
    console.log(`✅ Admin user updated/verified: ${adminEmail}`);
  }

  console.log("🎉 Seeding completed successfully.");
}

seedDatabase()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
