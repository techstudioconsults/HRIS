/* eslint-disable @typescript-eslint/no-explicit-any */
// components/forms/RolesAndPermission.tsx
"use client";

import MainButton from "@/components/shared/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoCircle } from "iconsax-reactjs";
import { FormEvent } from "react";
import { useForm } from "react-hook-form";

import { Role, roleSchema } from "./schema";

interface RolesAndPermissionProperties {
  isEdit?: boolean;
  initialData?: any;
  onSubmit: (data: Role) => Promise<void>;
  onCancel: (event: FormEvent) => void;
  isSubmitting?: boolean;
}

const modules = ["company", "employee", "team", "role", "payroll", "leave", "attendance"] as const;
const actions = ["read", "update", "manage"] as const;

const handleManageChange = (module: string, checked: boolean, currentPermissions: string[]) => {
  if (checked) {
    // If manage is checked, add all permissions for this module
    const newPermissions = [
      ...currentPermissions.filter((p) => !p.startsWith(`${module}:`)),
      `${module}:read`,
      `${module}:update`,
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
      newPermissions.includes(`${module}:update`)
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
  isSubmitting = false,
}: RolesAndPermissionProperties) => {
  const form = useForm<Role>({
    resolver: zodResolver(roleSchema),
    defaultValues: initialData || {
      name: "",
      permissions: [],
    },
  });

  const handleSubmit = (data: Role) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Role Name Input */}
        {isEdit ? (
          <div className={`bg-warning-50 text-warning-200 rounded-lg p-4 text-sm`}>
            <div className={`flex items-start gap-2`}>
              <div>
                <InfoCircle size={12} className={`mt-1 text-sm`} />
              </div>
              <p>
                You can tailor what this employee can view or manage on the platform. These permissions apply only to
                this employee and can be changed later..
              </p>
            </div>
          </div>
        ) : (
          <Card className={`border-none p-0 shadow-none`}>
            <CardContent className={`p-0`}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter role name" {...field} className="h-[48px] w-full shadow-none" />
                    </FormControl>
                  </FormItem>
                )}
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
                          <FormField
                            control={form.control}
                            name="permissions"
                            render={({ field }) => {
                              const permissionString = `${module}:${action}`;
                              const isChecked = field.value?.includes(permissionString);

                              return (
                                <FormItem className="flex justify-center">
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
                                </FormItem>
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
          <MainButton type="button" variant="outline" onClick={onCancel} isDisabled={isSubmitting} className="w-full">
            Cancel
          </MainButton>
          <MainButton type="submit" variant={`primary`} isDisabled={isSubmitting} className="w-full">
            {isSubmitting ? "Saving..." : "Save & Continue"}
          </MainButton>
        </div>
      </form>
    </Form>
  );
};
