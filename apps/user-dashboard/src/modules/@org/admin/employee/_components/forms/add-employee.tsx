/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// import { AlertDialog } from "@/components/ui/alert-dialog";
import { employmentTypeOptions, genderOptions, workModeOptions } from "@/lib/tools/constants";
import { usePayrollService } from "@/modules/@org/admin/payroll/services/use-service";
import { EmployeeFormData, employeeSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@workspace/ui/components/label";
import { BreadCrumb, ComboBox, DashboardHeader, FormField } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { useEmployeeService } from "../../services/use-service";
import { PhoneInput } from "@/components/shared/phone-input";
import FileUpload from "@workspace/ui/lib/file-upload/file-upload";

export const AddEmployeeForm = () => {
  const router = useRouter();

  const [files, setFiles] = useState<File[]>([]);
  // Derive roles from the selected team to avoid repeated state updates
  const [roles, _setRoles] = useState<{ id: string; name: string }[]>([]);

  // Query hooks
  const { useGetAllTeams, useCreateEmployee } = useEmployeeService();
  const { useGetApprovedBanks } = usePayrollService();

  const { data: teams = [], isLoading: loadingTeams } = useGetAllTeams();
  const { data: banksResponse, isLoading: loadingBanks } = useGetApprovedBanks();
  const banks = useMemo(() => banksResponse?.data ?? [], [banksResponse]);
  const { mutateAsync: createEmployeeMutation, isPending: isSubmitting } = useCreateEmployee();
  // const [showAlert, setShowAlert] = useState(false);
  // const [alertTitle, setAlertTitle] = useState("");
  // const [alertDescription, setAlertDescription] = useState("");

  const methods = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  });

  const {
    handleSubmit,
    watch,
    setValue,
    // reset,
  } = methods;

  const selectedTeamId = watch("teamId");
  const selectedBankName = watch("bankName");

  // Memoize derived team and roles to prevent re-renders triggering an effect loop
  const selectedTeam = useMemo(() => teams.find((team) => String(team.id) === selectedTeamId), [teams, selectedTeamId]);
  type RoleInput = { id: string | number; name: string };
  type RoleLite = { id: string; name: string };
  const normalizedDerivedRoles = useMemo<RoleLite[]>(
    () =>
      ((selectedTeam?.roles ?? []) as RoleInput[]).map((r) => ({
        id: String(r.id),
        name: r.name,
      })),
    [selectedTeam],
  );

  // Keep local roles state in sync only when it actually changes (prevents infinite loops)
  useEffect(() => {
    // Shallow compare by length and ids to avoid unnecessary setState
    const sameLength = roles.length === normalizedDerivedRoles.length;
    const rolesChanged = !sameLength || !roles.every((role, index) => role.id === normalizedDerivedRoles[index]?.id);
    if (rolesChanged) {
      _setRoles(normalizedDerivedRoles);
    }
  }, [normalizedDerivedRoles, roles]);

  // Reset roleId when team changes and current role is invalid
  const selectedRoleId = watch("roleId");
  useEffect(() => {
    // If no team is selected and a role is set, clear it
    if (!selectedTeamId && selectedRoleId) {
      setValue("roleId", "");
      return;
    }

    // If team is selected but current role does not exist in that team, clear it
    if (selectedTeamId && selectedRoleId && !normalizedDerivedRoles.some((r: any) => r.id === selectedRoleId)) {
      setValue("roleId", "");
    }
  }, [selectedTeamId, selectedRoleId, normalizedDerivedRoles, setValue]);

  // Auto-set bank code when bank name is selected
  useEffect(() => {
    if (selectedBankName) {
      const selectedBank = banks.find((bank: any) => bank.name === selectedBankName);
      if (selectedBank) {
        setValue("bankCode", selectedBank.code);
      }
    }
  }, [selectedBankName, banks, setValue]);

  const handleFilesSelected = (files: File[]) => {
    setFiles(files);
  };

  const onSubmit = async (formData: EmployeeFormData) => {
    const formDataToSend = new FormData();

    // Add all fields from the form
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phoneNumber", formData.phoneNumber);

    // Add password for new employees
    formDataToSend.append("password", "PleaseSetAdefaultHere1.");

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
    formDataToSend.append("employmentType", formData.employmentType || "");
    formDataToSend.append("workMode", formData.workMode || "");

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

    // Call create employee
    createEmployeeMutation(formDataToSend, {
      onSuccess: () => {
        // Invalidate or update any relevant queries here if needed
        toast.success("Employee Added Successfully");
        router.push("/admin/employees");
      },
      onError: (error: any) => {
        toast.error("Something went wrong", { description: error?.response?.data?.message });
      },
    });
  };

  // if (loadingTeams) {
  //   return <EmployeeFormSkeleton />;
  // }

  // const handleAlertClose = () => {
  //   setShowAlert(false);
  //   router.push("/admin/employees");
  // };

  return (
    <div className="space-y-8">
      {/* Breadcrumb and Title */}
      <DashboardHeader
        title={"Add Employee"}
        subtitle={
          <BreadCrumb
            items={[
              { label: "Employee", href: "/admin/employees" },
              { label: "Add Employee", href: "" },
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
                  placeholder={loadingTeams ? `Loading first name...` : `John`}
                  className="border-border !h-14 w-full"
                  required
                />
                <FormField
                  name="lastName"
                  label="Last Name"
                  type="text"
                  className="border-border !h-14 w-full"
                  placeholder={loadingTeams ? `Loading last name...` : `Doe`}
                  required
                />
                <FormField
                  name="dateOfBirth"
                  placeholder={loadingTeams ? `Loading date of birth...` : ``}
                  label="Date of Birth"
                  className="border-border !h-14 w-full"
                  type="date"
                  required
                />
                <FormField
                  name="gender"
                  label="Gender"
                  type="select"
                  placeholder={loadingTeams ? `Loading employee gender...` : `Select employee gender`}
                  className="bg-background border-border !h-14 w-full"
                  options={genderOptions}
                  required
                />
                <FormField
                  name="email"
                  label="Work Email"
                  type="email"
                  placeholder={loadingTeams ? `Loading email...` : `Johndoe@gmail.com`}
                  className="border-border !h-14 w-full"
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
                          placeholder={loadingTeams ? "Loading phone number..." : "Enter phone number"}
                          inputClassName="border-border !h-14"
                          buttonClassName="border-border !h-14"
                          aria-invalid={!!fieldState.error}
                          disabled={loadingTeams || isSubmitting}
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
                  required
                />
                <FormField
                  name="employmentType"
                  className="bg-background border-border !h-14 w-full"
                  label="Employment Type"
                  type="select"
                  placeholder={loadingTeams ? `Loading employee type...` : `Select employment type`}
                  options={employmentTypeOptions}
                  required
                />
                <FormField
                  name="workMode"
                  label="Work Mode"
                  type="select"
                  placeholder={loadingTeams ? `Loading employee work mode...` : `Select employee work mode`}
                  className="bg-background border-border !h-14 w-full"
                  options={workModeOptions}
                  required
                />
                <FormField
                  name="teamId"
                  label="Department"
                  type="select"
                  placeholder={loadingTeams ? `Loading department...` : `Select a department`}
                  className="bg-background border-border !h-14 w-full"
                  options={teams.map((team) => ({
                    value: String(team.id),
                    label: team.name,
                  }))}
                  required
                />
                <FormField
                  name="roleId"
                  label="Role"
                  type="select"
                  placeholder={`Select a role`}
                  className="bg-background border-border !h-14 w-full"
                  options={roles.map((role) => ({
                    value: role.id,
                    label: role.name,
                  }))}
                  disabled={!selectedTeamId}
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
                  placeholder="e.g 100000"
                  className="border-border !h-14 w-full"
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
                          value={value || ""}
                          onValueChange={onChange}
                          options={banks.map((bank: any) => ({
                            value: bank.name,
                            label: bank.name,
                          }))}
                          placeholder={
                            loadingBanks ? "Loading banks..." : loadingTeams ? "Loading..." : "Select a bank"
                          }
                          searchPlaceholder="Search banks..."
                          emptyMessage="No bank found."
                          disabled={loadingBanks || loadingTeams || isSubmitting}
                          className="h-14 w-full"
                        />
                        {fieldState.error && <p className="text-destructive text-sm">{fieldState.error.message}</p>}
                      </>
                    )}
                  />
                </div>
                <FormField
                  name="accountName"
                  label="Account Name"
                  type="text"
                  placeholder="John Doe"
                  className="border-border !h-14 w-full"
                  required
                />
                <FormField
                  name="accountNumber"
                  label="Account Number"
                  type="text"
                  placeholder="0323904127"
                  className="border-border !h-14 w-full"
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
              variant="destructiveOutline"
              onClick={() => router.push("/admin/employees")}
              isDisabled={isSubmitting}
              className="text-destructive border-destructive w-full"
            >
              Cancel
            </MainButton>
            <MainButton variant={`primary`} type="submit" isDisabled={isSubmitting} className="w-full">
              {isSubmitting ? "Saving..." : "Save Employee"}
            </MainButton>
          </div>
        </form>
      </FormProvider>
      {/* <AlertDialog open={showAlert} onOpenChange={handleAlertClose} title={alertTitle} description={alertDescription} /> */}
    </div>
  );
};

export const EmployeeForm = AddEmployeeForm;
