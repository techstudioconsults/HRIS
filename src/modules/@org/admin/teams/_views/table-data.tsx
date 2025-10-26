import { AlertModal } from "@/components/shared/dialog/alert-modal";
import { formatDate } from "@/lib/i18n/utils";
import { useTeamService } from "@/modules/@org/admin/teams/services/use-service";
// import { Edit, Eye, MinusCircle, Trash } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const teamColumn: IColumnDefinition<Team>[] = [
  {
    header: "Team Name",
    accessorKey: "name",
    render: (_, team: Team) => <span className="font-medium">{team.name}</span>,
  },
  {
    header: "Team Lead",
    accessorKey: "manager",
    render: (_, team: Team) => (
      <span className="text-gray-600 dark:text-gray-400">{team.manager || "Not assigned"}</span>
    ),
  },
  {
    header: "Team Members",
    accessorKey: "members",
    render: (_, team: Team) => (
      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
        {team.members || 0} members
      </span>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    render: (_, team: Team) => {
      const status = team.status || "active";
      const statusColors = {
        active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        inactive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      };
      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status as keyof typeof statusColors] || statusColors.active}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    },
  },
  {
    header: "Created on",
    accessorKey: "createdAt",
    render: (_, team: Team) => (
      <span className="text-gray-600 dark:text-gray-400">{formatDate(team.createdAt as string)}</span>
    ),
  },
];

export const useTeamRowActions = (onAddEmployees?: (team: Team) => void, onEditTeam?: (team: Team) => void) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { useDeleteTeam } = useTeamService();
  const { mutateAsync: deleteTeam, isPending } = useDeleteTeam();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const resetModalState = () => {
    setIsDeleteModalOpen(false);
    setTeamToDelete(null);
    setIsDeleting(false);
  };

  const handleDeleteTeam = async () => {
    if (!teamToDelete || isDeleting) return;

    setIsDeleting(true);

    await deleteTeam(teamToDelete.id);
    // Manually invalidate the teams cache to ensure table refreshes
    await queryClient.invalidateQueries({ queryKey: ["teams", "list"] });
    toast.success(`Team ${teamToDelete.name} deleted successfully!`);

    // Close modal after successful deletion
    resetModalState();
  };

  const getRowActions = (team: Team) => {
    const actions: IRowAction<Team>[] = [];
    actions.push(
      {
        label: "View team",
        onClick: async () => {
          router.push(`/admin/teams/${team.id}`);
        },
        // icon: <MinusCircle className={`text-high-warning`} />,
      },
      {
        label: "Edit team",
        onClick: () => {
          if (onEditTeam) {
            onEditTeam(team);
          } else {
            router.push(`/admin/teams/${team.id}/edit`);
          }
        },
        // icon: <Edit className={`text-high-primary`} />,
      },
    );

    // Add "Add Employees" action if callback is provided
    if (onAddEmployees) {
      actions.push({
        label: "Add Employees",
        onClick: () => {
          onAddEmployees(team);
        },
        // icon: <UserPlus className={`text-high-primary`} />,
      });
    }

    actions.push({
      label: "Delete team",
      onClick: () => {
        setTeamToDelete(team);
        setIsDeleteModalOpen(true);
      },
      // icon: <Eye className={`text-high-primary`} />,
    });

    return actions;
  };

  const DeleteConfirmationModal = () => (
    <AlertModal
      isOpen={isDeleteModalOpen}
      onClose={() => {
        // Only allow closing if not currently deleting
        if (!isDeleting && !isPending) {
          resetModalState();
        }
      }}
      onConfirm={handleDeleteTeam}
      loading={isDeleting || isPending}
      type="warning"
      title="Delete Team"
      description={`Are you sure you want to delete "${teamToDelete?.name}"? This action cannot be undone.`}
      confirmText="Delete Team"
      cancelText="Cancel"
    />
  );

  return { getRowActions, DeleteConfirmationModal };
};

export const subTeamColumn: IColumnDefinition<Team>[] = [
  {
    header: "Sub-team Name",
    accessorKey: "name",
    render: (_, team: Team) => <span>{team.name}</span>,
  },
  {
    header: "Team Lead",
    accessorKey: "manager",
  },
  {
    header: "Team Members",
    accessorKey: "members",
    render: (_, team: Team) => <span>{team.members}</span>,
  },
  {
    header: "Created on",
    accessorKey: "createdAt",
  },
];

export const useSubTeamRowActions = () => {
  const router = useRouter();

  const getRowActions = (team: Team) => {
    const actions: IRowAction<Team>[] = [];
    actions.push(
      {
        label: "View team",
        onClick: async () => {
          router.push(`/admin/teams/sub-team/${team.id}`);
        },
        // icon: <MinusCircle className={`text-high-warning`} />,
      },
      {
        label: "Edit team",
        onClick: () => {
          router.push(`/`);
        },
        // icon: <Eye className={`text-high-primary`} />,
      },
      {
        label: "Delete team",
        onClick: () => {
          router.push(`/`);
        },
        // icon: <Eye className={`text-high-primary`} />,
      },
    );
    return actions;
  };
  return { getRowActions };
};
