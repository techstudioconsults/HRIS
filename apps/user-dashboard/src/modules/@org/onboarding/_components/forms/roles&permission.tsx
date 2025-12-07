/* eslint-disable @typescript-eslint/no-explicit-any */
// components/forms/RolesAndPermission.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { FormField } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { InfoCircle, Trash } from "iconsax-reactjs";
import { FormEvent, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { Role, roleSchema } from "./schema";

interface RolesAndPermissionProperties {
  isEdit?: boolean;
  initialData?: any;
  onSubmit: (data: Role) => Promise<void>;
  onCancel: (event: FormEvent) => void;
  onDelete?: (roleId: string) => Promise<void>;
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
  isSubmitting = false,
}: RolesAndPermissionProperties) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const methods = useForm<Role>({
    resolver: zodResolver(roleSchema),
    defaultValues: initialData || {
      name: "",
      permissions: [],
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const handleSubmitForm = async (data: Role) => {
    try {
      await onSubmit(data);
    } catch {
      // Handle error silently or show toast notification
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
      <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
        {/* Role Name Input */}
        {isEdit ? (
          <>
            <div className={`bg-warning-50 text-warning-200 rounded-lg p-4 text-sm`}>
              <div className={`flex items-start gap-2`}>
                <div>
                  <InfoCircle size={12} className={`mt-1 text-sm`} />
                </div>
                <p>
                  You can tailor what this employee can view or manage on the platform. These permissions apply only to
                  this employee and can be changed later.
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
          <Card className={`border-none p-0 shadow-none`}>
            <CardContent className={`p-0`}>
              <FormField
                name="name"
                label="Role Name"
                type="text"
                placeholder="Enter role name"
                className="h-[48px] w-full shadow-none"
              />
            </CardContent>
          </Card>
        )}

        {/* Claims Matrix Table */}
        <Card className={`border-none p-0 shadow-none`}>
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
                      <th key={action} className="divide-x px-4 py-2 text-center text-sm font-medium capitalize">
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
                          <Controller
                            name="permissions"
                            control={methods.control}
                            render={({ field }) => {
                              const permissionString = `${module}:${action}`;
                              const hasManagePermission = field.value?.includes(`${module}:manage`);
                              const isChecked =
                                field.value?.includes(permissionString) || (action !== "manage" && hasManagePermission);

                              return (
                                <div className="flex justify-center">
                                  <Checkbox
                                    className={`border-primary/30 data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary`}
                                    checked={isChecked}
                                    onCheckedChange={(checked) => {
                                      let newPermissions = [...(field.value || [])];

                                      newPermissions =
                                        action === "manage"
                                          ? handleManageChange(module, !!checked, newPermissions)
                                          : handlePermissionChange(module, action, !!checked, newPermissions);

                                      field.onChange(newPermissions);
                                    }}
                                    aria-label={`${module} ${action} permission`}
                                  />
                                </div>
                              );
                            }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

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
            // onClick={(event) => event.stopPropagation()}
            type="submit"
            variant={`primary`}
            isDisabled={isSubmitting || isDeleting || !isValid}
            className="w-full"
          >
            {isSubmitting ? "Saving..." : isEdit ? "Update Role" : "Create Role"}
          </MainButton>
        </div>
      </form>
    </FormProvider>
  );
};
