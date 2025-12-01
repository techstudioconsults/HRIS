/* eslint-disable @typescript-eslint/no-explicit-any */
// components/forms/RolesAndPermission.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { BatchProgress, FormField } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { InfoCircle, Trash } from "iconsax-reactjs";
import { Plus } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

interface FormRole {
  name: string;
  permissions: string[];
}

interface RolesAndPermissionProperties {
  isEdit?: boolean;
  initialData?: any;
  onSubmit: (data: Role) => Promise<void>;
  onCancel: (event: FormEvent) => void;
  onDelete?: (roleId: string) => Promise<void>;
  onComplete?: () => void;
  isSubmitting?: boolean;
}

const modules = ["company", "employee", "team", "role", "payroll", "leave", "attendance"] as const;
const actions = ["read", "create", "update", "delete", "manage"] as const;

const handleManageChange = (module: string, checked: boolean, currentPermissions: string[]) => {
  if (checked) {
    // If manage is checked, add all permissions for this module
    const newPermissions = [
      ...currentPermissions.filter((p) => !p.startsWith(`${module}:`)),
      `${module}:read`,
      `${module}:create`,
      `${module}:update`,
      `${module}:delete`,
      `${module}:manage`,
    ];
    return newPermissions;
  } else {
    // If manage is unchecked, remove all permissions for this module
    return currentPermissions.filter((p) => !p.startsWith(`${module}:`));
  }
};

const handlePermissionChange = (module: string, action: string, checked: boolean, currentPermissions: string[]) => {
  const permissionString = `${module}:${action}`;
  let newPermissions = [...currentPermissions];

  if (checked) {
    // Add the permission
    if (!newPermissions.includes(permissionString)) {
      newPermissions.push(permissionString);
    }

    // If all non-manage permissions are checked, also check manage
    if (
      action !== "manage" &&
      newPermissions.includes(`${module}:read`) &&
      newPermissions.includes(`${module}:create`) &&
      newPermissions.includes(`${module}:update`) &&
      newPermissions.includes(`${module}:delete`) &&
      !newPermissions.includes(`${module}:manage`)
    ) {
      newPermissions.push(`${module}:manage`);
    }
  } else {
    // Remove the permission
    newPermissions = newPermissions.filter((p) => p !== permissionString);

    // If manage was checked and any sub-permission is unchecked, uncheck manage
    if (action !== "manage" && newPermissions.includes(`${module}:manage`)) {
      newPermissions = newPermissions.filter((p) => p !== `${module}:manage`);
    }
  }

  return newPermissions;
};

export const RolesAndPermission = ({
  isEdit,
  initialData,
  onSubmit,
  onCancel,
  onDelete,
  onComplete,
  isSubmitting = false,
}: RolesAndPermissionProperties) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [roles, setRoles] = useState<FormRole[]>([{ name: "", permissions: [] }]);
  const [openPermissions, setOpenPermissions] = useState<boolean[]>([false]);
  const [isSubmittingRoles, setIsSubmittingRoles] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState(0);
  const [currentSubmittingRole, setCurrentSubmittingRole] = useState(0);
  const [submissionStatus, setSubmissionStatus] = useState<string>("");

  const addNewRole = () => {
    setRoles((previous) => [...previous, { name: "", permissions: [] }]);
    setOpenPermissions((previous) => [...previous, false]);
  };

  const removeRole = (index: number) => {
    if (roles.length > 1) {
      setRoles((previous) => previous.filter((_, index_) => index_ !== index));
      setOpenPermissions((previous) => previous.filter((_, index_) => index_ !== index));
    }
  };

  const updateRole = (index: number, field: keyof FormRole, value: any) => {
    setRoles((previous) => previous.map((role, index_) => (index_ === index ? { ...role, [field]: value } : role)));
  };

  const togglePermissions = (index: number) => {
    setOpenPermissions((previous) => previous.map((isOpen, index_) => (index_ === index ? !isOpen : isOpen)));
  };

  // Keep openPermissions array in sync with roles array
  useEffect(() => {
    if (openPermissions.length !== roles.length) {
      setOpenPermissions(roles.map(() => false));
    }
  }, [roles, openPermissions.length]);

  const methods = useForm({
    defaultValues: {
      roles: [{ name: "", permissions: [] }],
    },
  });

  // Check if all roles have valid names and at least one permission
  const allRolesValid = roles.every((role) => role.name.trim().length > 0 && role.permissions.length > 0);

  const handleSubmitForm = async () => {
    if (isSubmittingRoles) return;

    setIsSubmittingRoles(true);
    setSubmissionProgress(0);
    setCurrentSubmittingRole(0);
    setSubmissionStatus("Preparing to create roles...");

    const validRoles = roles.filter((role) => role.name.trim() && role.permissions.length > 0);
    const totalRoles = validRoles.length;

    if (totalRoles === 0) {
      toast.error("Please add at least one valid role with permissions");
      setIsSubmittingRoles(false);
      return;
    }

    let successCount = 0;
    const failedRoles: string[] = [];

    try {
      for (const [index, role] of validRoles.entries()) {
        const currentRoleNumber = index + 1;
        setCurrentSubmittingRole(currentRoleNumber);
        setSubmissionStatus(`Creating role: ${role.name}`);

        try {
          // Submit the role
          await onSubmit(role as Role);
          successCount++;

          // Update progress smoothly
          const progress = (currentRoleNumber / totalRoles) * 100;
          setSubmissionProgress(progress);

          // Show success for individual role if multiple roles
          if (totalRoles > 1) {
            toast.success(`Role "${role.name}" created successfully`, {
              duration: 2000,
            });
          }

          // Small delay for better UX and to prevent rate limiting
          if (index < validRoles.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 300));
          }
        } catch (error) {
          failedRoles.push(role.name);
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          toast.error(`Failed to create role "${role.name}": ${errorMessage}`);
        }
      }

      // Show final summary
      if (successCount === totalRoles) {
        setSubmissionStatus("All roles created successfully!");
        const message =
          totalRoles === 1
            ? `Role "${validRoles[0].name}" created successfully!`
            : `Successfully created ${successCount} role${successCount > 1 ? "s" : ""}!`;
        toast.success(message, { duration: 3000 });

        // Close modal and trigger completion after showing success
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          } else {
            onCancel(new Event("submit") as any);
          }
        }, 1000);
      } else if (successCount > 0) {
        setSubmissionStatus(`Completed with ${failedRoles.length} error(s)`);
        toast.warning(`Created ${successCount} of ${totalRoles} roles. Failed: ${failedRoles.join(", ")}`, {
          duration: 5000,
        });

        // Still close modal after partial success
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          } else {
            onCancel(new Event("submit") as any);
          }
        }, 2000);
      } else {
        setSubmissionStatus("Failed to create roles");
        toast.error("Failed to create any roles. Please try again.", { duration: 4000 });
      }
    } catch (error) {
      setSubmissionStatus("An unexpected error occurred");
      const errorMessage = error instanceof Error ? error.message : "Failed to create roles";
      toast.error(errorMessage, { duration: 4000 });
    } finally {
      // Reset submission state after a delay
      setTimeout(() => {
        setIsSubmittingRoles(false);
        setSubmissionProgress(0);
        setCurrentSubmittingRole(0);
      }, 1500);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id || !onDelete) return;

    try {
      setIsDeleting(true);
      await onDelete(initialData.id);
    } catch {
      // Handle error silently or show toast notification
    } finally {
      setIsDeleting(false);
    }
  };

  const canDelete = isEdit && initialData?.id && onDelete;

  return (
    <FormProvider {...methods}>
      <div className="">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmitForm();
          }}
          className="space-y-4"
        >
          {/* Progress Bar - Shows during submission */}
          <BatchProgress progress={submissionProgress} status={submissionStatus} show={isSubmittingRoles} size="sm" />

          <section className="flex items-center justify-between">
            <p className="text-lg font-semibold">Add New Role(s) to Team</p>
            <p className="text-primary flex cursor-pointer items-center gap-1 text-sm font-medium" onClick={addNewRole}>
              <Plus className="h-4 w-4" /> Add New Role
            </p>
          </section>

          <section className="max-h-[50vh] space-y-4 overflow-y-auto">
            {[...roles].reverse().map((role, originalIndex) => {
              const index = roles.length - 1 - originalIndex; // Calculate original index for state updates
              const isRoleValid = role.name.trim().length > 0 && role.permissions.length > 0;
              return (
                <section
                  key={index}
                  className={`space-y-4 rounded-lg p-4 ${isRoleValid ? "bg-primary/5" : "bg-destructive/5 border-destructive/20 border"}`}
                >
                  <section className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold">Role {index + 1}</p>
                      {!isRoleValid && (
                        <span className="text-destructive bg-destructive/10 rounded px-2 py-1 text-xs">
                          {role.name.trim().length === 0 ? "Name required" : "Permissions required"}
                        </span>
                      )}
                    </div>
                    {roles.length > 1 && (
                      <p
                        className="text-destructive flex cursor-pointer items-center gap-1 text-xs font-medium"
                        onClick={() => removeRole(index)}
                      >
                        <Trash className="size-4" /> Remove
                      </p>
                    )}
                  </section>
                  {isEdit ? (
                    <>
                      <div className={`bg-warning-50 text-warning-200 rounded-lg p-4 text-sm`}>
                        <div className={`flex items-start gap-2`}>
                          <div>
                            <InfoCircle size={12} className={`mt-1 text-sm`} />
                          </div>
                          <p>
                            You can tailor what this employee can view or manage on the platform. These permissions
                            apply only to this employee and can be changed later.
                          </p>
                        </div>
                      </div>
                      {/* Hidden name field for edit mode to maintain form validation */}
                      <FormField
                        name="name"
                        label="Role Name"
                        type="text"
                        placeholder="Enter role name"
                        className="h-[48px] w-full shadow-none"
                      />
                    </>
                  ) : (
                    <Card className={`border-none bg-transparent p-0 shadow-none`}>
                      <CardContent className={`p-0`}>
                        <input
                          name={`role_${index}_name`}
                          type="text"
                          placeholder="Enter role name"
                          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-[48px] w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                          value={role.name}
                          onChange={(event) => updateRole(index, "name", event.target.value)}
                        />
                      </CardContent>
                    </Card>
                  )}
                  <p
                    onClick={() => togglePermissions(index)}
                    className="text-primary hover:text-primary/80 cursor-pointer text-sm font-medium transition-colors"
                  >
                    {openPermissions[index] ? "Hide permissions" : "Assign permissions for this role"}
                  </p>
                  {/* Claims Matrix Table */}
                  {openPermissions[index] && (
                    <Card className={`border-none bg-transparent p-0 shadow-none`}>
                      <CardHeader className={`p-0`}>
                        <CardTitle className="text-lg">Assign Module Permissions (Claims)</CardTitle>
                        <p className="text-muted-foreground text-sm">
                          Select the areas this role should access and define their level of control.
                        </p>
                      </CardHeader>
                      <CardContent className={`p-0`}>
                        <div className="overflow-x-auto rounded-md border">
                          <table className="w-full border-collapse">
                            <thead className={`bg-primary/10`}>
                              <tr className="">
                                <th className="border-r px-4 py-2 text-left text-sm">Module</th>
                                {actions.map((action) => (
                                  <th
                                    key={action}
                                    className="divide-x px-4 py-2 text-center text-sm font-medium capitalize"
                                  >
                                    {action}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {modules.map((module) => (
                                <tr key={module} className="border-border/50 border-b">
                                  <td className="border-r px-4 py-2 text-sm capitalize">{module}</td>
                                  {actions.map((action) => (
                                    <td key={`${module}-${action}`} className="border-r px-4 py-2 text-center">
                                      <div className="flex justify-center">
                                        <Checkbox
                                          className={`border-primary/30 data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary`}
                                          checked={
                                            role.permissions?.includes(`${module}:${action}`) ||
                                            (action !== "manage" && role.permissions?.includes(`${module}:manage`))
                                          }
                                          onCheckedChange={(checked) => {
                                            let newPermissions = [...(role.permissions || [])];

                                            newPermissions =
                                              action === "manage"
                                                ? handleManageChange(module, !!checked, newPermissions)
                                                : handlePermissionChange(module, action, !!checked, newPermissions);

                                            updateRole(index, "permissions", newPermissions);
                                          }}
                                          aria-label={`${module} ${action} permission`}
                                        />
                                      </div>
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </section>
              );
            })}
          </section>

          {/* Validation Summary */}
          {!allRolesValid && (
            <div className="bg-warning/10 border-warning/20 rounded-lg border p-4">
              <div className="flex items-start gap-2">
                <InfoCircle className="text-warning h-4 w-4" />
                <p className="text-muted-foreground text-xs">
                  Please complete all roles by adding a name and selecting at least one permission for each role.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            {canDelete && (
              <MainButton
                type="button"
                variant="destructive"
                onClick={handleDelete}
                isDisabled={isSubmitting || isDeleting}
                className="w-full sm:w-auto"
                icon={<Trash className="mr-2 h-4 w-4" />}
                isLeftIconVisible
              >
                {isDeleting ? "Deleting..." : "Delete Role"}
              </MainButton>
            )}
            <MainButton
              type="button"
              variant="outline"
              onClick={onCancel}
              isDisabled={isSubmitting || isDeleting}
              className="w-full"
            >
              Cancel
            </MainButton>
            <MainButton
              type="submit"
              variant={`primary`}
              isDisabled={isSubmitting || isDeleting || !allRolesValid || isSubmittingRoles}
              className="w-full"
            >
              {isSubmittingRoles
                ? `Creating Role ${currentSubmittingRole}...`
                : isSubmitting
                  ? "Saving..."
                  : isEdit
                    ? "Update Role"
                    : `Create ${roles.length} Role${roles.length > 1 ? "s" : ""}`}
            </MainButton>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};
