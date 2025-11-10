"use client";

import { BlurImage } from "@/components/core/miscellaneous/blur-image";
import MainButton from "@/components/shared/button";
import { File, PaperclipIcon, Trash2Icon } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";

type FileUploadProperties = {
  onFileChange: (files: File[]) => void;
  acceptedFileTypes?: string;
  maxFiles?: number;
  showPreview?: boolean;
};

const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();
  event.stopPropagation();
};

export default function FileUpload({
  onFileChange,
  acceptedFileTypes = "*",
  maxFiles = 1,
  showPreview = false,
}: FileUploadProperties) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputReference = useRef<HTMLInputElement>(null);

  const dropZoneReference = useRef<HTMLDivElement>(null);

  const generatePreviews = (newFiles: File[]) => {
    const newPreviews: string[] = [];
    for (const file of newFiles) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.addEventListener("load", (event) => {
          newPreviews.push(event.target?.result as string);
          setPreviews([...newPreviews]);
        });
        reader.readAsDataURL(file);
      } else {
        newPreviews.push("");
      }
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = [...event.target.files];
      const updatedFiles = maxFiles > 1 ? [...files, ...newFiles].slice(0, maxFiles) : newFiles;
      setFiles(updatedFiles);
      onFileChange(updatedFiles);

      if (showPreview) {
        generatePreviews(updatedFiles);
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);

    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      const newFiles = [...droppedFiles];
      const updatedFiles = maxFiles > 1 ? [...files, ...newFiles].slice(0, maxFiles) : newFiles;
      setFiles(updatedFiles);
      onFileChange(updatedFiles);

      if (showPreview) {
        generatePreviews(updatedFiles);
      }
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, index_) => index_ !== index);
    const updatedPreviews = previews.filter((_, index_) => index_ !== index);
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    onFileChange(updatedFiles);
  };

  return (
    <div className="space-y-4">
      <div
        ref={dropZoneReference}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsDragActive(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsDragActive(false);
        }}
        onClick={() => fileInputReference.current?.click()}
        className={`${
          isDragActive ? "border-primary-400 bg-primary-100" : "border-primary hover:border-primary-300"
        } bg-primary-50 flex min-h-[120px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors`}
      >
        <div className="flex flex-col items-center justify-center">
          <div className={`flex items-center gap-2`}>
            <PaperclipIcon className="h-6 w-6" />
            <p className="cursor-pointer text-sm text-gray-600">
              <span className="font-medium text-blue-600">Browse files</span> or drag and drop here
            </p>
          </div>
          <p className="mt-2 text-[10px] text-gray-500">
            {acceptedFileTypes === "*" ? "Any file type" : `Supported: ${acceptedFileTypes}`}
          </p>
        </div>
        <input
          ref={fileInputReference}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={acceptedFileTypes}
          multiple={maxFiles > 1}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded-md bg-gray-50 p-3">
              <div className="flex items-center space-x-2">
                {showPreview && file.type.startsWith("image/") && previews[index] ? (
                  <BlurImage
                    src={previews[index]}
                    alt={file.name}
                    className="h-10 w-10 rounded object-cover"
                    width={40}
                    height={40}
                  />
                ) : (
                  <File className={`w-4`} />
                )}
                <span className="max-w-xs truncate text-sm font-medium text-gray-700">{file.name}</span>
              </div>
              <MainButton
                isIconOnly
                size={`icon`}
                icon={<Trash2Icon />}
                type="button"
                onClick={() => removeFile(index)}
                className="text-gray-500 hover:text-red-500"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
