/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
"use client";

import MainButton from "@/components/shared/button";
import { FormField } from "@/components/shared/inputs/FormFields";
import { WithDependency } from "@/HOC/withDependencies";
import { employmentTypeOptions, genderOptions, workModeOptions } from "@/lib/tools/constants";
import { dependencies } from "@/lib/tools/dependencies";
import { EmployeeFormData, employeeSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import FileUpload from "../../../_components/file-upload/file-upload";
import { EmployeeService } from "../../../employee/services/service";

interface TeamWithRoles {
  id: string;
  name: string;
  roles: {
    id: string;
    name: string;
  }[];
}

export const BaseTeamForm = ({ employeeService }: { employeeService: EmployeeService }) => {
  const router = useRouter();
  const searchParameters = useSearchParams();
  const employeeId = searchParameters.get("employeeid");

  const [files, setFiles] = useState<File[]>([]);
  const [teams, setTeams] = useState<TeamWithRoles[]>([]);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [, setIsLoadingEmployee] = useState(!!employeeId);

  const methods = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue,
    // reset,
  } = methods;

  const selectedTeamId = watch("teamId");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoadingTeams(true);

        // Fetch teams first
        const teamsData = await employeeService.getTeams();
        const teamsWithRoles: TeamWithRoles[] = (teamsData || []).map((team: any) => ({
          id: team.id,
          name: team.name,
          roles: team.roles ?? [],
        }));
        setTeams(teamsWithRoles);

        // If we're editing, fetch employee data
        if (employeeId) {
          setIsLoadingEmployee(true);
          const employee = await employeeService.getEmployeeById(employeeId);
          if (employee) {
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
              const selectedTeam = teamsWithRoles.find((team) => team.id === employee.employmentDetails?.team?.id);
              if (selectedTeam) {
                setRoles(selectedTeam.roles);
                if (employee.employmentDetails?.role?.id) {
                  setValue("roleId", employee.employmentDetails.role.id);
                }
              }
            }

            // Set salary and bank info
            // setValue("monthlySalary", employee.monthlySalary.toString() || "0");
            // setValue("pension", employee.pension?.toString() || "0");
            // setValue("healthInsurance", employee.healthInsurance?.toString() || "0");
            // setValue("otherDeductions", employee.otherDeductions?.toString() || "0");
            // setValue("bankName", employee.bankName || "");
            // setValue("accountName", employee.accountName || "");
            // setValue("accountNumber", employee.accountNumber || "");
          }
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load initial data");
      } finally {
        setLoadingTeams(false);
        setIsLoadingEmployee(false);
      }
    };

    fetchInitialData();
  }, [employeeId, employeeService, setValue]);

  useEffect(() => {
    const fetchRolesForTeam = async () => {
      if (!selectedTeamId) {
        setRoles([]);
        setValue("roleId", "");
        return;
      }

      try {
        setLoadingRoles(true);
        const selectedTeam = teams.find((team) => team.id === selectedTeamId);
        if (selectedTeam) {
          setRoles(selectedTeam.roles);
        } else {
          setRoles([]);
          setValue("roleId", "");
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Failed to load roles for selected department");
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchRolesForTeam();
  }, [selectedTeamId, teams, setValue]);

  const handleFilesSelected = (files: File[]) => {
    setFiles(files);
  };

  const onSubmit = async (formData: EmployeeFormData) => {
    try {
      const formDataToSend = new FormData();

      // Add all fields from the form
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phoneNumber", formData.phoneNumber);

      // Only add password for new employees
      if (!employeeId) {
        formDataToSend.append("password", "PleaseSetAdefaultHere1.");
      }

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

      // Salary info
      // formDataToSend.append("monthlySalary", formData.monthlySalary?.toString() || "0");
      // formDataToSend.append("pension", formData.pension?.toString() || "0");
      // formDataToSend.append("healthInsurance", formData.healthInsurance?.toString() || "0");
      // formDataToSend.append("otherDeductions", formData.otherDeductions?.toString() || "0");

      // Bank info
      // formDataToSend.append("bankName", formData.bankName || "");
      // formDataToSend.append("accountName", formData.accountName || "");
      // formDataToSend.append("accountNumber", formData.accountNumber || "");

      // Call the appropriate service method
      if (employeeId) {
        // Update existing employee
        await employeeService.updateEmployee(employeeId, formDataToSend);
        toast.success("Employee updated successfully!");
      } else {
        // Create new employee
        await employeeService.createEmployee(formDataToSend);
        toast.success("Employee created successfully!");
      }

      router.push("/admin/employees");
    } catch (error) {
      console.error("Error saving employee:", error);
      toast.error(`Failed to ${employeeId ? "update" : "create"} employee. Please try again.`);
    }
  };
  return (
    <div className="space-y-8">
      {/* Breadcrumb and Title */}
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-2xl font-bold">Add Employee</h1>
        <div className="flex items-center gap-1 text-sm">
          <Link href="/admin/employees" className="text-primary">
            All Employee
          </Link>
          <p className="text-muted-foreground">&gt; Add New Employee</p>
        </div>
      </div>

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
                  placeholder="John"
                  className="!h-14 w-full"
                  required
                />
                <FormField
                  name="lastName"
                  label="Last Name"
                  type="text"
                  className="!h-14 w-full"
                  placeholder="Doe"
                  required
                />
                <FormField name="dateOfBirth" label="Date of Birth" className="!h-14 w-full" type="date" required />
                <FormField
                  name="gender"
                  label="Gender"
                  type="select"
                  placeholder={`Select employee gender`}
                  className="bg-background !h-14 w-full"
                  options={genderOptions}
                  required
                />
                <FormField
                  name="email"
                  label="Work Email"
                  type="email"
                  placeholder="john.doe@example.com"
                  className="!h-14 w-full"
                  required
                />
                <FormField
                  name="phoneNumber"
                  label="Phone Number"
                  className="!h-14 w-full"
                  type="text"
                  placeholder="08123456789"
                  required
                />
              </div>
            </section>

            {/* Employment Details Section */}
            <section>
              <h2 className="mb-4 text-lg font-semibold">Employment Details</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
                <FormField name="startDate" className="!h-14 w-full" label="Start Date" type="date" required />
                <FormField
                  name="employmentType"
                  className="bg-background !h-14 w-full"
                  label="Employment Type"
                  type="select"
                  placeholder={`Select employment type`}
                  options={employmentTypeOptions}
                  required
                />
                <FormField
                  name="workMode"
                  label="Work Mode"
                  type="select"
                  placeholder={`Select employee work mode`}
                  className="bg-background !h-14 w-full"
                  options={workModeOptions}
                  required
                />
                <FormField
                  name="teamId"
                  label="Department"
                  type="select"
                  placeholder={loadingTeams ? `Loading department...` : `Select a department`}
                  className="bg-background !h-14 w-full"
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
                  placeholder={loadingRoles ? `Loading roles...` : `Select a role`}
                  className="bg-background !h-14 w-full"
                  options={roles.map((role) => ({
                    value: role.id,
                    label: role.name,
                  }))}
                  disabled={!selectedTeamId || loadingRoles}
                  required
                />
              </div>
            </section>

            {/* Salary Details Section */}
            <section>
              <h2 className="mb-4 text-lg font-semibold">Salary Details</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
                <FormField
                  name="monthlySalary"
                  label="Monthly Gross Salary"
                  placeholder="₦750,000.00"
                  className="!h-14 w-full"
                />
                <FormField name="pension" label="Pension" placeholder="5% of salary" className="!h-14 w-full" />
                <FormField
                  name="healthInsurance"
                  label="Health Insurance"
                  placeholder="3% of salary"
                  className="!h-14 w-full"
                />
                <FormField
                  name="otherDeductions"
                  label="Other Deductions"
                  placeholder="% of salary"
                  className="!h-14 w-full"
                />
                <FormField
                  name="bankName"
                  label="Bank Name"
                  type="text"
                  placeholder="Wema Bank"
                  className="!h-14 w-full"
                />
                <FormField
                  name="accountName"
                  label="Account Name"
                  type="text"
                  placeholder="John Doe"
                  className="!h-14 w-full"
                />
                <FormField
                  name="accountNumber"
                  label="Account Number"
                  type="text"
                  placeholder="0067514267"
                  className="!h-14 w-full"
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
          <div className="mt-6 flex justify-start gap-4">
            <MainButton
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/employees")}
              isDisabled={isSubmitting}
            >
              Cancel
            </MainButton>
            <MainButton variant={`primary`} type="submit" isDisabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Employee"}
            </MainButton>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export const TeamForm = WithDependency(BaseTeamForm, {
  employeeService: dependencies.EMPLOYEE_SERVICE,
});
