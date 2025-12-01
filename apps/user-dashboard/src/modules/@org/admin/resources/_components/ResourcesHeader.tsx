"use client";

import { SearchInput } from "@/modules/@org/shared/search-input";
import { DashboardHeader, ReusableDialog } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { Folder } from "iconsax-reactjs";
import { useState } from "react";
import { PiFileFill } from "react-icons/pi";

import { CreateFileForm } from "./forms/create-file";
import { CreateFolderForm } from "./forms/create-folder";

interface ResourcesHeaderProperties {
  onSearch?: (query: string) => void;
}

export const ResourcesHeader = ({ onSearch }: ResourcesHeaderProperties) => {
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

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSearch = (query: string) => {
    onSearch?.(query);
  };

  return (
    <section>
      <DashboardHeader
        title="Resources"
        subtitle="All Resources available in the organization"
        actionComponent={
          <div className="flex items-center gap-2">
            <SearchInput
              className="border-border h-10 rounded-md border"
              placeholder="Search resources..."
              onSearch={handleSearch}
            />
            <MainButton
              variant="primaryOutline"
              isLeftIconVisible={true}
              icon={<Folder />}
              onClick={handleOpenFolderDialog}
            >
              Create Folder
            </MainButton>
            <MainButton variant="primary" isLeftIconVisible={true} icon={<PiFileFill />} onClick={handleOpenFileDialog}>
              Upload File
            </MainButton>
          </div>
        }
      />

      {/* Create Folder Dialog */}
      <ReusableDialog
        open={dialogOpen && dialogType === "folder"}
        onOpenChange={setDialogOpen}
        title="Create New Folder"
        description="Add a new folder to organize your resources"
        className="min-w-xl"
        trigger={null}
      >
        <CreateFolderForm onClose={handleCloseDialog} />
      </ReusableDialog>

      {/* Upload File Dialog */}
      <ReusableDialog
        open={dialogOpen && dialogType === "file"}
        onOpenChange={setDialogOpen}
        title="Upload File"
        description="Upload a file to an existing folder"
        className="min-w-xl"
        trigger={null}
      >
        <CreateFileForm onClose={handleCloseDialog} />
      </ReusableDialog>
    </section>
  );
};
