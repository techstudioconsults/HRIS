"use client";

import MainButton from "@/components/shared/button";
import FileUpload from "@/components/shared/file-upload/file-upload";
import { FormField } from "@/components/shared/inputs/FormFields";
import { FolderFormData, folderSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { useResourceService } from "../../services/use-service";

interface CreateFolderFormProperties {
  onClose?: () => void; // Function to close the modal
}

export const CreateFolderForm = ({ onClose }: CreateFolderFormProperties) => {
  const [, setSelectedFiles] = useState<File[]>([]);

  // Query Hooks
  const { useCreateFolder } = useResourceService();
  const createFolderMutation = useCreateFolder();

  const methods = useForm<FolderFormData>({
    resolver: zodResolver(folderSchema),
    defaultValues: {
      name: "",
      file: [], // Add this empty array as default
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = methods;

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    setValue("file", files);
  };

  const handleCancel = () => {
    // Reset form and close modal
    reset();
    setSelectedFiles([]);
    onClose?.();
  };

  const onSubmit = async (data: FolderFormData) => {
    try {
      // console.log(data);

      await createFolderMutation.mutateAsync({
        name: data.name,
        file: data.file || [],
      });

      // Success handling
      toast.success(`Folder "${data.name}" created successfully!`);
      window.location.reload();
      reset();
      setSelectedFiles([]);
      onClose?.();
    } catch (error) {
      toast.error(`Failed to create folder. Please try again. ${error}`);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="grid w-full gap-6 py-4">
        <div className="grid w-full gap-2">
          <FormField
            name="name"
            placeholder="Enter folder name"
            className="!h-14 w-full"
            label="Folder Name"
            type="text"
            required
          />
        </div>

        <div className="flex w-full flex-col gap-4 pt-4">
          <FileUpload onFileChange={handleFilesSelected} acceptedFileTypes=".pdf,.doc,.docx" maxFiles={3} />
        </div>

        <div className="flex w-full items-center justify-between gap-4 pt-4">
          <MainButton
            className="w-full"
            type="button"
            variant="outline"
            isDisabled={isSubmitting || createFolderMutation.isPending}
            onClick={handleCancel}
          >
            Cancel
          </MainButton>
          <MainButton
            className="w-full"
            variant="primary"
            type="submit"
            isDisabled={isSubmitting || createFolderMutation.isPending}
          >
            {isSubmitting || createFolderMutation.isPending ? "Creating..." : "Create Folder"}
          </MainButton>
        </div>
      </form>
    </FormProvider>
  );
};
