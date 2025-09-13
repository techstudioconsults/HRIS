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

interface CreateFolderFormProperties {
  onClose?: () => void;
}

export const CreateFileForm = ({ onClose }: CreateFolderFormProperties) => {
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
    formState: { isSubmitting },
    reset,
    watch,
    setValue,
  } = methods;

  const {
    data: foldersData,
    isLoading: foldersLoading,
    error: foldersError,
  } = useGetAllFolders({
    page: 1,
    limit: 50,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Use useEffect to handle the folder data and update options
  useEffect(() => {
    if (foldersData?.data?.items) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const options = foldersData.data.items.map((folder: any) => ({
        value: folder.id,
        label: folder.name,
      }));
      setFolderOptions(options);

      // Optional: Auto-select the first folder if none is selected
      if (options.length > 0 && !watch("folderId")) {
        setValue("folderId", options[0].value);
      }
    }
  }, [foldersData, setValue, watch]);

  // Get the selected folder ID from the form
  const selectedFolderId = watch("folderId");

  const handleCancel = () => {
    reset();
    setSelectedFiles([]);
    onClose?.();
  };

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    methods.setValue("file", files);
  };

  // const onSubmit = async (data: FileFormData) => {
  //   try {
  //     console.log("Form data:", data);
  //     console.log("Selected folder ID:", data.folderId);
  //     console.log("Selected files:", data.file);

  //     // Your actual submission logic would go here
  //     // Example: await uploadFilesToFolder(data.folderId, data.file);

  //     toast.success(`Files uploaded successfully!`);

  //     // Reset form and close modal on success
  //     reset();
  //     setSelectedFiles([]);
  //     onClose?.();
  //   } catch (error) {
  //     console.error("Submission error:", error);
  //     toast.error("Failed to upload files. Please try again.");
  //   }
  // };

  const addFilesMutation = useAddFilesToFolder();

  const onSubmit = async (data: FileFormData) => {
    try {
      await addFilesMutation.mutateAsync({
        folderId: data.folderId,
        files: data.file,
      });

      toast.success("Files uploaded successfully!");
      reset();
      onClose?.();
    } catch {
      toast.error("Failed to upload files");
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="grid w-full gap-6 py-4">
        <div className="grid w-full gap-2">
          <FormField
            name="folderId"
            placeholder="Select folder name"
            className="!h-14 w-full"
            label="Folder Name"
            type="select"
            required
            options={folderOptions}
            disabled={foldersLoading || folderOptions.length === 0}
            // loading={foldersLoading}
          />
          {foldersLoading && <p className="text-sm text-gray-500">Loading folders...</p>}
          {foldersError && <p className="text-sm text-red-500">Error loading folders: {foldersError.message}</p>}
          {!foldersLoading && folderOptions.length === 0 && !foldersError && (
            <p className="text-sm text-gray-500">No folders available. Please create a folder first.</p>
          )}
        </div>

        <div className="flex w-full flex-col gap-4 pt-4">
          <FileUpload onFileChange={handleFilesSelected} acceptedFileTypes=".pdf,.doc,.docx" maxFiles={3} />
        </div>

        <div className="flex w-full items-center justify-between gap-4 pt-4">
          <MainButton
            className="w-full"
            type="button"
            variant="outline"
            isDisabled={isSubmitting}
            onClick={handleCancel}
          >
            Cancel
          </MainButton>
          <MainButton
            className="w-full"
            variant="primary"
            type="submit"
            isDisabled={isSubmitting || !selectedFolderId || selectedFiles.length === 0}
          >
            {isSubmitting ? "Uploading..." : "Upload File"}
          </MainButton>
        </div>
      </form>
    </FormProvider>
  );
};
