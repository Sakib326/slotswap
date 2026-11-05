import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password cannot exceed 128 characters")
  .regex(/[a-zA-Z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80, "Name cannot exceed 80 characters"),
  email: z.string().trim().email("Enter a valid email address").toLowerCase(),
  password: passwordSchema,
  studentId: z.string().trim().min(3, "Student ID is required").max(30),
  departmentId: z.string().min(1, "Department is required"),
  batch: z.string().trim().min(2, "Batch is required").max(30),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export const resendVerificationSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").toLowerCase(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: passwordSchema,
});
