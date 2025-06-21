/* eslint-disable @typescript-eslint/no-explicit-any */
// components/forms/RolesAndPermission.tsx
"use client";

import MainButton from "@/components/shared/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Role, roleSchema } from "./schema";

interface RolesAndPermissionProperties {
  initialData?: any;
  onSubmit: (data: Role) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const modules = ["admin", "company", "leave", "employee", "team", "role"] as const;
const actions = ["read", "create", "edit", "delete", "manage"] as const;

export const RolesAndPermission = ({
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
    // Transform the form data to match your desired output format
    const output = {
      name: data.name,
      permissions: data.permissions,
    };
    onSubmit(output);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Role Name Input */}
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
                              const permissionString = `${module.toLowerCase()}:${action}`;
                              return (
                                <FormItem className="flex justify-center">
                                  <Checkbox
                                    className={`border-primary/30 data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary`}
                                    checked={field.value?.includes(permissionString)}
                                    onCheckedChange={(checked) => {
                                      const newValue = checked
                                        ? [...(field.value || []), permissionString]
                                        : field.value?.filter((p) => p !== permissionString) || [];
                                      field.onChange(newValue);
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
