"use client";

import MainButton from "@/components/shared/button";
import { ReusableDialog } from "@/components/shared/dialog/Dialog";
import { Add, SearchNormal1 } from "iconsax-reactjs";
import { useState } from "react";

import { CreateFileForm } from "./forms/create-file";
import { CreateFolderForm } from "./forms/create-folder";

export const ResourcesHeader = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"folder" | "file">("folder");

  const handleOpenFolderDialog = () => {
    setDialogType("folder");
    setDialogOpen(true);
  };
  const handleOpenFileDialog = () => {
    setDialogType("file");
    setDialogOpen(true);
  };

  return (
    <>
      <div className="flex flex-col items-start justify-between pb-6 md:items-center lg:flex-row">
        <div className="py-3 text-left">
          <h4 className="">Resources</h4>
          <p className="">Resources</p>
        </div>

        <div className="hidden flex-col items-center gap-4 lg:flex lg:flex-row">
          {/* Search Input */}
          <div className="relative hidden w-full max-w-[240px] md:block">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchNormal1 size="15" className="text-gray-400" variant="Outline" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="focus:ring-primary-500 block w-full rounded border-0 py-3 pr-4 pl-10 text-gray-900 ring-1 ring-gray-200 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              // onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <MainButton
            className="border-gray-75 text-black dark:text-white"
            variant="outline"
            isLeftIconVisible={true}
            icon={<Add />}
            onClick={handleOpenFolderDialog}
          >
            Create Folder
          </MainButton>
          <MainButton variant="primary" isLeftIconVisible={true} icon={<Add />} onClick={handleOpenFileDialog}>
            Upload File
          </MainButton>
        </div>
      </div>
      <ReusableDialog
        open={dialogOpen && dialogType === "folder"}
        onOpenChange={setDialogOpen}
        title="Create New Folder"
        description=" Add a new folder to organize your resources"
        trigger={null}
      >
        <CreateFolderForm onClose={() => setDialogOpen(false)} />
      </ReusableDialog>
      <ReusableDialog
        open={dialogOpen && dialogType === "file"}
        onOpenChange={setDialogOpen}
        title="Upload File"
        description=" Add a new folder to organize your resources"
        trigger={null}
      >
        <CreateFileForm onClose={() => setDialogOpen(false)} />
      </ReusableDialog>
    </>
  );
};
