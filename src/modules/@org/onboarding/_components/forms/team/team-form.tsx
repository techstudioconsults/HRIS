// components/forms/TeamForm.tsx
"use client";

import MainButton from "@/components/shared/button";
import { FormField } from "@/components/shared/FormFields";
import { FormProvider, useForm } from "react-hook-form";

import { Team } from "../schema";

interface TeamFormProperties {
  initialData?: Team | null;
  onSubmit: (data: { name: string }) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const TeamForm = ({ initialData, onSubmit, onCancel, isSubmitting = false }: TeamFormProperties) => {
  const methods = useForm<{ name: string }>({
    defaultValues: {
      name: initialData?.name || "",
    },
  });

  const { handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField placeholder="Enter team name" className="h-14 w-full" label="Team Name" name="name" required />

        <div className="flex justify-end gap-4">
          <MainButton
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
              onCancel();
            }}
            type="button"
            variant="outline"
            isDisabled={isSubmitting}
          >
            Cancel
          </MainButton>
          <MainButton
            // onClick={(event) => {
            //   event.stopPropagation();
            //   event.preventDefault();
            // }}
            type="submit"
            variant="primary"
            isDisabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </MainButton>
        </div>
      </form>
    </FormProvider>
  );
};
