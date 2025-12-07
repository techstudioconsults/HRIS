import { HttpAdapter } from "@/lib/http/http-adapter";

import { RoleApiResponse, TeamApiResponse } from "../onboarding/types";

// Fetch all teams and include their roles
export async function getTeamsWithRoles(http: HttpAdapter): Promise<Team[]> {
  const response = await http.get<ApiResponse<TeamApiResponse>>(`/teams`);
  if (response?.status !== 200) return [];
  const teamsWithRoles = await Promise.all(
    response.data.data.items.map(async (team: Team) => {
      const roles = await getRoles(http, team.id);
      return { id: team.id, name: team.name, roles };
    }),
  );
  return teamsWithRoles;
}

// Fetch roles for a given team
export async function getRoles(http: HttpAdapter, teamId: string): Promise<Role[]> {
  const response = await http.get<ApiResponse<RoleApiResponse>>(`/roles?teamId=${teamId}`);
  if (response?.status !== 200) return [];
  return response.data.data.items.map((role: Role) => ({
    id: role.id,
    name: role.name,
    teamId: role.teamId,
    permissions: role.permissions,
  }));
}

// Create a role
export async function createRole(
  http: HttpAdapter,
  roleData: { name: string; teamId: string; permissions: string[] },
): Promise<Role> {
  const response = await http.post<{ data: RoleApiResponse; success: boolean }>(`/roles`, roleData);
  if (response?.status === 201) {
    const { id, name, teamId, permissions } = response.data.data;
    return { id, name, teamId, permissions };
  }
  throw new Error("Failed to create role");
}

// Update a role
export async function updateRole(
  http: HttpAdapter,
  roleId: string,
  roleData: { name?: string; permissions?: string[] },
): Promise<Role> {
  const response = await http.patch<{ data: RoleApiResponse; success: boolean }>(`/roles/${roleId}`, roleData);
  if (response?.status === 200) {
    const { id, name, teamId, permissions } = response.data.data;
    return { id, name, teamId, permissions };
  }
  throw new Error("Failed to update role");
}

// Delete a role
export async function deleteRole(http: HttpAdapter, roleId: string): Promise<{ success: boolean }> {
  const response = await http.delete<{ success: boolean; data: string }>(`/roles/${roleId}`);
  if (response?.status === 200) return response.data;
  throw new Error("Failed to delete role");
}
