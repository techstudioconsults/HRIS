'use client';

import { FolderFormData, folderSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '@workspace/ui/lib/inputs/FormFields';
import { MainButton } from '@workspace/ui/lib/button';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useResourceService } from '../../services/use-service';
import type { CreateFolderFormProperties } from '../../types';
import { FileUploader } from '@workspace/ui/components/core/miscellaneous/file-uploader';

export const CreateFolderForm = ({ onClose }: CreateFolderFormProperties) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { useCreateFolder } = useResourceService();

  const methods = useForm<FolderFormData>({
    resolver: zodResolver(folderSchema),
    defaultValues: {
      name: '',
      file: [],
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    setValue,
  } = methods;

  const { mutateAsync: createFolderMutation, isPending } = useCreateFolder();

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    setValue('file', files);
  };

  const handleCancel = () => {
    reset();
    setSelectedFiles([]);
    onClose?.();
  };

  const onSubmit = async (data: FolderFormData) => {
    await createFolderMutation(
      {
        name: data.name,
        file: data.file || [],
      },
      {
        onSuccess: () => {
          toast.success(`Folder "${data.name}" has been created.`);
          handleCancel();
        },
      }
    );
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid w-full gap-6 py-4"
      >
        <div className="grid w-full gap-2">
          <FormField
            name="name"
            placeholder="Enter folder name"
            className="h-14! w-full"
            label="Folder Name"
            type="text"
            required
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="flex w-full flex-col gap-4 pt-4">
          <label className="text-sm font-medium">Files (Optional)</label>
          <FileUploader
            value={selectedFiles}
            accept={{
              'application/pdf': ['.pdf'],
              'application/msword': ['.doc'],
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                ['.docx'],
              'application/vnd.ms-excel': ['.xls'],
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                ['.xlsx'],
              'image/jpeg': ['.jpg', '.jpeg'],
              'image/png': ['.png'],
            }}
            maxFiles={10}
            multiple
            onValueChange={handleFilesSelected}
          />
        </div>

        <div className="flex w-full items-center justify-between gap-4 pt-4">
          <MainButton
            className="w-full"
            type="button"
            variant="destructiveOutline"
            isDisabled={isSubmitting || isPending}
            onClick={handleCancel}
          >
            Cancel
          </MainButton>
          <MainButton
            className="w-full"
            variant="primary"
            type="submit"
            isDisabled={isSubmitting || isPending}
          >
            {isSubmitting || isPending ? 'Creating...' : 'Create Folder'}
          </MainButton>
        </div>
      </form>
    </FormProvider>
  );
};
