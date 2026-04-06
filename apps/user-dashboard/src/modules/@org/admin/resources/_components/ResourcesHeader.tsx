'use client';

import { SearchInput } from '@/modules/@org/shared/search-input';
import { DashboardHeader, ReusableDialog } from '@workspace/ui/lib';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { useState } from 'react';

import { CreateFileForm } from './forms/create-file';
import { CreateFolderForm } from './forms/create-folder';

interface ResourcesHeaderProperties {
  onSearch?: (query: string) => void;
}

export const ResourcesHeader = ({ onSearch }: ResourcesHeaderProperties) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'folder' | 'file'>('folder');

  const handleOpenFolderDialog = () => {
    setDialogType('folder');
    setDialogOpen(true);
  };

  const handleOpenFileDialog = () => {
    setDialogType('file');
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
          <div className="flex flex-col lg:flex-row items-center gap-2">
            <SearchInput
              className="h-10 rounded-md border w-full lg:w-fit"
              placeholder="Search resources..."
              onSearch={handleSearch}
            />
            <div className={`flex items-center w-full lg:w-auto gap-2`}>
              <MainButton
                variant="primaryOutline"
                isLeftIconVisible={true}
                icon={<Icon name="FolderAdd" variant={`Outline`} />}
                onClick={handleOpenFolderDialog}
                className={`w-full`}
              >
                Create Folder
              </MainButton>
              <MainButton
                variant="primary"
                isLeftIconVisible={true}
                icon={<Icon name="DocumentText" variant={`Bold`} />}
                onClick={handleOpenFileDialog}
                className={`w-full`}
              >
                Upload File
              </MainButton>
            </div>
          </div>
        }
      />

      {/* Create Folder Dialog */}
      <ReusableDialog
        open={dialogOpen && dialogType === 'folder'}
        onOpenChange={setDialogOpen}
        title="Create New Folder"
        description="Add a new folder to organize your resources"
        className="lg:min-w-xl"
        trigger={null}
      >
        <CreateFolderForm onClose={handleCloseDialog} />
      </ReusableDialog>

      {/* Upload File Dialog */}
      <ReusableDialog
        open={dialogOpen && dialogType === 'file'}
        onOpenChange={setDialogOpen}
        title="Upload File"
        description="Upload a file to an existing folder"
        className="lg:min-w-xl"
        trigger={null}
      >
        <CreateFileForm onClose={handleCloseDialog} />
      </ReusableDialog>
    </section>
  );
};
