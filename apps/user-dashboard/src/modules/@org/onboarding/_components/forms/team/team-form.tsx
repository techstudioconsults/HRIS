// components/forms/TeamForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Team, teamSchema } from "../schema";

type TeamFormValues = { name: string };

interface TeamFormProperties {
  initialData?: Team | null;
  onSubmit: (data: TeamFormValues) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const TeamForm = ({ initialData, onSubmit, onCancel, isSubmitting = false }: TeamFormProperties) => {
  const methods = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema.pick({ name: true })),
    defaultValues: { name: initialData?.name ?? "" },
    mode: "onChange",
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting: rhfSubmitting, isValid },
  } = methods;

  useEffect(() => {
    reset({ name: initialData?.name ?? "" });
  }, [initialData, reset]);

  const submit = async (values: TeamFormValues) => {
    await onSubmit(values);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submit)} className="grid gap-6">
        <FormField placeholder="Enter team name" className="h-14 w-full" label="Team Name" name="name" required />
        <div className="flex justify-end gap-4">
          <MainButton type="button" variant="outline" onClick={onCancel} isDisabled={isSubmitting || rhfSubmitting}>
            Cancel
          </MainButton>
          <MainButton type="submit" variant="primary" isDisabled={!isValid || isSubmitting || rhfSubmitting}>
            {isSubmitting || rhfSubmitting ? "Saving..." : initialData ? "Save Changes" : "Create Team"}
          </MainButton>
        </div>
      </form>
    </FormProvider>
  );
};
