'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query/query-keys';
import { useTeamService } from '../services/use-service';
import { formatDate } from '@/lib/formatters';

export const useBulkTeamActions = () => {
  const queryClient = useQueryClient();
  const { useDeleteTeam } = useTeamService();
  const { mutateAsync: deleteTeam } = useDeleteTeam();

  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);

  const handleSelectionChange = useCallback((rows: Team[]) => {
    setSelectedTeams(rows);
  }, []);

  const openBulkDeleteModal = useCallback(() => {
    if (selectedTeams.length === 0) return;
    setIsBulkDeleteModalOpen(true);
  }, [selectedTeams.length]);

  const closeBulkDeleteModal = useCallback(() => {
    if (!isBulkDeleting) setIsBulkDeleteModalOpen(false);
  }, [isBulkDeleting]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedTeams.length === 0 || isBulkDeleting) return;
    setIsBulkDeleting(true);

    let successCount = 0;
    let failCount = 0;

    for (const team of selectedTeams) {
      try {
        await deleteTeam(team.id);
        successCount++;
      } catch (error) {
        failCount++;
        toast.error(
          `Failed to delete "${team.name}": ${
            (error as { message?: string })?.message ?? 'Unknown error'
          }`
        );
      }
    }

    await queryClient.invalidateQueries({ queryKey: queryKeys.team.list() });
    setIsBulkDeleting(false);
    setIsBulkDeleteModalOpen(false);
    setSelectedTeams([]);

    if (successCount > 0) {
      toast.success(
        `${successCount} team${successCount > 1 ? 's' : ''} deleted successfully.`
      );
    }
    if (failCount > 0) {
      toast.error(
        `${failCount} deletion${failCount > 1 ? 's' : ''} failed. See errors above.`
      );
    }
  }, [deleteTeam, isBulkDeleting, queryClient, selectedTeams]);

  const handleBulkExport = useCallback(() => {
    if (selectedTeams.length === 0) return;

    const headers = [
      'Team Name',
      'Team Lead',
      'Members',
      'Status',
      'Created On',
    ];
    const rows = selectedTeams.map((team) => [
      team.name,
      team.manager?.name ?? '',
      String(team.members ?? 0),
      team.status ?? 'active',
      formatDate(team.createdAt as string),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `teams-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success(
      `Exported ${selectedTeams.length} team${selectedTeams.length > 1 ? 's' : ''} to CSV.`
    );
  }, [selectedTeams]);

  return {
    selectedTeams,
    selectedCount: selectedTeams.length,
    handleSelectionChange,
    isBulkDeleteModalOpen,
    isBulkDeleting,
    openBulkDeleteModal,
    closeBulkDeleteModal,
    handleBulkDelete,
    handleBulkExport,
  };
};
