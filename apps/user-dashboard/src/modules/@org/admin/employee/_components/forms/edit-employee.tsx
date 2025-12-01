/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PhoneInput } from "@/components/shared/phone-input";
import { employmentTypeOptions, genderOptions, workModeOptions } from "@/lib/tools/constants";
import { usePayrollService } from "@/modules/@org/admin/payroll/services/use-service";
import { EmployeeFormData, employeeSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@workspace/ui/components/label";
import { BreadCrumb, ComboBox, DashboardHeader, ErrorEmptyState, FormField } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import FileUpload from "@workspace/ui/lib/file-upload/file-upload";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { useEmployeeService } from "../../services/use-service";

export const EditEmployeeForm = () => {
  const router = useRouter();
  const searchParameters = useSearchParams();
  const employeeId = searchParameters.get("employeeid");

  const [files, setFiles] = useState<File[]>([]);
  const hasReset = useRef(false);

  // Query hooks
  const { useGetAllTeams, useGetEmployeeById, useUpdateEmployee } = useEmployeeService();
  const { useGetApprovedBanks } = usePayrollService();

  const { data: teams = [], isLoading: loadingTeams } = useGetAllTeams();
  const {
    data: employee,
    isLoading: loadingEmployee,
    isError: isErrorEmployee,
    refetch,
  } = useGetEmployeeById(employeeId || "", {
    enabled: !!employeeId,
  });
  const { data: banksResponse, isLoading: loadingBanks } = useGetApprovedBanks();
  const banks = useMemo(() => banksResponse?.data ?? [], [banksResponse]);

  const { mutateAsync: updateEmployeeMutation } = useUpdateEmployee();

  // Provide stable default values and drive updates via `values` instead of effects
  const defaultValues: EmployeeFormData = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "male",
    startDate: "",
    employmentType: "full time",
    workMode: "remote",
    teamId: "",
    roleId: "",
    baseSalary: 0,
    bankName: "",
    accountName: "",
    accountNumber: "",
    bankCode: "",
    permissions: [],
  };

  const formValues: EmployeeFormData | undefined = useMemo(() => {
    if (!employee) return;

    // Ensure all required enum fields have valid values
    const gender = employee.gender;
    const employmentType = employee.employmentDetails?.employmentType || "full time";
    // Map "on site" to "onsite" to match the schema
    const rawWorkMode = employee.employmentDetails?.workMode || "remote";
    const workMode: "remote" | "onsite" | "hybrid" =
      rawWorkMode === "on site" ? "onsite" : (rawWorkMode as "remote" | "onsite" | "hybrid");

    const teamId =
      employee.employmentDetails?.team?.id !== undefined && employee.employmentDetails?.team?.id !== null
        ? String(employee.employmentDetails.team.id)
        : "";

    const roleId =
      employee.employmentDetails?.role?.id !== undefined && employee.employmentDetails?.role?.id !== null
        ? String(employee.employmentDetails.role.id)
        : "";

    // Normalize phone number - remove non-digit characters and format for E.164
    const normalizePhoneNumber = (phone: string | undefined | null): string => {
      if (!phone) return "";
      // Remove all non-digit characters except +
      const cleaned = phone.replaceAll(/[^\d+]/g, "");
      // If it doesn't start with +, assume US number and add +1
      if (cleaned && !cleaned.startsWith("+")) {
        return `+1${cleaned}`;
      }
      return cleaned || "";
    };

    return {
      firstName: employee.firstName ?? "",
      lastName: employee.lastName ?? "",
      email: employee.email ?? "",
      phoneNumber: normalizePhoneNumber(employee.phoneNumber),
      dateOfBirth: employee.dateOfBirth?.split("T")[0] || "",
      gender: gender,
      startDate: employee.employmentDetails?.startDate?.split("T")[0] || "",
      employmentType: employmentType,
      workMode: workMode as "remote" | "onsite" | "hybrid",
      teamId,
      roleId,
      baseSalary: employee.payProfile.baseSalary ? Number(employee.payProfile.baseSalary) : 0,
      bankName: employee.payProfile.bankName ?? employee.bankName ?? "",
      accountName: employee.payProfile.accountName ?? employee.accountName ?? "",
      accountNumber: employee.payProfile.accountNumber ?? employee.accountNumber ?? "",
      bankCode: "",
      // permissions: employee.employmentDetails.role.permissions ?? [],
    };
  }, [employee]);

  const methods = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    reset,
    setValue,
  } = methods;

  // Combined hydration state for UX control
  const isHydrating = loadingEmployee || loadingTeams || !employeeId;

  // Reset form when employee data is loaded - ONLY ONCE
  useEffect(() => {
    // Defer reset until both employee and teams are loaded to preserve select labels
    if (formValues && !hasReset.current && !loadingEmployee && !loadingTeams) {
      reset(formValues);
      hasReset.current = true;
    }
  }, [formValues, reset, loadingEmployee, loadingTeams]);

  // Reset the hasReset flag when employeeId changes (navigating to different employee)
  useEffect(() => {
    hasReset.current = false;
  }, [employeeId]);

  const selectedTeamId = watch("teamId");
  const selectedRoleId = watch("roleId");
  const selectedBankName = watch("bankName");

  // Auto-set bank code when bank name is selected
  useEffect(() => {
    if (selectedBankName) {
      const selectedBank = banks.find((bank: { name: string; code: string }) => bank.name === selectedBankName);
      if (selectedBank) {
        setValue("bankCode", selectedBank.code);
      }
    }
  }, [selectedBankName, banks, setValue]);

  // Removed excessive logging that causes re-renders

  // Memoize derived team and roles from teams and selectedTeamId
  const selectedTeam = useMemo(() => teams.find((team) => String(team.id) === selectedTeamId), [teams, selectedTeamId]);
  const derivedRoles = useMemo(() => selectedTeam?.roles ?? [], [selectedTeam]);

  // Removed debug logging effects

  // Stable, memoized options for selects with fallbacks to preserve current values
  const teamOptions = useMemo(() => {
    const base = teams.map((team) => ({ value: String(team.id), label: team.name }));
    const currentTeamId = formValues?.teamId || selectedTeamId;
    if (currentTeamId && !base.some((opt) => opt.value === currentTeamId)) {
      base.push({ value: currentTeamId, label: employee?.employmentDetails?.team?.name || "Current team" });
    }
    return base;
  }, [teams, formValues?.teamId, selectedTeamId, employee?.employmentDetails?.team?.name]);

  const roleOptions = useMemo(() => {
    const rolesArray = Array.isArray(derivedRoles) ? derivedRoles : [];
    const base = rolesArray.map((role: any) => ({ value: String(role.id), label: role.name }));
    const currentRoleId = formValues?.roleId || selectedRoleId;
    if (currentRoleId && !base.some((opt: { value: string }) => opt.value === currentRoleId)) {
      base.push({ value: currentRoleId, label: employee?.employmentDetails?.role?.name || "Current role" });
    }
    return base;
  }, [derivedRoles, formValues?.roleId, selectedRoleId, employee?.employmentDetails?.role?.name]);

  const handleFilesSelected = (files: File[]) => {
    setFiles(files);
  };

  const onSubmit = async (formData: EmployeeFormData) => {
    if (!employeeId) {
      toast.error("No employee specified");
      return router.push("/admin/employees");
    }

    const formDataToSend = new FormData();

    // Add all fields from the form
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phoneNumber", formData.phoneNumber);

    // Team and role
    formDataToSend.append("teamId", formData.teamId);
    formDataToSend.append("roleId", formData.roleId);

    // Add document if uploaded
    if (files.length > 0) {
      formDataToSend.append("document", files[0]);
    }

    // Personal info
    formDataToSend.append("dateOfBirth", new Date(formData.dateOfBirth).toISOString());
    formDataToSend.append("gender", formData.gender);

    // Employment info
    formDataToSend.append("startDate", new Date(formData.startDate).toISOString());
    formDataToSend.append("employmentType", formData.employmentType);
    formDataToSend.append("workMode", formData.workMode);

    // Salary details
    formDataToSend.append("baseSalary", formData.baseSalary.toString());
    formDataToSend.append("bankName", formData.bankName);
    formDataToSend.append("accountName", formData.accountName);
    formDataToSend.append("accountNumber", formData.accountNumber);
    formDataToSend.append("bankCode", formData.bankCode);

    // Optional permissions
    if (formData.permissions && formData.permissions.length > 0) {
      for (const [index, permission] of formData.permissions.entries()) {
        formDataToSend.append(`permissions[${index}]`, permission);
      }
    }

    await updateEmployeeMutation(
      { id: employeeId, data: formDataToSend },
      {
        onSuccess: async () => {
          toast.success("Employee Profile Updated");
          router.push(`/admin/employees/${employeeId}`);
        },
        onError: (error) => {
          const errorMessage = error instanceof AxiosError ? error.response?.data.message : "Failed to update employee";
          toast.error(`Oops, Something went wrong!`, {
            description: errorMessage,
          });
        },
      },
    );
  };

  if (isErrorEmployee) {
    return <ErrorEmptyState onRetry={refetch} />;
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb and Title */}
      <DashboardHeader
        title={"Edit Employee"}
        subtitle={
          <BreadCrumb
            items={[
              { label: "Employee", href: "/admin/employees" },
              { label: "Edit Employee", href: "" },
            ]}
            showHome={true}
          />
        }
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-10">
            {/* Personal Information Section */}
            <section className="">
              <h2 className="mb-4 text-lg font-semibold">Personal Information</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
                <FormField
                  name="firstName"
                  label="First Name"
                  type="text"
                  placeholder={loadingEmployee ? `Loading first name...` : `John`}
                  className="border-border !h-14 w-full"
                  disabled={isHydrating || isSubmitting}
                  required
                />
                <FormField
                  name="lastName"
                  label="Last Name"
                  type="text"
                  className="border-border !h-14 w-full"
                  placeholder={loadingEmployee ? `Loading last name...` : `Doe`}
                  disabled={isHydrating || isSubmitting}
                  required
                />
                <FormField
                  name="dateOfBirth"
                  placeholder={loadingEmployee ? `Loading date of birth...` : ``}
                  label="Date of Birth"
                  className="border-border !h-14 w-full"
                  type="date"
                  disabled={isHydrating || isSubmitting}
                  required
                />
                <FormField
                  name="gender"
                  label="Gender"
                  type="select"
                  placeholder={isHydrating ? `Loading employee gender...` : `Select employee gender`}
                  className="bg-background border-border !h-14 w-full"
                  options={genderOptions}
                  disabled={isHydrating || isSubmitting}
                  required
                />
                <FormField
                  name="email"
                  label="Work Email"
                  type="email"
                  placeholder={loadingEmployee ? `Loading email...` : `Johndoe@gmail.com`}
                  className="border-border !h-14 w-full"
                  disabled={isHydrating || isSubmitting}
                  required
                />
                <div className="space-y-2">
                  <Label className="text-[16px] font-medium">
                    Phone Number<span className="text-destructive -ml-1">*</span>
                  </Label>
                  <Controller
                    name="phoneNumber"
                    control={methods.control}
                    render={({ field: { value, onChange }, fieldState }) => (
                      <>
                        <PhoneInput
                          value={value || undefined}
                          onChange={(value_) => {
                            onChange(value_ || "");
                          }}
                          defaultCountry="US"
                          placeholder="Enter phone number"
                          inputClassName="border-border !h-14"
                          buttonClassName="border-border !h-14"
                          aria-invalid={!!fieldState.error}
                          disabled={isHydrating || isSubmitting}
                        />
                        {fieldState.error && <p className="text-destructive text-sm">{fieldState.error.message}</p>}
                      </>
                    )}
                  />
                </div>
              </div>
            </section>

            {/* Employment Details Section */}
            <section>
              <h2 className="mb-4 text-lg font-semibold">Employment Details</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
                <FormField
                  name="startDate"
                  className="border-border !h-14 w-full"
                  label="Start Date"
                  type="date"
                  disabled={isHydrating || isSubmitting}
                  required
                />
                <FormField
                  name="employmentType"
                  className="bg-background border-border !h-14 w-full"
                  label="Employment Type"
                  type="select"
                  placeholder={isHydrating ? `Loading employee type...` : `Select employment type`}
                  options={employmentTypeOptions}
                  disabled={isHydrating || isSubmitting}
                  required
                />
                <FormField
                  name="workMode"
                  label="Work Mode"
                  type="select"
                  placeholder={isHydrating ? `Loading employee work mode...` : `Select employee work mode`}
                  className="bg-background border-border !h-14 w-full"
                  options={workModeOptions}
                  disabled={isHydrating || isSubmitting}
                  required
                />
                <FormField
                  name="teamId"
                  label="Department"
                  type="select"
                  placeholder={isHydrating ? `Loading department...` : `Select a department`}
                  className="bg-background border-border !h-14 w-full"
                  options={teamOptions}
                  disabled={isHydrating || isSubmitting}
                  required
                />
                <FormField
                  name="roleId"
                  label="Role"
                  type="select"
                  placeholder={isHydrating || !selectedTeamId ? `Select a role` : `Select a role`}
                  className="bg-background border-border !h-14 w-full"
                  options={roleOptions}
                  disabled={!selectedTeamId || isHydrating || isSubmitting}
                  required
                />
              </div>
            </section>

            {/* Salary Details Section */}
            <section>
              <h2 className="mb-4 text-lg font-semibold">Salary Details</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
                <FormField
                  name="baseSalary"
                  label="Base Salary"
                  type="number"
                  placeholder={isHydrating ? `Loading base salary...` : `800000`}
                  className="border-border !h-14 w-full"
                  disabled={isHydrating || isSubmitting}
                  required
                />
                <div className="space-y-2">
                  <Label className="text-[16px] font-medium">
                    Bank Name<span className="text-destructive -ml-1">*</span>
                  </Label>
                  <Controller
                    name="bankName"
                    control={methods.control}
                    render={({ field: { value, onChange }, fieldState }) => (
                      <>
                        <ComboBox
                          // readOnly
                          value={value || ""}
                          onValueChange={onChange}
                          options={banks.map((bank: { name: string; code: string }) => ({
                            value: bank.name,
                            label: bank.name,
                          }))}
                          placeholder={loadingBanks ? "Loading banks..." : isHydrating ? "Loading..." : "Select a bank"}
                          searchPlaceholder="Search banks..."
                          emptyMessage="No bank found."
                          disabled={loadingBanks || isHydrating || isSubmitting}
                          className="h-14 w-full"
                        />
                        {fieldState.error && <p className="text-destructive text-sm">{fieldState.error.message}</p>}
                      </>
                    )}
                  />
                </div>
                <FormField
                  // readOnly
                  name="accountName"
                  label="Account Name"
                  type="text"
                  placeholder={isHydrating ? `Loading account name...` : `John Doe`}
                  className="border-border !h-14 w-full"
                  disabled={isHydrating || isSubmitting}
                  required
                />
                <FormField
                  // readOnly
                  name="accountNumber"
                  label="Account Number"
                  type="text"
                  placeholder={isHydrating ? `Loading account number...` : `0323904127`}
                  className="border-border !h-14 w-full"
                  disabled={isHydrating || isSubmitting}
                  required
                />
              </div>
            </section>

            {/* Documents Section */}
            <section>
              <h2 className="mb-4 text-lg font-semibold">Employee Documents</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
                <FileUpload onFileChange={handleFilesSelected} acceptedFileTypes=".pdf,.doc,.docx" maxFiles={3} />
              </div>
            </section>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex w-[50%] justify-start gap-4">
            <MainButton
              type="button"
              variant="outline"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.preventDefault();
                event.stopPropagation();
                reset(formValues);
              }}
              isDisabled={isSubmitting}
              className="text-destructive border-destructive w-full"
            >
              Cancel
            </MainButton>
            <MainButton variant={`primary`} type="submit" isDisabled={isSubmitting} className="w-full">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </MainButton>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export const EmployeeEditForm = EditEmployeeForm;
