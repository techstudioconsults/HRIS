/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReusableDialog } from "@/components/shared/dialog/Dialog";
import { FormField } from "@/components/shared/FormFields";
import { Label } from "@/components/ui/label";
import { ChevronRight } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Employee } from "../../../_views/step-three";
import { OnboardingService } from "../../../services/service";
import { RolesAndPermission } from "../roles&permission";

// import { Role } from "../schema";

interface SingleEmployeeFormProperties {
  index: number;
  onBoardingService: OnboardingService;
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

export const SingleEmployeeForm = ({ index, onBoardingService }: SingleEmployeeFormProperties) => {
  const { control, setValue } = useFormContext<{ employees: Employee[] }>();
  const employee = useWatch({ control, name: `employees.${index}` });
  const selectedTeamId = useWatch({ control, name: `employees.${index}.teamId` });
  const selectedRoleId = useWatch({ control, name: `employees.${index}.roleId` });
  // const { data: session } = useSession();
  // console.log(session);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [currentPermissions, setCurrentPermissions] = useState<{
    name: string;
    permissions: any[];
  } | null>(null);

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoadingDepartments(true);
      try {
        const teams = await onBoardingService.getTeams();
        const departmentOptions = teams.map((team: { id: any; name: any }) => ({
          id: team.id,
          name: team.name,
        }));
        setDepartments(departmentOptions);
      } catch (error: any) {
        toast.error("Failed to load department", {
          description: error.response.data.message,
        });
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, [onBoardingService]);

  // Fetch roles when department changes
  useEffect(() => {
    const fetchRoles = async () => {
      if (!selectedTeamId) {
        setRoles([]);
        setValue(`employees.${index}.roleId`, "");
        return;
      }

      setLoadingRoles(true);
      try {
        const rolesData = await onBoardingService.getRoles(selectedTeamId);
        const roleOptions = rolesData.map((role: { id: any; name: any; permissions?: any }) => ({
          id: role.id,
          name: role.name,
          permissions: role.permissions || [],
        }));
        setRoles(roleOptions);
      } catch (error: any) {
        toast.error("Failed to load roles", {
          description: error.response.data.message,
        });
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, [selectedTeamId, onBoardingService, index, setValue]);

  // Load permissions when role changes or when opening dialog
  useEffect(() => {
    const fetchRolePermissions = async () => {
      if (selectedRoleId) {
        try {
          const roleData = await onBoardingService.getRole(selectedRoleId);

          if (roleData) {
            setCurrentPermissions({
              name: roleData.name,
              permissions: roleData.permissions || [],
            });
          } else {
            setCurrentPermissions({ name: "", permissions: [] });
          }
        } catch (error: any) {
          toast.error("Failed to load permission", {
            description: error.response.data.message,
          });
          setCurrentPermissions(null);
        }
      } else {
        setCurrentPermissions(null);
      }
    };

    fetchRolePermissions();
  }, [selectedRoleId, onBoardingService]);

  const handleOpenPermissionsDialog = () => {
    if (!selectedRoleId) {
      toast.warning("Please select a role first");
      return;
    }
    setPermissionsDialogOpen(true);
  };

  const handleSavePermissions = async (permissions: { name: string; permissions: any[] }) => {
    try {
      const updatedRole = await onBoardingService.updateRole(selectedRoleId, permissions);
      if (updatedRole) {
        toast.success("Permissions updated successfully");
        setCurrentPermissions(permissions);
        setPermissionsDialogOpen(false);
      }
    } catch (error: any) {
      toast.error("Failed to update permissions", {
        description: error.response.data.message,
      });
    }
  };

  return (
    <section className="w-full">
      <section className={`space-y-4`}>
        <FormField
          placeholder={`Enter first name`}
          className={`h-14 w-full`}
          label={`First Name`}
          name={`employees.${index}.firstName`}
        />
        <FormField
          placeholder={`Enter last name`}
          className={`h-14 w-full`}
          label={`Last Name`}
          name={`employees.${index}.lastName`}
        />
        <FormField
          type={`email`}
          placeholder={`Enter email address`}
          className={`h-14 w-full`}
          label={`Email Address`}
          name={`employees.${index}.email`}
        />
        <FormField
          placeholder={`Enter phone number`}
          className={`h-14 w-full`}
          label={`Phone Number`}
          name={`employees.${index}.phoneNumber`}
        />
        <FormField
          type="select"
          placeholder={loadingDepartments ? "Loading departments..." : "Select department"}
          className="!h-14 w-full"
          label="Department"
          name={`employees.${index}.teamId`}
          options={departments.map((dept) => ({
            value: dept.id,
            label: dept.name,
          }))}
          disabled={loadingDepartments}
        />
        <FormField
          type="select"
          placeholder={
            selectedTeamId ? (loadingRoles ? "Loading roles..." : "Select role") : "Select a department first"
          }
          className="!h-14 w-full"
          label="Role"
          name={`employees.${index}.roleId`}
          options={roles.map((role) => ({
            value: role.id,
            label: role.name,
          }))}
          disabled={!selectedTeamId || loadingRoles}
        />
        <input
          type="hidden"
          name={`employees.${index}.password`}
          value={employee?.password || "PleaseSetAdefaultHere1."}
        />
        <input type="hidden" name={`employees.${index}.permissions`} value={JSON.stringify(currentPermissions)} />
        <div>
          <Label className={`mb-2 text-[16px]`}>Customize Permissions</Label>
          <div
            className={`flex h-14 cursor-pointer items-center justify-between rounded-lg border px-4`}
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
        />
      </ReusableDialog>
    </section>
  );
};
