/* eslint-disable @typescript-eslint/no-explicit-any */
import { WithDependency } from "@/HOC/withDependencies";
import { dependencies } from "@/lib/tools/dependencies";
import { z } from "zod";

import { EmployeeSetupForm } from "../../_components/forms/employee/employee-setup";
import { OnboardingService } from "../../services/service";

// Enhanced Employee type with teamId and roleId
export interface Employee {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  teamId: string;
  roleId: string;
  permissions?: any[];
}

export interface OnboardEmployeesPayload {
  employees: Employee[];
}

export const employeeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  teamId: z.string().min(1, "Department is required"),
  roleId: z.string().min(1, "Role is required"),
});

export const StepThree = ({ onBoardingService }: { onBoardingService: OnboardingService }) => {
  return (
    <section className={`flex flex-col items-center justify-between gap-8 lg:flex-row`}>
      <section className={`max-w-[646px] flex-1 space-y-[41px]`}>
        <div className={`space-y-4`}>
          <p>Step 3 of 3</p>
          <div>
            <div className={`flex items-center gap-2`}>
              <div className={`bg-primary h-2 w-16 rounded-full`} />
              <div className={`bg-primary h-2 w-16 rounded-full`} />
              <div className={`bg-primary h-2 w-16 rounded-full`} />
            </div>
          </div>
        </div>
        <div className={`space-y-[24px]`}>
          <h1 className={`text-4xl/[100%] font-semibold`}>Bring your team onboard</h1>
          <p className={`text-xl/[120%]`}>
            Start with suggested departments and tailor them to fit your organization. Add custom roles under each
            department and control what they can access.
          </p>
        </div>
      </section>
      <section className={`flex-1`}>
        <EmployeeSetupForm onBoardingService={onBoardingService} />
      </section>
    </section>
  );
};

export const EmployeeSetup = WithDependency(StepThree, {
  onBoardingService: dependencies.ONBOARDING_SERVICE,
});
