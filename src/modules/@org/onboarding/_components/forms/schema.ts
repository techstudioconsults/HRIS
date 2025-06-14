// schemas/team.ts
import { z } from "zod";

export const PermissionType = z.union([
  z.literal("admin"),
  z.literal("company:read"),
  z.literal("company:editor"),
  z.literal("employee:read"),
  z.literal("employee:editor"),
  z.literal("team:read"),
  z.literal("team:editor"),
  z.literal("role:read"),
  z.literal("role:editor"),
  // Add patterns for your dynamic permissions
  z.string().regex(/^[a-z]+:(read|create|edit|delete|manage)$/),
]);

export type PermissionType = z.infer<typeof PermissionType>;

export const roleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Role name is required"),
  teamId: z.string().optional(),
  permissions: z.array(PermissionType).default([]),
});

export const teamSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Team name is required"),
  roles: z.array(roleSchema).default([]),
});

export const teamSetupSchema = z.object({
  teams: z.array(teamSchema).min(1, "At least one team is required"),
});

export type Role = z.infer<typeof roleSchema>;
export type Team = z.infer<typeof teamSchema>;
export type TeamSetupFormData = z.infer<typeof teamSetupSchema>;
