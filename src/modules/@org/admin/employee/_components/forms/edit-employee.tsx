/* eslint-disable no-console */
"use client";

import { BreadCrumb } from "@/components/shared/breadcrumb";
import MainButton from "@/components/shared/button";
import { DashboardHeader } from "@/components/shared/dashboard/dashboard-header";
import { FormField } from "@/components/shared/inputs/FormFields";
import { PhoneInput } from "@/components/shared/inputs/phone-input";
import { Label } from "@/components/ui/label";
import { employmentTypeOptions, genderOptions, workModeOptions } from "@/lib/tools/constants";
import { EmployeeFormData, employeeSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import FileUpload from "../../../_components/file-upload/file-upload";
import { useEmployeeService } from "../../services/use-service";

export const EditEmployeeForm = () => {
  const router = useRouter();
  const searchParameters = useSearchParams();
  const employeeId = searchParameters.get("employeeid");

  const [files, setFiles] = useState<File[]>([]);

  // Query hooks
  const { useGetAllTeams, useGetEmployeeById, useUpdateEmployee } = useEmployeeService();

  const { data: teams = [], isLoading: loadingTeams } = useGetAllTeams();
  const { data: employee } = useGetEmployeeById(employeeId || "", {
    enabled: !!employeeId,
  });

  const updateEmployeeMutation = useUpdateEmployee();

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
  };

  const formValues: EmployeeFormData | undefined = useMemo(() => {
    if (!employee) return;

    // Ensure all required enum fields have valid values
    const gender = employee.gender;
    const employmentType = employee.employmentDetails?.employmentType || "full time";
    const workMode = employee.employmentDetails?.workMode || "remote";

    const teamId =
      employee.employmentDetails?.team?.id !== undefined && employee.employmentDetails?.team?.id !== null
        ? String(employee.employmentDetails.team.id)
        : "";

    const roleId =
      employee.employmentDetails?.role?.id !== undefined && employee.employmentDetails?.role?.id !== null
        ? String(employee.employmentDetails.role.id)
        : "";

    console.log("Setting form values:", {
      teamId,
      roleId,
      teamObject: employee.employmentDetails?.team,
      roleObject: employee.employmentDetails?.role,
    });

    return {
      firstName: employee.firstName ?? "",
      lastName: employee.lastName ?? "",
      email: employee.email ?? "",
      phoneNumber: employee.phoneNumber ?? "",
      dateOfBirth: employee.dateOfBirth?.split("T")[0] || "",
      gender: gender,
      startDate: employee.employmentDetails?.startDate?.split("T")[0] || "",
      employmentType: employmentType,
      workMode: workMode,
      teamId,
      roleId,
    };
  }, [employee]);

  const methods = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues,
    values: formValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = methods;

  const selectedTeamId = watch("teamId");
  const selectedRoleId = watch("roleId");

  // Log form state for debugging
  useEffect(() => {
    console.log("Form state:", {
      teamId: selectedTeamId,
      roleId: selectedRoleId,
      allFormValues: methods.getValues(),
    });
  }, [selectedTeamId, selectedRoleId, methods]);

  // Memoize derived team and roles from teams and selectedTeamId
  const selectedTeam = useMemo(() => teams.find((team) => String(team.id) === selectedTeamId), [teams, selectedTeamId]);
  const derivedRoles = useMemo(() => selectedTeam?.roles ?? [], [selectedTeam]);

  // Debug logging
  useEffect(() => {
    if (teams.length > 0) {
      console.log("=== DEBUG INFO ===");
      console.log(
        "Available teams:",
        teams.map((t) => ({ id: String(t.id), name: t.name })),
      );
      console.log("Selected teamId:", selectedTeamId);
      console.log("Selected roleId:", selectedRoleId);
      console.log("Selected team object:", selectedTeam);
      console.log(
        "Derived roles:",
        derivedRoles.map((r) => ({ id: String(r.id), name: r.name })),
      );

      // Check if roleId exists in derivedRoles
      const roleExists = derivedRoles.some((r) => String(r.id) === selectedRoleId);
      console.log("Role exists in derived roles?", roleExists);
      console.log("=================");
    }
  }, [teams, selectedTeamId, selectedRoleId, derivedRoles, selectedTeam]);

  // Removed imperatively setting values via effects; form is driven by `values` above

  // Reset roleId when invalid for the selected team - TEMPORARILY DISABLED FOR DEBUGGING
  // useEffect(() => {
  //   // Skip this logic if we're still loading initial data or teams
  //   if (!formValues || loadingTeams || teams.length === 0) {
  //     console.log("Skipping role validation - not ready yet", {
  //       hasFormValues: !!formValues,
  //       loadingTeams,
  //       teamsCount: teams.length,
  //     });
  //     return;
  //   }

  //   // If no team selected but a role is set, clear it
  //   if (!selectedTeamId && selectedRoleId) {
  //     console.log("Clearing role because no team is selected");
  //     setValue("roleId", "");
  //     return;
  //   }

  //   // Only validate role against derived roles if we have a selected team and derived roles
  //   if (selectedTeamId && selectedRoleId && derivedRoles.length > 0) {
  //     const roleExists = derivedRoles.some((r) => String(r.id) === selectedRoleId);
  //     if (!roleExists) {
  //       console.log("Clearing role because it's not in the derived roles", {
  //         selectedRoleId,
  //         derivedRoles: derivedRoles.map((r) => String(r.id)),
  //       });
  //       setValue("roleId", "");
  //     }
  //   }
  // }, [selectedTeamId, selectedRoleId, derivedRoles, setValue, formValues, loadingTeams, teams.length]);

  const handleFilesSelected = (files: File[]) => {
    setFiles(files);
  };

  const onSubmit = async (formData: EmployeeFormData) => {
    try {
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

      const response = await updateEmployeeMutation.mutateAsync({ id: employeeId, data: formDataToSend });
      if (response) {
        toast.success("Employee Profile Updated");
        router.push("/admin/employees");
      } else {
        toast.error("Failed to update employee profile");
      }
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

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
                    render={({ field, fieldState }) => (
                      <>
                        <PhoneInput
                          {...field}
                          defaultCountry="US"
                          placeholder={loadingTeams ? `Loading phone number...` : `Enter phone number`}
                          inputClassName="border-border !h-14"
                          buttonClassName="border-border !h-14"
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
                  disabled={loadingTeams}
                  required
                />
                <FormField
                  name="roleId"
                  label="Role"
                  type="select"
                  placeholder={loadingTeams || !selectedTeamId ? `Select a role` : `Select a role`}
                  className="bg-background border-border !h-14 w-full"
                  options={derivedRoles.map((role) => ({ value: String(role.id), label: role.name }))}
                  disabled={!selectedTeamId || loadingTeams}
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
              onClick={() => router.push("/admin/employees")}
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
