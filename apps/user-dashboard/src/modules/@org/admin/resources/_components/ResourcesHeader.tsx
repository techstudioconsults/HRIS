'use client';

import { useResourcesModalParams } from '@/lib/nuqs/use-resources-modal-params';
import { SearchInput } from '@/modules/@org/shared/search-input';
import { DashboardHeader } from '@workspace/ui/lib/dashboard';
import { ReusableDialog } from '@workspace/ui/lib/dialog';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';

import type { ResourcesHeaderProperties } from '../types';
import { CreateFileForm } from './forms/create-file';
import { CreateFolderForm } from './forms/create-folder';

export const ResourcesHeader = ({ onSearch }: ResourcesHeaderProperties) => {
  // Modal URL state (nuqs) — create-folder and upload-file survive refresh
  const {
    isCreateFolderOpen,
    isUploadFileOpen,
    openCreateFolder,
    openUploadFile,
    closeModal,
  } = useResourcesModalParams();

  return (
    <section>
      <DashboardHeader
        title="Resources"
        subtitle="All Resources available in the organization"
        actionComponent={
          <div className="flex flex-col lg:flex-row items-center gap-2">
            <SearchInput
              className="h-10 w-full lg:w-fit"
              placeholder="Search resources..."
              onSearch={(query) => onSearch?.(query)}
            />
            <div className={`flex items-center w-full lg:w-auto gap-2`}>
              <MainButton
                variant="default"
                isLeftIconVisible={true}
                icon={<Icon name="FolderAdd" variant={`Outline`} />}
                onClick={openCreateFolder}
                className={`w-full bg-primary/10 text-primary`}
              >
                Create Folder
              </MainButton>
              <MainButton
                variant="primary"
                isLeftIconVisible={true}
                icon={<Icon name="DocumentText" variant={`Bold`} />}
                onClick={openUploadFile}
                className={`w-full`}
              >
                Upload File
              </MainButton>
            </div>
          </div>
        }
      />

      {/* Create Folder Dialog — persists across refresh */}
      <ReusableDialog
        open={isCreateFolderOpen}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
        title="Create New Folder"
        description="Add a new folder to organize your resources"
        className="lg:min-w-xl"
        trigger={null}
      >
        <CreateFolderForm onClose={closeModal} />
      </ReusableDialog>

      {/* Upload File Dialog — persists across refresh */}
      <ReusableDialog
        open={isUploadFileOpen}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
        title="Upload File"
        description="Upload a file to an existing folder"
        className="lg:min-w-xl"
        trigger={null}
      >
        <CreateFileForm onClose={closeModal} />
      </ReusableDialog>
    </section>
  );
};
