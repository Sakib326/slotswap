import { z } from "zod";

const VALID_DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be between 2 and 80 characters").max(80).optional(),
    departmentId: z.string().min(1, "Department is required").optional(),
    batch: z.string().trim().min(2, "Batch must be between 2 and 30 characters").max(30).optional(),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[0-9]{10,15}$/, "Enter a valid phone number with 10-15 digits")
      .nullable()
      .optional(),
    contactVisibility: z.enum(["HIDDEN", "AFTER_CONFIRMATION"]).optional(),
    preferredDays: z
      .array(z.enum(VALID_DAYS))
      .refine((items) => new Set(items).size === items.length, {
        message: "Preferred days must not contain duplicates",
      })
      .optional(),
    preferredTimeRange: z.enum(["MORNING", "AFTERNOON", "EVENING", "ANY"]).optional(),
    allowMultiWaySwaps: z.boolean().optional(),
    notifyByEmail: z.boolean().optional(),
    notifyInApp: z.boolean().optional(),
  })
  .strict();

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password cannot exceed 128 characters")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});
