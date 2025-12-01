"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
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

  const { mutateAsync: updateFolderMutation, isPending } = useUpdateFolder();

  const handleCancel = () => {
    reset();
    onClose?.();
  };

  const onSubmit = async (data: RenameFolderFormData) => {
    await updateFolderMutation(
      {
        id: folderId,
        data: { name: data.name },
      },
      {
        onSuccess: () => {
          toast.success(`Folder renamed to "${data.name}" successfully.`);
          handleCancel();
        },
      },
    );
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
            isDisabled={isSubmitting || isPending}
            onClick={handleCancel}
          >
            Cancel
          </MainButton>
          <MainButton className="w-full" variant="primary" type="submit" isDisabled={isSubmitting || isPending}>
            {isSubmitting || isPending ? "Renaming..." : "Rename Folder"}
          </MainButton>
        </div>
      </form>
    </FormProvider>
  );
};
