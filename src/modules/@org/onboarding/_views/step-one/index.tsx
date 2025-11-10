import MainButton from "@/components/shared/button";

import { CompanyProfile } from "../../_components/forms/company-profile";

export const StepOne = () => {
  return (
    <section className={`flex flex-col items-center justify-between gap-8 lg:flex-row`}>
      <section className={`max-w-[646px] flex-1 space-y-[41px]`}>
        <div className={`space-y-4`}>
          <p>Step 1 of 3</p>
          <div>
            <div className={`flex items-center gap-2`}>
              <div className={`bg-primary h-2 w-16 rounded-full`} />
              <div className={`h-2 w-16 rounded-full bg-gray-300`} />
              <div className={`h-2 w-16 rounded-full bg-gray-300`} />
            </div>
          </div>
        </div>
        <div className={`space-y-[24px]`}>
          <h1 className={`text-4xl/[100%] font-semibold`}>Tell us a bit about your company to get started</h1>
          <p className={`text-xl/[120%]`}>
            Let&apos;s set the stage for your HR setup. Just a few quick details about your company and you&apos;ll be
            ready to manage your team with ease.
          </p>
        </div>
        <div className="flex gap-4">
          <MainButton href="/onboarding/welcome" variant="outline">
            Back
          </MainButton>
        </div>
      </section>
      <section className={`flex-1`}>
        <CompanyProfile />
      </section>
    </section>
  );
};
