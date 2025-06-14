"use client";

import { FormField } from "@/components/shared/FormFields";
import { Label } from "@/components/ui/label";
import { ChevronRight } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Employee } from "../../../_views/step-three";

interface SingleEmployeeFormProperties {
  index: number;
}

export const SingleEmployeeForm = ({ index }: SingleEmployeeFormProperties) => {
  const { watch } = useFormContext<{ employees: Employee[] }>();
  const employee = watch(`employees.${index}`);

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
          placeholder="Select department"
          className="!h-14 w-full"
          label="Department"
          name={`employees.${index}.teamId`}
          options={[
            { value: "sales", label: "Sales" },
            { value: "marketing", label: "Marketing" },
            { value: "engineering", label: "Engineering" },
            { value: "hr", label: "Human Resources" },
            { value: "finance", label: "Finance" },
            { value: "operations", label: "Operations" },
            { value: "customer_support", label: "Customer Support" },
            { value: "product", label: "Product Management" },
            { value: "it", label: "IT Support" },
          ]}
        />
        <FormField
          type="select"
          placeholder="Select role"
          className="!h-14 w-full"
          label="Role"
          name={`employees.${index}.roleId`}
          options={[
            { value: "manager", label: "Manager" },
            { value: "supervisor", label: "Supervisor" },
            { value: "team_lead", label: "Team Lead" },
            { value: "senior", label: "Senior Staff" },
            { value: "staff", label: "Staff" },
            { value: "junior", label: "Junior Staff" },
            { value: "intern", label: "Intern" },
            { value: "contractor", label: "Contractor" },
          ]}
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
