"use client";

import MainButton from "@/components/shared/button";
import FileUpload from "@/components/shared/file-upload/file-upload";
import { FormField } from "@/components/shared/inputs/FormFields";
import { FileFormData, fileSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { useResourceService } from "../../services/use-service";

interface CreateFileFormProperties {
  onClose?: () => void;
}

export const CreateFileForm = ({ onClose }: CreateFileFormProperties) => {
  const { useGetAllFolders, useAddFilesToFolder } = useResourceService();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [folderOptions, setFolderOptions] = useState<{ value: string; label: string }[]>([]);

  const methods = useForm<FileFormData>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      file: [],
      folderId: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    watch,
    setValue,
  } = methods;

  // Fetch folders - no search parameter needed
  const {
    data: foldersData,
    isLoading: foldersLoading,
    error: foldersError,
  } = useGetAllFolders({
    page: 1,
    limit: 100,
  });

  // Transform folder data to options
  useEffect(() => {
    const typedFoldersData = foldersData as ApiResponse<Folder> | undefined;
    if (typedFoldersData?.data?.items) {
      const options = typedFoldersData.data.items.map((folder: Folder) => ({
        value: folder.id,
        label: folder.name,
      }));
      setFolderOptions(options);

      // Auto-select first folder if none selected
      if (options.length > 0 && !watch("folderId")) {
        setValue("folderId", options[0].value);
      }
    }
  }, [foldersData, setValue, watch]);

  const selectedFolderId = watch("folderId");

  const addFilesMutation = useAddFilesToFolder({
    onSuccess: () => {
      const fileCount = selectedFiles.length;
      toast.success(`${fileCount} file${fileCount > 1 ? "s" : ""} uploaded successfully`);
      reset();
      setSelectedFiles([]);
      onClose?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload files. Please try again.");
    },
  });

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    setValue("file", files);
  };

  const handleCancel = () => {
    reset();
    setSelectedFiles([]);
    onClose?.();
  };

  const onSubmit = async (data: FileFormData) => {
    if (!data.folderId) {
      toast.error("Please select a folder");
      return;
    }

    if (!data.file || data.file.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    try {
      await addFilesMutation.mutateAsync({
        folderId: data.folderId,
        files: data.file,
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
            name="folderId"
            placeholder="Select folder"
            className="!h-14 w-full"
            label="Folder"
            type="select"
            required
            options={folderOptions}
            disabled={foldersLoading || folderOptions.length === 0}
          />
          {foldersLoading && <p className="text-sm text-gray-500">Loading folders...</p>}
          {foldersError && <p className="text-sm text-red-600">Error: {foldersError.message}</p>}
          {!foldersLoading && folderOptions.length === 0 && !foldersError && (
            <p className="text-sm text-amber-600">No folders available. Please create a folder first.</p>
          )}
          {errors.folderId && <p className="text-sm text-red-600">{errors.folderId.message}</p>}
        </div>

        <div className="flex w-full flex-col gap-4 pt-4">
          <label className="text-sm font-medium">Files</label>
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
          {errors.file && <p className="text-sm text-red-600">{errors.file.message}</p>}
        </div>

        <div className="flex w-full items-center justify-between gap-4 pt-4">
          <MainButton
            className="w-full"
            type="button"
            variant="outline"
            isDisabled={isSubmitting || addFilesMutation.isPending}
            onClick={handleCancel}
          >
            Cancel
          </MainButton>
          <MainButton
            className="w-full"
            variant="primary"
            type="submit"
            isDisabled={isSubmitting || addFilesMutation.isPending || !selectedFolderId || selectedFiles.length === 0}
          >
            {isSubmitting || addFilesMutation.isPending ? "Uploading..." : "Upload Files"}
          </MainButton>
        </div>
      </form>
    </FormProvider>
  );
};
