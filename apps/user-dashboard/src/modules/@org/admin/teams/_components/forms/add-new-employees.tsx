/* eslint-disable @typescript-eslint/no-explicit-any */
// components/forms/AddNewEmployees.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { Progress } from "@workspace/ui/components/progress";
import { FormField } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { cn } from "@workspace/ui/lib/utils";
import { InfoCircle, Trash } from "iconsax-reactjs";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface FormEmployee {
  employeeId: string;
  roleId: string;
  customPermissions?: string[];
}

interface Employee {
  id: string;
  name: string;
  email: string;
}

interface Role {
  id: string;
  name: string;
  description?: string;
}

interface AddNewEmployeesProperties {
  isEdit?: boolean;
  initialData?: any;
  onSubmit: (data: FormEmployee) => Promise<void>;
  onCancel: (event: FormEvent) => void;
  onDelete?: (employeeId: string) => Promise<void>;
  isSubmitting?: boolean;
  availableRoles?: Role[];
  availableEmployees?: Employee[];
}

export const AddNewEmployees = ({
  isEdit,
  initialData,
  onSubmit,
  onCancel,
  onDelete,
  isSubmitting = false,
  availableRoles = [],
  availableEmployees = [],
}: AddNewEmployeesProperties) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [employees, setEmployees] = useState<FormEmployee[]>([{ employeeId: "", roleId: "", customPermissions: [] }]);
  const [openCustomPermissions, setOpenCustomPermissions] = useState<boolean[]>([false]);
  const [isSubmittingEmployees, setIsSubmittingEmployees] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState(0);
  const [currentSubmittingEmployee, setCurrentSubmittingEmployee] = useState(0);
  const [submissionStatus, setSubmissionStatus] = useState<string>("");

  // State for comboboxes
  const [openEmployeeCombos, setOpenEmployeeCombos] = useState<boolean[]>([]);
  const [openRoleCombos, setOpenRoleCombos] = useState<boolean[]>([]);

  const addNewEmployee = () => {
    setEmployees((previous) => [...previous, { employeeId: "", roleId: "", customPermissions: [] }]);
    setOpenCustomPermissions((previous) => [...previous, false]);
    setOpenEmployeeCombos((previous) => [...previous, false]);
    setOpenRoleCombos((previous) => [...previous, false]);
  };

  const removeEmployee = (index: number) => {
    if (employees.length > 1) {
      setEmployees((previous) => previous.filter((_, index_) => index_ !== index));
      setOpenCustomPermissions((previous) => previous.filter((_, index_) => index_ !== index));
      setOpenEmployeeCombos((previous) => previous.filter((_, index_) => index_ !== index));
      setOpenRoleCombos((previous) => previous.filter((_, index_) => index_ !== index));
    }
  };

  const updateEmployee = (index: number, field: keyof FormEmployee, value: any) => {
    setEmployees((previous) =>
      previous.map((employee, index_) => (index_ === index ? { ...employee, [field]: value } : employee)),
    );
  };

  // const toggleCustomPermissions = (index: number) => {
  //   setOpenCustomPermissions((previous) => previous.map((isOpen, index_) => (index_ === index ? !isOpen : isOpen)));
  // };

  const toggleEmployeeCombo = (index: number) => {
    setOpenEmployeeCombos((previous) => previous.map((isOpen, index_) => (index_ === index ? !isOpen : isOpen)));
  };

  const toggleRoleCombo = (index: number) => {
    setOpenRoleCombos((previous) => previous.map((isOpen, index_) => (index_ === index ? !isOpen : isOpen)));
  };

  // Keep all state arrays in sync with employees array
  useEffect(() => {
    if (openCustomPermissions.length !== employees.length) {
      setOpenCustomPermissions(employees.map(() => false));
    }
    if (openEmployeeCombos.length !== employees.length) {
      setOpenEmployeeCombos(employees.map(() => false));
    }
    if (openRoleCombos.length !== employees.length) {
      setOpenRoleCombos(employees.map(() => false));
    }
  }, [employees, openCustomPermissions.length, openEmployeeCombos.length, openRoleCombos.length]);

  const methods = useForm({
    defaultValues: {
      employees: [{ employeeId: "", roleId: "", customPermissions: [] }],
    },
  });

  // Check if all employees have valid employee and role selections
  const allEmployeesValid = employees.every(
    (employee) => employee.employeeId.trim().length > 0 && employee.roleId.trim().length > 0,
  );

  const handleSubmitForm = async () => {
    if (isSubmittingEmployees) return;

    setIsSubmittingEmployees(true);
    setSubmissionProgress(0);
    setCurrentSubmittingEmployee(0);
    setSubmissionStatus("Starting employee assignment...");

    try {
      const validEmployees = employees.filter((employee) => employee.employeeId.trim() && employee.roleId.trim());
      const totalEmployees = validEmployees.length;

      for (const [index, employee] of validEmployees.entries()) {
        setCurrentSubmittingEmployee(index + 1);
        setSubmissionStatus(`Assigning employee ${index + 1} of ${totalEmployees}...`);

        // Submit the employee assignment
        await onSubmit(employee);

        // Update progress
        const progress = ((index + 1) / totalEmployees) * 100;
        setSubmissionProgress(progress);
      }

      setSubmissionStatus("All employees assigned successfully!");

      // Close dialog after successful completion
      setTimeout(() => {
        onCancel(new Event("submit") as any);
      }, 1500); // Give user time to see success message
    } catch {
      setSubmissionStatus("Error assigning employees. Please try again.");
    } finally {
      setIsSubmittingEmployees(false);
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

  // Helper functions to get names from IDs
  const getEmployeeName = (employeeId: string) => {
    const employee = availableEmployees.find((emp) => emp.id === employeeId);
    return employee ? `${employee.name} (${employee.email})` : "";
  };

  const getRoleName = (roleId: string) => {
    const role = availableRoles.find((role) => role.id === roleId);
    return role ? role.name : "";
  };

  return (
    <FormProvider {...methods}>
      <div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmitForm();
          }}
          className="space-y-4"
        >
          {/* Progress Bar - Shows during submission */}
          {isSubmittingEmployees && (
            <div className="bg-primary/5 border-primary/20 space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className="text-primary text-sm font-medium">Assigning Employees</span>
                <span className="text-muted-foreground text-sm">
                  {currentSubmittingEmployee} of {employees.filter((employee) => employee.employeeId.trim()).length}
                </span>
              </div>
              <div className="space-y-2">
                <Progress value={submissionProgress} className="h-2" />
                <div className="text-muted-foreground flex justify-between text-xs">
                  <span>Progress: {Math.round(submissionProgress)}%</span>
                  <span className="font-medium">{submissionStatus}</span>
                </div>
              </div>
            </div>
          )}

          <section className="flex items-center justify-between">
            <p className="text-lg font-semibold">Add Employee(s) to Team</p>
            <p
              className="text-primary flex cursor-pointer items-center gap-1 text-sm font-medium"
              onClick={addNewEmployee}
            >
              <Plus className="h-4 w-4" /> Add New Employee
            </p>
          </section>

          <section className="max-h-[50vh] space-y-4 overflow-y-auto">
            {[...employees].reverse().map((employee, originalIndex) => {
              const index = employees.length - 1 - originalIndex; // Calculate original index for state updates
              const isEmployeeValid = employee.employeeId.trim().length > 0 && employee.roleId.trim().length > 0;
              return (
                <section
                  key={index}
                  className={`space-y-4 rounded-lg p-4 ${isEmployeeValid ? "bg-primary/5" : "bg-destructive/5 border-destructive/20 border"}`}
                >
                  <section className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold">Employee {index + 1}</p>
                      {!isEmployeeValid && (
                        <span className="text-destructive bg-destructive/10 rounded px-2 py-1 text-xs">
                          {employee.employeeId.trim().length === 0 ? "Employee required" : "Role required"}
                        </span>
                      )}
                    </div>
                    {employees.length > 1 && (
                      <p
                        className="text-destructive flex cursor-pointer items-center gap-1 text-xs font-medium"
                        onClick={() => removeEmployee(index)}
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
                            You can assign this employee to a role and customize their permissions. These settings can
                            be changed later.
                          </p>
                        </div>
                      </div>
                      {/* Hidden fields for edit mode to maintain form validation */}
                      <FormField
                        name="employeeId"
                        label="Search Employee"
                        type="text"
                        placeholder="Type to search employee..."
                        className="h-[48px] w-full shadow-none"
                      />
                      <FormField
                        name="roleId"
                        label="Assign to Role"
                        type="select"
                        placeholder="Select a role..."
                        className="h-[48px] w-full shadow-none"
                      />
                    </>
                  ) : (
                    <>
                      <Card className={`border-none bg-transparent p-0 shadow-none`}>
                        <CardContent className={`p-0`}>
                          <div className="space-y-4">
                            <div>
                              <label className="mb-2 block text-sm font-medium text-gray-700">Search Employee</label>
                              <Popover open={openEmployeeCombos[index]} onOpenChange={() => toggleEmployeeCombo(index)}>
                                <PopoverTrigger asChild>
                                  <button
                                    type="button"
                                    className={cn(
                                      "border-input bg-background ring-offset-background focus-visible:ring-ring flex h-[48px] w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                                      !employee.employeeId && "text-muted-foreground",
                                    )}
                                  >
                                    {employee.employeeId ? getEmployeeName(employee.employeeId) : "Select employee..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 shadow-none lg:w-[588px]" align="start">
                                  <Command className="">
                                    <CommandInput placeholder="Search employees..." />
                                    <CommandList>
                                      <CommandEmpty>No employees found.</CommandEmpty>
                                      <CommandGroup>
                                        {availableEmployees.map((emp) => (
                                          <CommandItem
                                            key={emp.id}
                                            value={`${emp.name} ${emp.email}`}
                                            onSelect={() => {
                                              updateEmployee(index, "employeeId", emp.id);
                                              toggleEmployeeCombo(index);
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                employee.employeeId === emp.id ? "opacity-100" : "opacity-0",
                                              )}
                                            />
                                            <div>
                                              <div className="font-medium">{emp.name}</div>
                                              <div className="text-muted-foreground text-sm">{emp.email}</div>
                                            </div>
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </div>
                            <div>
                              <label className="mb-2 block text-sm font-medium text-gray-700">Assign to Role</label>
                              <Popover open={openRoleCombos[index]} onOpenChange={() => toggleRoleCombo(index)}>
                                <PopoverTrigger asChild>
                                  <button
                                    type="button"
                                    className={cn(
                                      "border-input bg-background ring-offset-background focus-visible:ring-ring flex h-[48px] w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                                      !employee.roleId && "text-muted-foreground",
                                    )}
                                  >
                                    {employee.roleId ? getRoleName(employee.roleId) : "Select a role..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 shadow-none lg:w-[588px]" align="start">
                                  <Command>
                                    <CommandInput placeholder="Search roles..." />
                                    <CommandList>
                                      <CommandEmpty>No roles found.</CommandEmpty>
                                      <CommandGroup>
                                        {availableRoles.map((role) => (
                                          <CommandItem
                                            key={role.id}
                                            value={role.name}
                                            onSelect={() => {
                                              updateEmployee(index, "roleId", role.id);
                                              toggleRoleCombo(index);
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                employee.roleId === role.id ? "opacity-100" : "opacity-0",
                                              )}
                                            />
                                            <div>
                                              <div className="font-medium">{role.name}</div>
                                              {role.description && (
                                                <div className="text-muted-foreground text-sm">{role.description}</div>
                                              )}
                                            </div>
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                  {/* 
                  <p
                    onClick={() => toggleCustomPermissions(index)}
                    className="text-primary hover:text-primary/80 cursor-pointer text-sm font-medium transition-colors"
                  >
                    {openCustomPermissions[index] ? "Hide custom permissions" : "Customize this employee's role access"}
                  </p> */}

                  {/* Custom Permissions Section */}
                  {openCustomPermissions[index] && (
                    <Card className={`border-none bg-transparent p-0 shadow-none`}>
                      <CardHeader className={`p-0`}>
                        <CardTitle className="text-lg">Customize Employee Permissions</CardTitle>
                        <p className="text-muted-foreground text-sm">
                          Override the default role permissions for this specific employee.
                        </p>
                      </CardHeader>
                      <CardContent className={`p-0`}>
                        <div className="bg-warning/10 border-warning/20 rounded-lg border p-4">
                          <div className="flex items-center gap-2">
                            <InfoCircle className="text-warning h-4 w-4" />
                            <p className="text-warning text-sm">
                              Custom permissions will override the default role permissions for this employee.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </section>
              );
            })}
          </section>

          {/* Validation Summary */}
          {!allEmployeesValid && (
            <div className="bg-warning/10 border-warning/20 rounded-lg border p-4">
              <div className="flex items-start gap-2">
                <InfoCircle className="text-warning h-4 w-4" />
                <p className="text-muted-foreground text-xs">
                  Please complete all employees by selecting an employee and assigning them to a role.
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
                {isDeleting ? "Deleting..." : "Delete Employee"}
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
              isDisabled={isSubmitting || isDeleting || !allEmployeesValid || isSubmittingEmployees}
              className="w-full"
            >
              {isSubmittingEmployees
                ? `Assigning Employee ${currentSubmittingEmployee}...`
                : isSubmitting
                  ? "Saving..."
                  : isEdit
                    ? "Update Employee"
                    : `Assign ${employees.length} Employee${employees.length > 1 ? "s" : ""}`}
            </MainButton>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};
