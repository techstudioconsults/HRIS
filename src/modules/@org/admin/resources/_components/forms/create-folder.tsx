"use client";

import MainButton from "@/components/shared/button";
import FileUpload from "@/components/shared/file-upload/file-upload";
import { FormField } from "@/components/shared/inputs/FormFields";
import { FolderFormData, folderSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { useResourceService } from "../../services/use-service";

interface CreateFolderFormProperties {
  onClose?: () => void;
}

export const CreateFolderForm = ({ onClose }: CreateFolderFormProperties) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { useCreateFolder } = useResourceService();

  const methods = useForm<FolderFormData>({
    resolver: zodResolver(folderSchema),
    defaultValues: {
      name: "",
      file: [],
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    setValue,
  } = methods;

  const createFolderMutation = useCreateFolder();

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    setValue("file", files);
  };

  const handleCancel = () => {
    reset();
    setSelectedFiles([]);
    onClose?.();
  };

  const onSubmit = async (data: FolderFormData) => {
    try {
      await createFolderMutation.mutateAsync({
        name: data.name,
        file: data.file || [],
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
            placeholder="Enter folder name"
            className="!h-14 w-full"
            label="Folder Name"
            type="text"
            required
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div className="flex w-full flex-col gap-4 pt-4">
          <label className="text-sm font-medium">Files (Optional)</label>
          <FileUpload
            onFileChange={handleFilesSelected}
            acceptedFileTypes=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            maxFiles={10}
          />
          {selectedFiles.length > 0 && (
            <p className="text-sm text-gray-600">
              {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} selected
            </p>
          )}
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
