'use client';

import type { OnboardingSchemaTeam as TeamFormType } from '@/modules/@org/onboarding/types';
import { TeamForm } from '@/modules/@org/onboarding/_components/forms/team/team-form';
import { AlertModal, ReusableDialog } from '@workspace/ui/lib/dialog';

interface TeamDetailsDialogsProps {
  // Edit team dialog
  isEditTeamOpen: boolean;
  onCloseEditTeam: () => void;
  editingTeam: Team | null;
  teamData: Team | undefined;
  onUpdateTeamName: (data: { name: string }) => Promise<void>;
  isUpdating: boolean;
  // Add sub-team dialog
  isAddSubTeamOpen: boolean;
  onCloseAddSubTeam: () => void;
  onAddSubTeam: (data: { name: string }) => Promise<void>;
  isCreating: boolean;
  // Delete sub-team confirmation (from row-action hook)
  SubTeamDeleteModal: () => React.JSX.Element;
  // Delete team confirmation
  isDeleteConfirmOpen: boolean;
  teamName: string | undefined;
  isDeleting: boolean;
  onCloseDeleteConfirm: () => void;
  onConfirmDeleteTeam: () => Promise<void>;
}

const TeamDetailsDialogs = ({
  isEditTeamOpen,
  onCloseEditTeam,
  editingTeam,
  teamData,
  onUpdateTeamName,
  isUpdating,
  isAddSubTeamOpen,
  onCloseAddSubTeam,
  onAddSubTeam,
  isCreating,
  SubTeamDeleteModal,
  isDeleteConfirmOpen,
  teamName,
  isDeleting,
  onCloseDeleteConfirm,
  onConfirmDeleteTeam,
}: TeamDetailsDialogsProps) => (
  <>
    {/* Edit Team Name */}
    <ReusableDialog
      open={isEditTeamOpen}
      onOpenChange={(open) => {
        if (!open) onCloseEditTeam();
      }}
      title="Edit Team Name"
      description="Update the name of this team"
      trigger={<span />}
      className="min-w-2xl"
    >
      <TeamForm
        initialData={
          editingTeam
            ? ({
                id: editingTeam.id,
                name: editingTeam.name,
                roles: [],
              } as TeamFormType)
            : teamData
              ? ({
                  id: teamData.id,
                  name: teamData.name,
                  roles: [],
                } as TeamFormType)
              : undefined
        }
        onSubmit={onUpdateTeamName}
        onCancel={onCloseEditTeam}
        isSubmitting={isUpdating}
      />
    </ReusableDialog>

    {/* Add Sub-team */}
    <ReusableDialog
      open={isAddSubTeamOpen}
      onOpenChange={(open) => {
        if (!open) onCloseAddSubTeam();
      }}
      title="Add Sub-team"
      description="Create a new sub-team under this team"
      trigger={<span />}
      className="min-w-2xl"
    >
      <TeamForm
        onSubmit={onAddSubTeam}
        onCancel={onCloseAddSubTeam}
        isSubmitting={isCreating}
      />
    </ReusableDialog>

    {/* Sub-team row-action delete confirmation */}
    <SubTeamDeleteModal />

    {/* Delete Team confirmation */}
    <AlertModal
      isOpen={isDeleteConfirmOpen}
      onClose={onCloseDeleteConfirm}
      onConfirm={onConfirmDeleteTeam}
      loading={isDeleting}
      type="warning"
      title="Delete Team"
      description={`Are you sure you want to delete "${teamName}"? This action cannot be undone.`}
      confirmText={isDeleting ? 'Deleting...' : 'Delete Team'}
      cancelText="Cancel"
    />
  </>
);

export { TeamDetailsDialogs };
