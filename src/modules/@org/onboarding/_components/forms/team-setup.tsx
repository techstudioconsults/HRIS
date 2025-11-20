"use client";

import MainButton from "@/components/shared/button";
import { FormHeader } from "@/components/shared/form-header";
import { Skeleton } from "@/components/ui/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import { People } from "iconsax-reactjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

// Refactored to use react-query service hooks instead of HOC dependency injection
import { useOnboardingService } from "../../services/use-onboarding-service";
import { TeamConfig } from "../accordions/team-config";
import { Team, TeamSetupFormData, teamSetupSchema } from "./schema";

export const TeamSetupForm = () => {
  const router = useRouter();
  const { useGetTeamsWithRoles, useCreateTeam, useUpdateTeam, useCreateRole, useUpdateRole } = useOnboardingService();

  const { data: fetchedTeams, isLoading } = useGetTeamsWithRoles();

  const createTeamMutation = useCreateTeam();
  const updateTeamMutation = useUpdateTeam();
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();

  const methods = useForm<TeamSetupFormData>({
    resolver: zodResolver(teamSetupSchema),
    defaultValues: {
      teams: [],
    },
  });

  const { handleSubmit, setValue, watch, reset } = methods;
  const teams = watch("teams");

  // Sync fetched teams into form once available
  useEffect(() => {
    if (fetchedTeams) {
      reset({ teams: fetchedTeams as Team[] });
    }
  }, [fetchedTeams, reset]);

  const handleTeamsChange = (updatedTeams: Team[]) => {
    setValue("teams", updatedTeams, { shouldValidate: true });
  };

  const handleFormSubmit = async (data: TeamSetupFormData) => {
    try {
      // Save all teams and their roles
      for (const team of data.teams) {
        if (team.id) {
          // Update existing team
          await updateTeamMutation.mutateAsync({ teamId: team.id, name: team.name });
          // Handle role updates
          for (const role of team.roles) {
            await (role.id
              ? updateRoleMutation.mutateAsync({
                  roleId: role.id,
                  name: role.name,
                  permissions: role.permissions,
                  teamId: team.id,
                })
              : createRoleMutation.mutateAsync({
                  name: role.name,
                  teamId: team.id!,
                  permissions: role.permissions,
                }));
          }
        } else {
          // Create new team
          const createdTeam = await createTeamMutation.mutateAsync({ name: team.name });
          // Create roles for new team
          if (createdTeam?.id) {
            await Promise.all(
              team.roles.map((role) =>
                createRoleMutation.mutateAsync({
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
    } catch {
      toast.error("Failed to save team setup");
    }
  };

  if (isLoading) {
    return <FormLoadingSkeleton />;
  }

  return (
    <section className="rounded-[10px] border p-7">
      <div className="">
        <FormHeader
          icon={<People />}
          title="Set up your team"
          subTitle="Configure teams and roles with specific permissions for your organization"
        />
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <section className="hide-scrollbar max-h-[500px] space-y-4 overflow-auto">
            <TeamConfig teams={teams} onTeamsChange={handleTeamsChange} />
          </section>

          <div className="mt-8 space-y-4">
            <MainButton href={`/onboarding/step-3`} type="button" variant="primary" className="w-full" size="xl">
              Continue
            </MainButton>

            <div className="flex w-full items-center justify-center py-5">
              <Link href={`/admin/dashboard`} className="text-primary text-sm font-medium hover:underline">
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

// HOC removed; component now uses react-query hooks directly
