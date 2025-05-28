import { EmployeeSetupForm } from "../../_components/forms/employee/employee-setup";

export const StepThree = () => {
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
        <EmployeeSetupForm />
      </section>
    </section>
  );
};
