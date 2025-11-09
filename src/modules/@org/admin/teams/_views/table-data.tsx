import { AlertModal } from "@/components/shared/dialog/alert-modal";
import { Badge } from "@/components/ui/badge";
import { useActiveTarget } from "@/context/active-target";
import { formatDate } from "@/lib/i18n/utils";
import { IColumnDefinition, IRowAction } from "@/modules/@org/admin/_components/table/table";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useTeamShortcuts } from "../hooks/use-team-shortcuts";
import { useTeamService } from "../services/use-service";

export const teamColumn: IColumnDefinition<Team>[] = [
  {
    header: "Team Name",
    accessorKey: "name",
    render: (_, team: Team) => <span className="text-sm font-medium">{team.name}</span>,
  },
  {
    header: "Team Lead",
    accessorKey: "manager",
    render: (_, team: Team) => (
      <span className="text-sm text-gray-600 dark:text-gray-400">{team.manager || "Not assigned"}</span>
    ),
  },
  {
    header: "Team Members",
    accessorKey: "members",
    render: (_, team: Team) => <Badge variant={`primary`}>{team.members || 0} members</Badge>,
  },
  {
    header: "Status",
    accessorKey: "status",
    render: (_, team: Team) => {
      const status = team.status || "active";
      return (
        <Badge variant={status === "active" ? "success" : "destructive"} className="min-w-fit">
          {status as string}
        </Badge>
      );
    },
  },
  {
    header: "Created on",
    accessorKey: "createdAt",
    render: (_, team: Team) => (
      <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(team.createdAt as string)}</span>
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
  const { entity: activeTeam, set: setActiveTeam } = useActiveTarget<Team>();

  // Bind global shortcuts for teams
  useTeamShortcuts();

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
    const baseActions: IRowAction<Team>[] = [
      {
        label: "View team",
        kbd: "Ctrl+V",
        icon: <Eye className="h-4 w-4" aria-hidden="true" />,
        onClick: async () => {
          setActiveTeam(team);
          router.push(`/admin/teams/${team.id}`);
        },
      },
      {
        label: "Edit team",
        kbd: "Ctrl+E",
        icon: <Pencil className="h-4 w-4" aria-hidden="true" />,
        onClick: () => {
          setActiveTeam(team);
          if (onEditTeam) {
            onEditTeam(team);
          } else {
            router.push(`/admin/teams/${team.id}/edit`);
          }
        },
      },
      ...(onAddEmployees
        ? [
            {
              label: "Add Employees",
              onClick: () => {
                setActiveTeam(team);
                onAddEmployees(team);
              },
            } as IRowAction<Team>,
          ]
        : []),
      { type: "separator" },
      {
        label: "Delete team",
        kbd: "Ctrl+Del",
        variant: "destructive",
        icon: <Trash className="text-destructive h-4 w-4" aria-hidden="true" />,
        onClick: () => {
          setActiveTeam(team);
          setTeamToDelete(team);
          setIsDeleteModalOpen(true);
        },
      },
    ];

    return baseActions;
  };

  // Listen to global delete requests dispatched by useTeamShortcuts
  useEffect(() => {
    const onDeleteRequest = () => {
      if (!activeTeam) return;
      setTeamToDelete(activeTeam);
      setIsDeleteModalOpen(true);
    };
    window.addEventListener("team:request-delete", onDeleteRequest);
    return () => window.removeEventListener("team:request-delete", onDeleteRequest);
  }, [activeTeam]);

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

  return { getRowActions, DeleteConfirmationModal, setActiveTeam };
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
    render: (_, team: Team) => <Badge variant={`primary`}>{team.members}</Badge>,
  },
  {
    header: "Created on",
    accessorKey: "createdAt",
    render: (_, team: Team) => <span>{formatDate(team.createdAt as string)}</span>,
  },
];

export const useSubTeamRowActions = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { useDeleteTeam } = useTeamService();
  const { mutateAsync: deleteTeam, isPending } = useDeleteTeam();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { entity: activeTeam, set: setActiveTeam } = useActiveTarget<Team>();

  // Global shortcuts apply here as well
  useTeamShortcuts();

  const resetModalState = () => {
    setIsDeleteModalOpen(false);
    setTeamToDelete(null);
    setIsDeleting(false);
  };

  const handleDeleteTeam = async () => {
    if (!teamToDelete || isDeleting) return;
    setIsDeleting(true);
    await deleteTeam(teamToDelete.id);
    await queryClient.invalidateQueries({ queryKey: ["teams", "list"] });
    toast.success(`Team ${teamToDelete.name} deleted successfully!`);
    resetModalState();
  };

  const getRowActions = (team: Team) => {
    const actions: IRowAction<Team>[] = [
      {
        label: "View team",
        kbd: "Ctrl+V",
        icon: <Eye className="h-4 w-4" aria-hidden="true" />,
        onClick: async () => {
          setActiveTeam(team);
          router.push(`/admin/teams/sub-team/${team.id}`);
        },
      },
      {
        label: "Edit team",
        kbd: "Ctrl+E",
        icon: <Pencil className="h-4 w-4" aria-hidden="true" />,
        onClick: () => {
          setActiveTeam(team);
          // TODO: Update to actual edit route for sub-teams when available
          router.push(`/`);
        },
      },
      { type: "separator" },
      {
        label: "Delete team",
        kbd: "Ctrl+Del",
        variant: "destructive",
        icon: <Trash className="text-destructive h-4 w-4" aria-hidden="true" />,
        onClick: () => {
          setActiveTeam(team);
          setTeamToDelete(team);
          setIsDeleteModalOpen(true);
        },
      },
    ];
    return actions;
  };

  // Listen to global delete requests dispatched by team shortcuts
  useEffect(() => {
    const onDeleteRequest = () => {
      if (!activeTeam) return;
      setTeamToDelete(activeTeam);
      setIsDeleteModalOpen(true);
    };
    window.addEventListener("team:request-delete", onDeleteRequest);
    return () => window.removeEventListener("team:request-delete", onDeleteRequest);
  }, [activeTeam]);

  const DeleteConfirmationModal = () => (
    <AlertModal
      isOpen={isDeleteModalOpen}
      onClose={() => {
        if (!isDeleting && !isPending) {
          resetModalState();
        }
      }}
      onConfirm={handleDeleteTeam}
      loading={isDeleting || isPending}
      type="warning"
      title="Delete Sub-team"
      description={`Are you sure you want to delete "${teamToDelete?.name}"? This action cannot be undone.`}
      confirmText="Delete Sub-team"
      cancelText="Cancel"
    />
  );

  return { getRowActions, DeleteConfirmationModal };
};
