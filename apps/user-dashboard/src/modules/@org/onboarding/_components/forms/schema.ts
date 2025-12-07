// schemas/team.ts
import { z } from "zod";

// const PermissionType = z.union([
//   z.literal("admin"),
//   z.literal("company:read"),
//   z.literal("company:editor"),
//   z.literal("employee:read"),
//   z.literal("employee:editor"),
//   z.literal("team:read"),
//   z.literal("team:editor"),
//   z.literal("role:read"),
//   z.literal("role:editor"),
//   // Add patterns for your dynamic permissions
//   z.string().regex(/^[a-z]+:(read|create|edit|delete|manage)$/),
// ]);

export const roleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Role name is required"),
  teamId: z.string().optional(),
  permissions: z.array(z.string()).default([]),
  // permissions: z.array(PermissionType).default([]),
});

export const teamSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Team name is required"),
  roles: z.array(roleSchema).default([]),
});

export const teamSetupSchema = z.object({
  teams: z.array(teamSchema).min(1, "At least one team is required"),
});

export const employeeSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name cannot exceed 50 characters"),

    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name cannot exceed 50 characters"),

    email: z.string().email("Please enter a valid email").max(100, "Email cannot exceed 100 characters"),

    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number cannot exceed 15 digits")
      .regex(/^[\d +-]+$/, "Please enter a valid phone number"),

    department: z
      .string()
      .min(1, "Please select a department")
      .refine((value) => value !== "select", {
        message: "Please select a valid department",
      }),

    role: z
      .string()
      .min(1, "Please select a role")
      .refine((value) => value !== "select", {
        message: "Please select a valid role",
      }),

    // If you need to validate that both department and role are selected together:
  })
  .refine(
    (data) => {
      if ((data.department && !data.role) || (!data.department && data.role)) {
        return false;
      }
      return true;
    },
    {
      message: "Both department and role must be selected together",
      path: ["role"], // This shows the error on the role field
    },
  );

export type Role = z.infer<typeof roleSchema>;
export type Team = z.infer<typeof teamSchema>;
export type TeamSetupFormData = z.infer<typeof teamSetupSchema>;
// export type PermissionType = z.infer<typeof PermissionType>;
