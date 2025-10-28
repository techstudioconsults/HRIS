/* eslint-disable no-console */
"use client";

import { BreadCrumb } from "@/components/shared/breadcrumb";
import MainButton from "@/components/shared/button";
import { DashboardHeader } from "@/components/shared/dashboard/dashboard-header";
import { FormField } from "@/components/shared/inputs/FormFields";
import { employmentTypeOptions, genderOptions, workModeOptions } from "@/lib/tools/constants";
import { EmployeeFormData, employeeSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import FileUpload from "../../../_components/file-upload/file-upload";
import { useEmployeeService } from "../../services/use-service";

export const EditEmployeeForm = () => {
  const router = useRouter();
  const searchParameters = useSearchParams();
  const employeeId = searchParameters.get("employeeid");

  const [files, setFiles] = useState<File[]>([]);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);

  // Query hooks
  const { useGetAllTeams, useGetEmployeeById, useUpdateEmployee } = useEmployeeService();

  const { data: teams = [], isLoading: loadingTeams } = useGetAllTeams();
  const { data: employee } = useGetEmployeeById(employeeId || "", {
    enabled: !!employeeId,
  });

  const updateEmployeeMutation = useUpdateEmployee();

  const methods = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue,
  } = methods;

  const selectedTeamId = watch("teamId");

  // Set employee data when it's loaded
  useEffect(() => {
    if (employee && employeeId) {
      // Set all form values
      setValue("firstName", employee.firstName);
      setValue("lastName", employee.lastName);
      setValue("email", employee.email);
      setValue("phoneNumber", employee.phoneNumber);
      setValue("dateOfBirth", employee.dateOfBirth?.split("T")[0] || "");
      setValue("gender", employee.gender);
      setValue("startDate", employee.employmentDetails?.startDate?.split("T")[0] || "");
      const employmentType = employee.employmentDetails?.employmentType;
      if (employmentType) setValue("employmentType", employmentType);
      const workMode = employee.employmentDetails?.workMode;
      if (workMode) setValue("workMode", workMode);

      // Set team and role if they exist
      if (employee.employmentDetails?.team?.id) {
        setValue("teamId", employee.employmentDetails.team.id);
        const selectedTeam = teams.find((team) => team.id === employee.employmentDetails?.team?.id);
        if (selectedTeam) {
          setRoles(selectedTeam.roles);
          if (employee.employmentDetails?.role?.id) {
            setValue("roleId", employee.employmentDetails.role.id);
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee, employeeId, teams]);

  // Update roles when team changes
  useEffect(() => {
    if (!selectedTeamId) {
      setRoles([]);
      setValue("roleId", "");
      return;
    }

    const selectedTeam = teams.find((team) => team.id === selectedTeamId);
    if (selectedTeam) {
      setRoles(selectedTeam.roles);
    } else {
      setRoles([]);
      setValue("roleId", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTeamId, teams]);

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
      formDataToSend.append("employmentType", formData.employmentType || "");

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
                <FormField
                  name="phoneNumber"
                  label="Phone Number"
                  className="border-border !h-14 w-full"
                  type="text"
                  placeholder={loadingTeams ? `Loading phone number...` : `080123456789`}
                  required
                />
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
                    value: team.id,
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
