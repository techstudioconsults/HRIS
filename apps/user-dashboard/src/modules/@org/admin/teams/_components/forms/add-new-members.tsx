/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEmployeeService } from "@/modules/@org/admin/employee/services/use-service";
import { Card, CardContent } from "@workspace/ui/components/card";
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
import { MainButton } from "@workspace/ui/lib/button";
import { cn } from "@workspace/ui/lib/utils";
import { Check, ChevronsUpDown, Plus, Trash } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

interface MemberAssignment {
  employeeId: string;
  roleId: string; // optional depending on use-case
}

interface RoleLite {
  id: string;
  name: string;
  description?: string;
}
interface AddNewMembersProperties {
  parentTeamId: string; // team whose current members should be available
  availableRoles?: RoleLite[];
  onSubmit: (data: MemberAssignment) => Promise<void>;
  onCancel: (event: FormEvent) => void;
  isSubmitting?: boolean;
}

export const AddNewMembers = ({
  parentTeamId,
  availableRoles = [],
  onSubmit,
  onCancel,
  isSubmitting = false,
}: AddNewMembersProperties) => {
  const [assignments, setAssignments] = useState<MemberAssignment[]>([{ employeeId: "", roleId: "" }]);
  const [openEmployeeCombos, setOpenEmployeeCombos] = useState<boolean[]>([false]);
  const [openRoleCombos, setOpenRoleCombos] = useState<boolean[]>([false]);
  const [isBatchSubmitting, setIsBatchSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [statusText, setStatusText] = useState("Ready to assign members...");

  const { useGetAllEmployees } = useEmployeeService();
  // Normalize parentTeamId in case a team object was passed accidentally.
  const normalizedTeamId = typeof parentTeamId === "string" ? parentTeamId : (parentTeamId as any)?.id || "";
  const { data: employeesData } = useGetAllEmployees(normalizedTeamId ? { teamId: normalizedTeamId } : {});
  const employees = employeesData?.data?.items || [];

  // RHF (minimal usage for consistency)
  const methods = useForm({ defaultValues: { assignments: [{ employeeId: "", roleId: "" }] } });

  // Derived validation
  const allValid = assignments.every(
    (a) => a.employeeId.trim().length > 0 && (availableRoles.length === 0 || a.roleId.trim().length > 0),
  );

  const addRow = () => {
    setAssignments((previousAssignments) => [...previousAssignments, { employeeId: "", roleId: "" }]);
    setOpenEmployeeCombos((previousCombos) => [...previousCombos, false]);
    setOpenRoleCombos((previousRoleCombos) => [...previousRoleCombos, false]);
  };

  const removeRow = (index: number) => {
    if (assignments.length === 1) return;
    setAssignments((previousAssignments) => previousAssignments.filter((_, index_) => index_ !== index));
    setOpenEmployeeCombos((previousCombos) => previousCombos.filter((_, index_) => index_ !== index));
    setOpenRoleCombos((previousRoleCombos) => previousRoleCombos.filter((_, index_) => index_ !== index));
  };

  const updateAssignment = (index: number, field: keyof MemberAssignment, value: string) => {
    setAssignments((previousAssignments) =>
      previousAssignments.map((row, index_) => (index_ === index ? { ...row, [field]: value } : row)),
    );
  };

  useEffect(() => {
    if (openEmployeeCombos.length !== assignments.length) setOpenEmployeeCombos(assignments.map(() => false));
    if (openRoleCombos.length !== assignments.length) setOpenRoleCombos(assignments.map(() => false));
  }, [assignments, openEmployeeCombos.length, openRoleCombos.length]);

  const toggleEmployeeCombo = (index: number) => {
    setOpenEmployeeCombos((previousCombos) =>
      previousCombos.map((openValue, index_) => (index_ === index ? !openValue : openValue)),
    );
  };
  const toggleRoleCombo = (index: number) => {
    setOpenRoleCombos((previousRoleCombos) =>
      previousRoleCombos.map((openValue, index_) => (index_ === index ? !openValue : openValue)),
    );
  };

  const getEmployeeLabel = (id: string) => {
    const employee = employees.find((employee_: Employee) => employee_.id === id);
    return employee
      ? `${employee.firstName || ""} ${employee.lastName || ""}`.trim() + (employee.email ? ` (${employee.email})` : "")
      : "";
  };
  const getRoleLabel = (id: string) => availableRoles.find((r) => r.id === id)?.name || "";

  const handleSubmitForm = async () => {
    if (isBatchSubmitting) return;
    setIsBatchSubmitting(true);
    setProgress(0);
    setCurrentIndex(0);
    setStatusText("Starting assignment...");

    const valid = assignments.filter((a) => a.employeeId.trim() && (availableRoles.length === 0 || a.roleId.trim()));
    const total = valid.length;
    if (total === 0) {
      toast.error("Please add at least one valid member assignment.");
      setIsBatchSubmitting(false);
      return;
    }

    try {
      for (const [assignmentIndex, assignment] of valid.entries()) {
        setCurrentIndex(assignmentIndex + 1);
        setStatusText(`Assigning member ${assignmentIndex + 1} of ${total}...`);
        await onSubmit(assignment);
        setProgress(((assignmentIndex + 1) / total) * 100);
        if (assignmentIndex < valid.length - 1) await new Promise((resolve) => setTimeout(resolve, 250));
      }
      setStatusText("All members assigned successfully!");
      toast.success(`Assigned ${total} member${total > 1 ? "s" : ""}.`);
      setTimeout(() => onCancel(new Event("submit") as any), 1200);
    } catch {
      toast.error("Failed to complete all assignments.");
      setStatusText("Encountered errors during assignment.");
    } finally {
      setTimeout(() => {
        setIsBatchSubmitting(false);
        setProgress(0);
        setCurrentIndex(0);
      }, 1500);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(event_) => {
          event_.preventDefault();
          handleSubmitForm();
        }}
        className="space-y-4"
      >
        {isBatchSubmitting && (
          <div className="bg-primary/5 border-primary/20 space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-primary text-sm font-medium">Assigning Members</span>
              <span className="text-muted-foreground text-sm">
                {currentIndex} of {assignments.filter((a) => a.employeeId.trim()).length}
              </span>
            </div>
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="text-muted-foreground flex justify-between text-xs">
                <span>Progress: {Math.round(progress)}%</span>
                <span className="font-medium">{statusText}</span>
              </div>
            </div>
          </div>
        )}

        <section className="flex items-center justify-between">
          <p className="text-lg font-semibold">Add Member(s) to Sub-team</p>
          <p className="text-primary flex cursor-pointer items-center gap-1 text-sm font-medium" onClick={addRow}>
            <Plus className="h-4 w-4" /> Add Member
          </p>
        </section>
        {/* Removed fallback hint; now we strictly query by teamId */}

        <section className="max-h-[50vh] space-y-4 overflow-y-auto">
          {[...assignments].reverse().map((assignment, reversedIndex) => {
            const index = assignments.length - 1 - reversedIndex;
            const isValid =
              assignment.employeeId.trim().length > 0 &&
              (availableRoles.length === 0 || assignment.roleId.trim().length > 0);
            return (
              <section
                key={index}
                className={cn(
                  "space-y-4 rounded-lg p-4",
                  isValid ? "bg-primary/5" : "bg-destructive/5 border-destructive/20 border",
                )}
              >
                <section className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold">Member {index + 1}</p>
                    {!isValid && (
                      <span className="text-destructive bg-destructive/10 rounded px-2 py-1 text-xs">
                        {assignment.employeeId.trim().length === 0 ? "Member required" : "Role required"}
                      </span>
                    )}
                  </div>
                  {assignments.length > 1 && (
                    <p
                      className="text-destructive flex cursor-pointer items-center gap-1 text-xs font-medium"
                      onClick={() => removeRow(index)}
                    >
                      <Trash className="size-4" /> Remove
                    </p>
                  )}
                </section>
                <Card className="border-none bg-transparent p-0 shadow-none">
                  <CardContent className="p-0">
                    <div className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium">Select Member</label>
                        <Popover open={openEmployeeCombos[index]} onOpenChange={() => toggleEmployeeCombo(index)}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className={cn(
                                "border-input bg-background ring-offset-background focus-visible:ring-ring flex h-[48px] w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2",
                                !assignment.employeeId && "text-muted-foreground",
                              )}
                            >
                              {assignment.employeeId ? getEmployeeLabel(assignment.employeeId) : "Select member..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0 shadow-none lg:w-[588px]" align="start">
                            <Command>
                              <CommandInput placeholder="Search members..." />
                              <CommandList>
                                <CommandEmpty>No members found.</CommandEmpty>
                                <CommandGroup>
                                  {employees.map((emp: Employee) => (
                                    <CommandItem
                                      key={emp.id}
                                      value={`${emp.firstName} ${emp.lastName} ${emp.email}`}
                                      onSelect={() => {
                                        updateAssignment(index, "employeeId", emp.id);
                                        toggleEmployeeCombo(index);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          assignment.employeeId === emp.id ? "opacity-100" : "opacity-0",
                                        )}
                                      />
                                      <div>
                                        <div className="font-medium">
                                          {emp.firstName} {emp.lastName}
                                        </div>
                                        {emp.email && <div className="text-muted-foreground text-sm">{emp.email}</div>}
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      {availableRoles.length > 0 && (
                        <div>
                          <label className="mb-2 block text-sm font-medium">Assign Role</label>
                          <Popover open={openRoleCombos[index]} onOpenChange={() => toggleRoleCombo(index)}>
                            <PopoverTrigger asChild>
                              <button
                                type="button"
                                className={cn(
                                  "border-input bg-background ring-offset-background focus-visible:ring-ring flex h-[48px] w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2",
                                  !assignment.roleId && "text-muted-foreground",
                                )}
                              >
                                {assignment.roleId ? getRoleLabel(assignment.roleId) : "Select role..."}
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
                                          updateAssignment(index, "roleId", role.id);
                                          toggleRoleCombo(index);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            assignment.roleId === role.id ? "opacity-100" : "opacity-0",
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
                      )}
                    </div>
                  </CardContent>
                </Card>
              </section>
            );
          })}
        </section>

        {!allValid && (
          <div className="bg-warning/10 border-warning/20 rounded-lg border p-4">
            <p className="text-warning text-xs">
              Complete all member rows: select a member and role (if roles enabled).
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row">
          <MainButton
            type="button"
            variant="outline"
            onClick={onCancel}
            isDisabled={isSubmitting || isBatchSubmitting}
            className="w-full"
          >
            Cancel
          </MainButton>
          <MainButton
            type="submit"
            variant="primary"
            isDisabled={isSubmitting || isBatchSubmitting || !allValid}
            className="w-full"
          >
            {isBatchSubmitting
              ? `Assigning Member ${currentIndex}...`
              : `Assign ${assignments.length} Member${assignments.length > 1 ? "s" : ""}`}
          </MainButton>
        </div>
      </form>
    </FormProvider>
  );
};

export default AddNewMembers;
