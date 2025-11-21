/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReusableDialog } from "@/components/shared/dialog/Dialog";
import { FormField } from "@/components/shared/inputs/FormFields";
import { ChevronRight } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Employee } from "../../../_views/step-three";
import { useOnboardingService } from "../../../services/use-onboarding-service";
import { RolesAndPermission } from "../roles&permission";

// import { Role } from "../schema";

interface SingleEmployeeFormProperties {
  index: number;
}

interface Department {
  id: string;
  name: string;
}

interface Role {
  id: string;
  name: string;
  permissions?: any[];
}

export const SingleEmployeeForm = ({ index }: SingleEmployeeFormProperties) => {
  const { control, setValue } = useFormContext<{ employees: Employee[] }>();
  const employee = useWatch({ control, name: `employees.${index}` });
  const selectedTeamId = useWatch({ control, name: `employees.${index}.teamId` });
  const selectedRoleId = useWatch({ control, name: `employees.${index}.roleId` });
  // const { data: session } = useSession();
  // console.log(session);

  // Query-based data (departments/roles) via hooks rather than local service calls
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [currentPermissions, setCurrentPermissions] = useState<{
    name: string;
    permissions: any[];
  } | null>(null);

  // Fetch departments on component mount
  const { useGetTeams, useGetRoles, useGetRole, useUpdateRole } = useOnboardingService();
  const { data: teamsData, isLoading: loadingDepartments } = useGetTeams();
  const departmentOptions: Department[] = (teamsData || []).map((team: any) => ({ id: team.id, name: team.name }));

  // Fetch roles when department changes
  const { data: rolesData, isLoading: loadingRoles } = useGetRoles(selectedTeamId || "");
  const roleOptions: Role[] = selectedTeamId
    ? (rolesData || []).map((role: any) => ({ id: role.id, name: role.name, permissions: role.permissions || [] }))
    : [];
  useEffect(() => {
    if (!selectedTeamId) {
      setValue(`employees.${index}.roleId`, "");
    }
  }, [selectedTeamId, setValue, index]);

  // Load permissions when role changes or when opening dialog
  const roleDataQuery = useGetRole(selectedRoleId || "");
  useEffect(() => {
    const roleData = roleDataQuery.data;
    if (selectedRoleId && roleData) {
      setCurrentPermissions({ name: roleData.name, permissions: roleData.permissions || [] });
    } else if (!selectedRoleId) {
      setCurrentPermissions(null);
    }
  }, [roleDataQuery.data, selectedRoleId]);

  // Auto-populate permissions when a team has exactly one role and no role has been manually selected yet.
  useEffect(() => {
    if (selectedTeamId && rolesData && rolesData.length === 1 && !selectedRoleId) {
      const soleRole = rolesData[0];
      setValue(`employees.${index}.roleId`, soleRole.id);
      setCurrentPermissions({ name: soleRole.name, permissions: soleRole.permissions || [] });
    }
  }, [selectedTeamId, rolesData, selectedRoleId, setValue, index]);

  const handleOpenPermissionsDialog = () => {
    if (selectedRoleId) {
      // If there's exactly one available role for the selected team, auto-select it.
      if (rolesData && rolesData.length === 1) {
        const soleRole = rolesData[0];
        setValue(`employees.${index}.roleId`, soleRole.id);
        setCurrentPermissions({ name: soleRole.name, permissions: soleRole.permissions || [] });
      } else {
        toast.warning("Please select a role first");
        return;
      }
    }
    setPermissionsDialogOpen(true);
  };

  const { mutateAsync: updateRole, isPending: isUpdatingRole } = useUpdateRole();
  const handleSavePermissions = async (permissions: { name: string; permissions: any[] }) => {
    if (!selectedRoleId || !selectedTeamId) return;
    try {
      await updateRole({
        roleId: selectedRoleId,
        permissions: permissions.permissions,
        name: permissions.name,
        teamId: selectedTeamId,
      });
      toast.success("Permissions updated successfully");
      setCurrentPermissions(permissions);
      setPermissionsDialogOpen(false);
    } catch (error: any) {
      toast.error("Failed to update permissions", {
        description: error.message,
      });
    }
  };

  return (
    <section className="w-full">
      <section className={`space-y-4`}>
        <FormField
          placeholder={`Enter first name`}
          className={`h-12 w-full`}
          label={`First Name`}
          name={`employees.${index}.firstName`}
        />
        <FormField
          placeholder={`Enter last name`}
          className={`h-12 w-full`}
          label={`Last Name`}
          name={`employees.${index}.lastName`}
        />
        <FormField
          type={`email`}
          placeholder={`Enter email address`}
          className={`h-12 w-full`}
          label={`Email Address`}
          name={`employees.${index}.email`}
        />
        <FormField
          placeholder={`Enter phone number`}
          className={`h-12 w-full`}
          label={`Phone Number`}
          name={`employees.${index}.phoneNumber`}
        />
        <FormField
          type="select"
          placeholder={loadingDepartments ? "Loading departments..." : "Select department"}
          className="!h-12 w-full"
          label="Department"
          name={`employees.${index}.teamId`}
          options={departmentOptions.map((dept) => ({ value: dept.id, label: dept.name }))}
          disabled={loadingDepartments}
        />
        <FormField
          type="select"
          placeholder={
            selectedTeamId ? (loadingRoles ? "Loading roles..." : "Select role") : "Select a department first"
          }
          className="!h-12 w-full"
          label="Role"
          name={`employees.${index}.roleId`}
          options={roleOptions.map((role) => ({ value: role.id, label: role.name }))}
          disabled={!selectedTeamId || loadingRoles}
        />
        <input
          type="hidden"
          name={`employees.${index}.password`}
          value={employee?.password || "PleaseSetAdefaultHere1."}
        />
        <input type="hidden" name={`employees.${index}.permissions`} value={JSON.stringify(currentPermissions)} />
        <div>
          <label className={`mb-2 block text-[16px] font-medium`}>Customize Permissions</label>
          <div
            className={`flex h-12 cursor-pointer items-center justify-between rounded-lg border px-4`}
            onClick={handleOpenPermissionsDialog}
          >
            <span>Show Permission</span>
            <span>
              <ChevronRight size={16} className={`text-gray`} />
            </span>
          </div>
        </div>
      </section>

      {/* Permissions Dialog */}
      <ReusableDialog
        open={permissionsDialogOpen}
        onOpenChange={setPermissionsDialogOpen}
        title="Customize Permissions"
        description="Select the permissions for this employee"
        className="!max-w-2xl"
        trigger={""}
      >
        <RolesAndPermission
          isEdit
          initialData={currentPermissions}
          onSubmit={async (data) => {
            handleSavePermissions(data);
          }}
          onCancel={(event: FormEvent) => {
            event.preventDefault();
            setPermissionsDialogOpen(false);
          }}
          isSubmitting={isUpdatingRole}
        />
      </ReusableDialog>
    </section>
  );
};
