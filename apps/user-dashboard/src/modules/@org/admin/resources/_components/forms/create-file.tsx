"use client";

import { FileFormData, fileSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import FileUpload from "@workspace/ui/lib/file-upload/file-upload";
import { AlertCircle, Info } from "lucide-react";
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
      folderId: undefined,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    setValue,
  } = methods;

  // Fetch folders - no search parameter needed
  const { data: foldersData, isLoading: foldersLoading, error: foldersError } = useGetAllFolders();

  // Transform folder data to options
  useEffect(() => {
    const typedFoldersData = foldersData;
    if (typedFoldersData?.data?.items) {
      const options = typedFoldersData.data.items.map((folder) => ({
        value: folder.id,
        label: folder.name,
      }));
      setFolderOptions(options);
    }
  }, [foldersData]);

  const { mutateAsync: addFilesMutation, isPending } = useAddFilesToFolder();

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
    if (!data.file || data.file.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    await addFilesMutation(
      {
        folderId: data.folderId,
        files: data.file,
      },
      {
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
      },
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="grid w-full gap-6 py-4">
        <p className="text-primary bg-primary-50 flex items-start gap-2 rounded-md p-2 text-xs italic">
          <span>
            <Info size={16} />
          </span>
          You can upload files without selecting a folder. Files uploaded without a folder will be stored at the root
          level.
        </p>
        <div className="grid w-full gap-2">
          <FormField
            name="folderId"
            placeholder="Select folder (optional)"
            className="!h-14 w-full"
            label="Folder (Optional)"
            type="select"
            options={folderOptions}
            disabled={foldersLoading || folderOptions.length === 0}
          />
          {!foldersLoading && folderOptions.length === 0 && !foldersError && (
            <p className="text-warning bg-warning-50 flex items-center gap-2 rounded-md p-2 text-xs italic">
              <span>
                <AlertCircle size={16} />
              </span>
              No folders available. You can still upload files to the root level.
            </p>
          )}
          {foldersLoading && <p className="text-sm text-gray-500">Loading folders...</p>}
          {foldersError && <p className="text-sm text-red-600">Error: {foldersError.message}</p>}
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
            isDisabled={isSubmitting || isPending}
            onClick={handleCancel}
          >
            Cancel
          </MainButton>
          <MainButton
            className="w-full"
            variant="primary"
            type="submit"
            isDisabled={isSubmitting || isPending || selectedFiles.length === 0}
          >
            {isSubmitting || isPending ? "Uploading..." : "Upload Files"}
          </MainButton>
        </div>
      </form>
    </FormProvider>
  );
};
