/* eslint-disable no-console */
"use client";

import { BreadCrumb } from "@/components/shared/breadcrumb";
import MainButton from "@/components/shared/button";
import { DashboardHeader } from "@/components/shared/dashboard/dashboard-header";
import { FormField } from "@/components/shared/inputs/FormFields";
// import { AlertDialog } from "@/components/ui/alert-dialog";
import { employmentTypeOptions, genderOptions, workModeOptions } from "@/lib/tools/constants";
import { EmployeeFormData, employeeSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import FileUpload from "../../../_components/file-upload/file-upload";
import { useEmployeeService } from "../../services/use-service";

export const BaseEmployeeForm = () => {
  const router = useRouter();
  const searchParameters = useSearchParams();
  const employeeId = searchParameters.get("employeeid");

  const [files, setFiles] = useState<File[]>([]);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);

  // Query hooks
  const { useGetAllTeams, useGetEmployeeById, useCreateEmployee, useUpdateEmployee } = useEmployeeService();

  const { data: teams = [], isLoading: loadingTeams } = useGetAllTeams();
  const { data: employee } = useGetEmployeeById(employeeId || "", {
    enabled: !!employeeId,
  });

  const createEmployeeMutation = useCreateEmployee();
  const updateEmployeeMutation = useUpdateEmployee();
  // const [showAlert, setShowAlert] = useState(false);
  // const [alertTitle, setAlertTitle] = useState("");
  // const [alertDescription, setAlertDescription] = useState("");

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

      // Set salary and bank info
      // setValue("monthlySalary", employee.payProfile?.grossSalary?.toString() || "0");
      // setValue("pension", employee.pension?.toString() || "0");
      // setValue("healthInsurance", employee.healthInsurance?.toString() || "0");
      // setValue("otherDeductions", employee.otherDeductions?.toString() || "0");
      // setValue("bankName", employee.payProfile?.bankName || "");
      // setValue("accountName", employee.payProfile?.accountName || "");
      // setValue("accountNumber", employee.payProfile?.accountNumber || "");
    }
  }, [employee, employeeId, teams, setValue]);

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
        const response = await updateEmployeeMutation.mutateAsync({ id: employeeId, data: formDataToSend });
        if (response) {
          toast.success("Employee Profile Updated");
          router.push("/admin/employees");
        } else {
          toast.error("Failed to update employee profile");
        }
        // setAlertTitle("Employee Profile Updated");
        // setAlertDescription("Changes to the employee’s information have been saved successfully.");
      } else {
        const response = await createEmployeeMutation.mutateAsync(formDataToSend);
        if (response) {
          toast.success("Employee Added Successfully");
          router.push("/admin/employees");
        } else {
          toast.error("Failed to add employee");
        }
        // setAlertTitle("Employee Added Successfully");
        // setAlertDescription(
        //   "You've successfully added an employee to your team. They'll receive an email with login instructions to access the platform.",
        // );
      }

      // setShowAlert(true);
    } catch (error) {
      console.error("Error saving employee:", error);
      // You could also set error state here and show an error alert
    }
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
        title={employeeId ? "Edit Employee" : "Add Employee"}
        subtitle={
          <BreadCrumb
            items={[
              { label: "Employee", href: "/admin/employees" },
              { label: employeeId ? "Edit Employee" : "Add Employee", href: "" },
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
                  placeholder={loadingTeams ? `Loading first name...` : `John`}
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

            {/* Salary Details Section */}
            {/* <section>
              <h2 className="mb-4 text-lg font-semibold">Salary Details</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
                <FormField
                  name="monthlySalary"
                  label="Monthly Gross Salary"
                  placeholder="₦750,000.00"
                  className="!h-14 w-full border-border"
                />
                <FormField name="pension" label="Pension" placeholder="5% of salary" className="!h-14 w-full border-border" />
                <FormField
                  name="healthInsurance"
                  label="Health Insurance"
                  placeholder="3% of salary"
                  className="!h-14 w-full border-border"
                />
                <FormField
                  name="otherDeductions"
                  label="Other Deductions"
                  placeholder="% of salary"
                  className="!h-14 w-full border-border"
                />
                <FormField
                  name="bankName"
                  label="Bank Name"
                  type="text"
                  placeholder="Wema Bank"
                  className="!h-14 w-full border-border"
                />
                <FormField
                  name="accountName"
                  label="Account Name"
                  type="text"
                  placeholder="John Doe"
                  className="!h-14 w-full border-border"
                />
                <FormField
                  name="accountNumber"
                  label="Account Number"
                  type="text"
                  placeholder="0067514267"
                  className="!h-14 w-full border-border"
                />
              </div>
            </section> */}

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
              {isSubmitting ? "Saving..." : "Save Employee"}
            </MainButton>
          </div>
        </form>
      </FormProvider>
      {/* <AlertDialog open={showAlert} onOpenChange={handleAlertClose} title={alertTitle} description={alertDescription} /> */}
    </div>
  );
};

export const EmployeeForm = BaseEmployeeForm;
