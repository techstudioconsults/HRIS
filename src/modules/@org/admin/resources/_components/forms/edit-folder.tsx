"use client";

import MainButton from "@/components/shared/button";
import { FormField } from "@/components/shared/inputs/FormFields";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useResourceService } from "../../services/use-service";

const renameFolderSchema = z.object({
  name: z.string().min(1, "Folder name is required"),
});

type RenameFolderFormData = z.infer<typeof renameFolderSchema>;

interface EditFolderFormProperties {
  folderId: string;
  currentName: string;
  onClose?: () => void;
}

export const EditFolderForm = ({ folderId, currentName, onClose }: EditFolderFormProperties) => {
  const { useUpdateFolder } = useResourceService();

  const methods = useForm<RenameFolderFormData>({
    resolver: zodResolver(renameFolderSchema),
    defaultValues: {
      name: currentName,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = methods;

  const updateFolderMutation = useUpdateFolder({
    onSuccess: (data: unknown) => {
      const folderData = data as { name?: string };
      const folderName = folderData?.name || "Folder";
      toast.success(`Folder renamed to "${folderName}" successfully`);
      reset();
      onClose?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to rename folder. Please try again.");
    },
  });

  const handleCancel = () => {
    reset();
    onClose?.();
  };

  const onSubmit = async (data: RenameFolderFormData) => {
    try {
      await updateFolderMutation.mutateAsync({
        id: folderId,
        data: { name: data.name },
      });
    } catch {
      // Error is already handled by onError callback
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="grid w-full gap-6 py-4">
        <div className="grid w-full gap-2">
          <FormField
            name="name"
            placeholder="Enter new folder name"
            className="!h-14 w-full"
            label="Folder Name"
            type="text"
            required
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div className="flex w-full items-center justify-between gap-4 pt-4">
          <MainButton
            className="w-full"
            type="button"
            variant="outline"
            isDisabled={isSubmitting || updateFolderMutation.isPending}
            onClick={handleCancel}
          >
            Cancel
          </MainButton>
          <MainButton
            className="w-full"
            variant="primary"
            type="submit"
            isDisabled={isSubmitting || updateFolderMutation.isPending}
          >
            {isSubmitting || updateFolderMutation.isPending ? "Renaming..." : "Rename Folder"}
          </MainButton>
        </div>
      </form>
    </FormProvider>
  );
};
