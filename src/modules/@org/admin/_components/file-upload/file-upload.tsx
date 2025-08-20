"use client";

import MainButton from "@/components/shared/button";
import { useDroppable } from "@dnd-kit/core";
import { File, PaperclipIcon, Trash2Icon } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";

type FileUploadProperties = {
  onFileChange: (files: File[]) => void;
  acceptedFileTypes?: string;
  maxFiles?: number;
};

const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();
};

export default function FileUpload({ onFileChange, acceptedFileTypes = "*", maxFiles = 1 }: FileUploadProperties) {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputReference = useRef<HTMLInputElement>(null);

  const { setNodeRef: setDropNodeReference } = useDroppable({
    id: "file-dropzone",
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = [...event.target.files];
      const updatedFiles = maxFiles > 1 ? [...files, ...newFiles].slice(0, maxFiles) : newFiles;
      setFiles(updatedFiles);
      onFileChange(updatedFiles);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      const newFiles = [...event.dataTransfer.files];
      const updatedFiles = maxFiles > 1 ? [...files, ...newFiles].slice(0, maxFiles) : newFiles;
      setFiles(updatedFiles);
      onFileChange(updatedFiles);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, index_) => index_ !== index);
    setFiles(updatedFiles);
    onFileChange(updatedFiles);
  };

  return (
    <div className="space-y-4">
      <div
        ref={setDropNodeReference}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`bg-primary-50 border-primary rounded-lg border-2 border-dashed p-2 text-center transition-colors`}
      >
        <div className="flex flex-col items-center justify-center">
          <div className={`flex items-center gap-2`}>
            <PaperclipIcon />
            <p onClick={() => fileInputReference.current?.click()} className="cursor-pointer text-sm text-gray-600">
              <span className="font-medium text-blue-600">Browse files</span> or drag and drop here
            </p>
          </div>
          <p className="text-[10px] text-gray-500">
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
                <File className={`w-4`} />
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
