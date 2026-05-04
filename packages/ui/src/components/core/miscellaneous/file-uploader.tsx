'use client';

import { Button } from '@workspace/ui/components/button';
import { Progress } from '@workspace/ui/components/progress';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { useControllableState } from '@workspace/ui/hooks/use-controllable-state';
import { cn } from '@workspace/ui/lib/utils';
import {
  File,
  FileSpreadsheet,
  FileText,
  FileVideo,
  FileAudio,
  FileImage,
  LucideFileUp,
  X,
} from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import Dropzone, {
  type DropzoneProps,
  type FileRejection,
} from 'react-dropzone';
import { toast } from 'sonner';
import { Icon } from '@workspace/ui/lib/icons/icon';

function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const index = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, index)).toFixed(decimals))} ${sizes[index]}`;
}

function getAcceptedExtensions(accept: DropzoneProps['accept']): string {
  if (!accept) return '';
  return Object.values(accept).flat().join(', ');
}

interface FileUploaderProperties extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  /**
   * Controlled value — the current list of files.
   */
  value?: File[];

  /**
   * Called with the full updated file list whenever it changes (controllable-state pattern).
   */
  onValueChange?: (files: File[]) => void;

  /**
   * Simple callback for uncontrolled / form usage — receives the updated file array on every change.
   */
  onChange?: (files: File[]) => void;

  /**
   * Called to perform the actual upload. When provided the component shows upload progress toasts.
   */
  onUpload?: (files: File[]) => Promise<void>;

  /**
   * Per-file upload progress keyed by file name.
   */
  progresses?: Record<string, number>;

  /**
   * Accepted MIME types → extensions map (react-dropzone format).
   * @default { 'image/*': [] }
   */
  accept?: DropzoneProps['accept'];

  /**
   * Maximum file size in bytes.
   * @default 5 * 1024 * 1024 (5 MB)
   */
  maxSize?: DropzoneProps['maxSize'];

  /**
   * Maximum number of files the user may select.
   * @default 1
   */
  maxFiles?: DropzoneProps['maxFiles'];

  /**
   * Allow selecting multiple files at once.
   * @default false
   */
  multiple?: boolean;

  /**
   * Disable the drop zone entirely.
   * @default false
   */
  disabled?: boolean;
}

export function FileUploader(properties: FileUploaderProperties) {
  const {
    value: valueProperty,
    onValueChange,
    onChange,
    onUpload,
    progresses,
    accept = { 'image/*': [] },
    maxSize = 5 * 1024 * 1024,
    maxFiles = 1,
    multiple = false,
    disabled = false,
    className,
    ...dropzoneProperties
  } = properties;

  const [files, setFiles] = useControllableState({
    prop: valueProperty,
    onChange: (newFiles) => {
      onValueChange?.(newFiles ?? []);
      onChange?.(newFiles ?? []);
    },
  });

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!multiple && maxFiles === 1 && acceptedFiles.length > 1) {
        toast.error('Cannot upload more than 1 file at a time');
        return;
      }

      if ((files?.length ?? 0) + acceptedFiles.length > maxFiles) {
        toast.error(
          `Cannot upload more than ${maxFiles} file${maxFiles === 1 ? '' : 's'}`
        );
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      const updatedFiles = files ? [...files, ...newFiles] : newFiles;

      setFiles(updatedFiles);

      if (rejectedFiles.length > 0) {
        for (const { file, errors } of rejectedFiles) {
          const reason = errors[0]?.message ?? 'rejected';
          toast.error(`"${file.name}" was rejected: ${reason}`);
        }
      }

      if (
        onUpload &&
        updatedFiles.length > 0 &&
        updatedFiles.length <= maxFiles
      ) {
        const target =
          updatedFiles.length > 1 ? `${updatedFiles.length} files` : `1 file`;

        toast.promise(onUpload(updatedFiles), {
          loading: `Uploading ${target}…`,
          success: () => {
            setFiles([]);
            return `${target} uploaded`;
          },
          error: `Failed to upload ${target}`,
        });
      }
    },
    [files, maxFiles, multiple, onUpload, setFiles]
  );

  function onRemove(index: number) {
    if (!files) return;
    const newFiles = files.filter((_, fileIndex) => fileIndex !== index);
    setFiles(newFiles);
  }

  // Revoke preview object URLs on unmount to avoid memory leaks
  React.useEffect(() => {
    return () => {
      if (!files) return;
      for (const file of files) {
        if (isFileWithPreview(file)) {
          URL.revokeObjectURL(file.preview);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDisabled = disabled || (files?.length ?? 0) >= maxFiles;
  const acceptedExtensions = getAcceptedExtensions(accept);

  return (
    <div className="relative flex flex-col gap-6 overflow-hidden">
      <Dropzone
        onDrop={onDrop}
        accept={accept}
        maxSize={maxSize}
        maxFiles={maxFiles}
        multiple={maxFiles > 1 || multiple}
        disabled={isDisabled}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={cn(
              'group border-primary/25 bg-primary/10 hover:bg-muted/25 relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-3 border-dashed px-5 py-2.5 text-center transition',
              'ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden',
              isDragActive && 'border-primary/60 bg-primary/5',
              isDisabled && 'pointer-events-none opacity-60',
              className
            )}
            {...dropzoneProperties}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                <div className="rounded-full border border-dashed p-3">
                  <Icon name={`FileText`} variant={`Outline`} />
                </div>
                <p className="text-muted-foreground font-medium">
                  Drop the files here
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                <div className="rounded-full border border-dashed p-3">
                  <Icon name={`FileText`} variant={`Outline`} />
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground font-medium">
                    Drag &amp; drop files here, or{' '}
                    <span className="text-primary font-semibold">browse</span>
                  </p>
                  <p className="text-muted-foreground/70 text-sm">
                    {maxFiles > 1
                      ? `Up to ${maxFiles === Infinity ? 'unlimited' : maxFiles} files`
                      : 'Single file only'}
                    {maxSize ? ` · max ${formatBytes(maxSize)} each` : ''}
                  </p>
                  {acceptedExtensions && (
                    <p className="text-muted-foreground/60 text-xs">
                      {acceptedExtensions}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Dropzone>
      {files?.length ? (
        <ScrollArea className="h-fit w-full px-3">
          <div className="max-h-48 space-y-4">
            {files.map((file, index) => (
              <FileCard
                key={index}
                file={file}
                onRemove={() => onRemove(index)}
                progress={progresses?.[file.name]}
              />
            ))}
          </div>
        </ScrollArea>
      ) : null}
    </div>
  );
}

interface FileCardProperties {
  file: File;
  onRemove: () => void;
  progress?: number;
}

function getFileTypeIcon(mimeType: string): React.ReactNode {
  if (mimeType.startsWith('image/'))
    return <FileImage className="text-muted-foreground size-6" />;
  if (mimeType.startsWith('video/'))
    return <FileVideo className="text-muted-foreground size-6" />;
  if (mimeType.startsWith('audio/'))
    return <FileAudio className="text-muted-foreground size-6" />;
  if (mimeType === 'application/pdf')
    return <FileText className="text-muted-foreground size-6" />;
  if (
    mimeType === 'application/msword' ||
    mimeType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  )
    return <FileText className="text-muted-foreground size-6" />;
  if (
    mimeType === 'application/vnd.ms-excel' ||
    mimeType ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )
    return <FileSpreadsheet className="text-muted-foreground size-6" />;
  return <File className="text-muted-foreground size-6" />;
}

function FileCard({ file, progress, onRemove }: FileCardProperties) {
  const isImage = file.type.startsWith('image/');

  return (
    <div className="relative flex items-center space-x-4">
      <div className="flex flex-1 space-x-4">
        {isImage && isFileWithPreview(file) ? (
          <Image
            src={file.preview}
            alt={file.name}
            width={48}
            height={48}
            loading="lazy"
            className="aspect-square shrink-0 rounded-md object-cover"
          />
        ) : (
          <div className="bg-muted flex size-12 shrink-0 items-center justify-center rounded-md">
            {getFileTypeIcon(file.type)}
          </div>
        )}
        <div className="flex w-full flex-col gap-2">
          <div className="space-y-px">
            <p className="text-foreground/80 line-clamp-1 text-sm font-medium">
              {file.name}
            </p>
            <p className="text-muted-foreground text-xs">
              {formatBytes(file.size)}
            </p>
          </div>
          {progress ? <Progress value={progress} /> : null}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={progress !== undefined && progress < 100}
          className="size-8 rounded-full"
        >
          <X className="text-muted-foreground" />
          <span className="sr-only">Remove file</span>
        </Button>
      </div>
    </div>
  );
}

function isFileWithPreview(file: File): file is File & { preview: string } {
  return 'preview' in file && typeof file.preview === 'string';
}
