/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FormField } from "@/components/shared/FormFields";
import { Label } from "@/components/ui/label";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { Employee } from "../../../_views/step-three";
import { OnboardingService } from "../../../services/service";

interface SingleEmployeeFormProperties {
  index: number;
  onBoardingService: OnboardingService;
}

interface Department {
  id: string;
  name: string;
}

interface Role {
  id: string;
  name: string;
}

export const SingleEmployeeForm = ({ index, onBoardingService }: SingleEmployeeFormProperties) => {
  const { control, setValue } = useFormContext<{ employees: Employee[] }>();
  const employee = useWatch({ control, name: `employees.${index}` });
  const selectedTeamId = useWatch({ control, name: `employees.${index}.teamId` });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoadingDepartments(true);
      try {
        const teams = await onBoardingService.getTeams();
        const departmentOptions = teams.map((team: { id: any; name: any }) => ({
          id: team.id,
          name: team.name,
        }));
        setDepartments(departmentOptions);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, [onBoardingService]);

  // Fetch roles when department changes
  useEffect(() => {
    const fetchRoles = async () => {
      if (!selectedTeamId) {
        setRoles([]);
        setValue(`employees.${index}.roleId`, ""); // Reset role when department changes
        return;
      }

      setLoadingRoles(true);
      try {
        const rolesData = await onBoardingService.getRoles(selectedTeamId);
        const roleOptions = rolesData.map((role: { id: any; name: any }) => ({
          id: role.id,
          name: role.name,
        }));
        setRoles(roleOptions);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, [selectedTeamId, onBoardingService, index, setValue]);

  return (
    <section className="w-full">
      <section className={`space-y-4`}>
        <FormField
          placeholder={`Enter first name`}
          className={`h-14 w-full`}
          label={`First Name`}
          name={`employees.${index}.firstName`}
        />
        <FormField
          placeholder={`Enter last name`}
          className={`h-14 w-full`}
          label={`Last Name`}
          name={`employees.${index}.lastName`}
        />
        <FormField
          type={`email`}
          placeholder={`Enter email address`}
          className={`h-14 w-full`}
          label={`Email Address`}
          name={`employees.${index}.email`}
        />
        <FormField
          placeholder={`Enter phone number`}
          className={`h-14 w-full`}
          label={`Phone Number`}
          name={`employees.${index}.phoneNumber`}
        />
        <FormField
          type="select"
          placeholder={loadingDepartments ? "Loading departments..." : "Select department"}
          className="!h-14 w-full"
          label="Department"
          name={`employees.${index}.teamId`}
          options={departments.map((dept) => ({
            value: dept.id,
            label: dept.name,
          }))}
          disabled={loadingDepartments}
        />
        <FormField
          type="select"
          placeholder={
            selectedTeamId ? (loadingRoles ? "Loading roles..." : "Select role") : "Select a department first"
          }
          className="!h-14 w-full"
          label="Role"
          name={`employees.${index}.roleId`}
          options={roles.map((role) => ({
            value: role.id,
            label: role.name,
          }))}
          disabled={!selectedTeamId || loadingRoles}
        />
        <input
          type="hidden"
          name={`employees.${index}.password`}
          value={employee?.password || "PleaseSetAdefaultHere1."}
        />
        <div>
          <Label className={`mb-2 text-[16px]`}>Customize Permissions</Label>
          <div className={`flex h-14 cursor-pointer items-center justify-between rounded-lg border px-4`}>
            <span>Show Permission</span>
            <span>
              <ChevronRight size={16} className={`text-gray`} />
            </span>
          </div>
        </div>
      </section>
    </section>
  );
};
