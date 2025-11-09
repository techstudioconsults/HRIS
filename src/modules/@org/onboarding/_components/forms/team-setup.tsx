/* eslint-disable no-console */
// components/forms/TeamSetupForm.tsx
"use client";

import MainButton from "@/components/shared/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WithDependency } from "@/HOC/withDependencies";
import { dependencies } from "@/lib/tools/dependencies";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { OnboardingService } from "../../services/service";
import { TeamConfig } from "../accordions/team-config";
import { Team, TeamSetupFormData, teamSetupSchema } from "./schema";

interface TeamSetupFormProperties {
  onBoardingService: OnboardingService;
}

const BaseTeamSetupForm = ({ onBoardingService }: TeamSetupFormProperties) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [, setInitialTeams] = useState<Team[]>([]);

  const methods = useForm<TeamSetupFormData>({
    resolver: zodResolver(teamSetupSchema),
    defaultValues: {
      teams: [],
    },
  });

  const { handleSubmit, setValue, watch, reset } = methods;
  const teams = watch("teams");

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedTeams = await onBoardingService.getTeams();
        const teamsWithRoles = await Promise.all(
          fetchedTeams.map(async (team) => {
            const roles = await onBoardingService.getRoles(team.id!);
            return { ...team, roles };
          }),
        );
        setInitialTeams(teamsWithRoles);
        reset({ teams: teamsWithRoles });
      } catch (error) {
        toast.error("Failed to load teams");
        console.error("Error loading teams:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [onBoardingService, reset]);

  const handleTeamsChange = (updatedTeams: Team[]) => {
    setValue("teams", updatedTeams, { shouldValidate: true });
  };

  const handleFormSubmit = async (data: TeamSetupFormData) => {
    try {
      // Save all teams and their roles
      for (const team of data.teams) {
        if (team.id) {
          // Update existing team
          await onBoardingService.updateTeam(team.id, team.name);
          // Handle role updates
          for (const role of team.roles) {
            if (role.id) {
              const updateData: { name?: string; permissions?: string[] } = {};
              if (role.name !== undefined) updateData.name = role.name;
              if (role.permissions !== undefined) updateData.permissions = role.permissions;
              await onBoardingService.updateRole(role.id, updateData);
            } else {
              await onBoardingService.createRole({
                name: role.name,
                teamId: team.id!,
                permissions: role.permissions,
              });
            }
          }
        } else {
          // Create new team
          const createdTeam = await onBoardingService.createTeam(team.name);
          // Create roles for new team
          if (createdTeam?.id) {
            await Promise.all(
              team.roles.map((role) =>
                onBoardingService.createRole({
                  name: role.name,
                  teamId: createdTeam.id,
                  permissions: role.permissions,
                }),
              ),
            );
          }
        }
      }

      toast.success("Team setup saved successfully");
      router.push("/onboarding/step-3");
    } catch (error) {
      toast.error("Failed to save team setup");
      console.error("Error saving team setup:", error);
    }
  };

  if (isLoading) {
    return <FormLoadingSkeleton />;
  }

  return (
    <section className="rounded-[10px] p-7 shadow-xl">
      <div className="mb-8 space-y-2">
        <h3 className="text-2xl/[120%] font-[600] tracking-[-2%]">Set up your team</h3>
        <p className="text-gray-200">Configure teams and roles with specific permissions for your organization</p>
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={(event: FormEvent) => {
            event.preventDefault();
            handleSubmit(handleFormSubmit);
          }}
        >
          <section className="hide-scrollbar max-h-[500px] space-y-4 overflow-auto">
            <TeamConfig teams={teams} onTeamsChange={handleTeamsChange} />
          </section>

          <div className="mt-8 space-y-4">
            <MainButton href={`/onboarding/step-3`} type="button" variant="primary" className="w-full" size="xl">
              Continue
            </MainButton>

            <div className="flex w-full items-center justify-center py-5">
              <Link href={`/admin/dashboard`} className="text-primary font-semibold hover:underline">
                Skip for Later
              </Link>
            </div>
          </div>
        </form>
      </FormProvider>
    </section>
  );
};

const FormLoadingSkeleton = () => {
  return (
    <section className="rounded-[10px] p-7 shadow-none">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-5 w-[400px]" />
      </div>

      {/* Team List */}
      <div className="hide-scrollbar max-h-[500px] space-y-4 overflow-auto">
        {/* Executive Team Skeleton */}
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-6 w-[150px]" />
            </div>
            <div className="flex space-x-4">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-5 rounded" />
            </div>
          </div>
        </div>

        {/* Engineering Team Skeleton */}
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-6 w-[150px]" />
            </div>
            <div className="flex space-x-4">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-5 rounded" />
            </div>
          </div>
        </div>

        {/* Add New Team Button */}
        <Skeleton className="h-10 w-[150px] rounded-md" />
      </div>

      {/* Footer Buttons */}
      <div className="mt-8 space-y-4">
        <Skeleton className="h-12 w-full rounded-md" />
        <Skeleton className="h-12 w-full rounded-md" />
      </div>
    </section>
  );
};

export const TeamSetupForm = WithDependency(BaseTeamSetupForm, {
  onBoardingService: dependencies.ONBOARDING_SERVICE,
});
