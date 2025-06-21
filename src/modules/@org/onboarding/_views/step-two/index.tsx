// app/setup/teams/page.tsx
"use client";

import { WithDependency } from "@/HOC/withDependencies";
import { dependencies } from "@/lib/tools/dependencies";

import { TeamSetupForm } from "../../_components/forms/team-setup";
import { OnboardingService } from "../../services/service";

const BaseTeamSetupPage = ({ onBoardingService }: { onBoardingService: OnboardingService }) => {
  return (
    <section className="flex flex-col items-center justify-between gap-8 lg:flex-row">
      <section className="max-w-[646px] flex-1 space-y-[41px]">
        <div className="space-y-4">
          <p>Step 2 of 3</p>
          <div>
            <div className="flex items-center gap-2">
              <div className="bg-primary h-2 w-16 rounded-full" />
              <div className="bg-primary h-2 w-16 rounded-full" />
              <div className="h-2 w-16 rounded-full bg-gray-300" />
            </div>
          </div>
        </div>
        <div className="space-y-[24px]">
          <h1 className="text-4xl/[100%] font-semibold">Structure your team with the right access</h1>
          <p className="text-xl/[120%]">
            Start with suggested departments and tailor them to fit your organization. Add custom roles under each
            department and control what they can access.
          </p>
        </div>
      </section>
      <section className="flex-1">
        <TeamSetupForm onBoardingService={onBoardingService} />
      </section>
    </section>
  );
};

export const TeamSetupPage = WithDependency(BaseTeamSetupPage, {
  onBoardingService: dependencies.ONBOARDING_SERVICE,
});
