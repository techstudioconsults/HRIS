'use client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@workspace/ui/components/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';
import { ReusableDialog } from '@workspace/ui/lib/dialog';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { cn } from '@workspace/ui/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';

import { useQueryClient } from '@tanstack/react-query';
import { useEmployeeService } from '@/modules/@org/admin/employee/services/use-service';
import { useTeamService } from '../../services/use-service';

interface AssignManagerDialogProps {
  team: Team | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AssignManagerDialog = ({
  team,
  open,
  onOpenChange,
}: AssignManagerDialogProps) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [isComboOpen, setIsComboOpen] = useState(false);

  const queryClient = useQueryClient();
  const { useGetAllEmployees } = useEmployeeService();
  const { useUpdateTeam } = useTeamService();
  const { data: employeesResp, isLoading: isLoadingEmployees } =
    useGetAllEmployees(
      { page: 1, teamId: team?.id ?? '' },
      { enabled: open && !!team?.id }
    );
  const { mutate: updateTeam, isPending: isSubmitting } = useUpdateTeam();

  const employees: Employee[] = employeesResp?.data?.items ?? [];
  const selectedEmployee = employees.find(
    (employee) => employee.id === selectedEmployeeId
  );

  const handleClose = () => {
    if (isSubmitting) return;
    setSelectedEmployeeId('');
    setIsComboOpen(false);
    onOpenChange(false);
  };

  const handleSubmit = () => {
    if (!team || !selectedEmployeeId) return;

    const formData = new FormData();
    formData.append('managerId', selectedEmployeeId);

    updateTeam(
      { id: team.id, data: formData },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['teams'] });
          toast.success(
            `${selectedEmployee?.firstName} ${selectedEmployee?.lastName} assigned as manager/lead of "${team.name}"`
          );
          handleClose();
        },
        onError: () => {
          toast.error('Failed to assign manager. Please try again.');
        },
      }
    );
  };

  const selectedLabel = selectedEmployee
    ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}`
    : null;

  return (
    <ReusableDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) handleClose();
      }}
      title="Assign Manager / Lead"
      description={`Select an employee to be the manager or lead of "${team?.name ?? ''}"`}
      trigger={<span />}
      className="max-w-md"
    >
      <div className="space-y-6 py-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Employee</label>
          <Popover open={isComboOpen} onOpenChange={setIsComboOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label="Select employee to assign as manager"
                className={cn(
                  'border-input bg-background ring-offset-background focus-visible:ring-ring flex h-11 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                  'transition-colors hover:border-primary focus:border-primary',
                  !selectedLabel && 'text-muted-foreground'
                )}
                disabled={isLoadingEmployees}
              >
                {isLoadingEmployees
                  ? 'Loading employees...'
                  : (selectedLabel ?? 'Search employee...')}
                <Icon
                  name="ChevronsUpDown"
                  size={16}
                  className="ml-2 shrink-0 opacity-50"
                />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 shadow-sm" align="start">
              <Command>
                <CommandInput placeholder="Search by name or email..." />
                <CommandList>
                  <CommandEmpty>No members found in this team.</CommandEmpty>
                  <CommandGroup>
                    {employees.map((employee) => (
                      <CommandItem
                        key={employee.id}
                        value={`${employee.firstName} ${employee.lastName} ${employee.email}`}
                        onSelect={() => {
                          setSelectedEmployeeId(employee.id);
                          setIsComboOpen(false);
                        }}
                      >
                        <Icon
                          name="Check"
                          size={16}
                          className={cn(
                            'mr-2 shrink-0',
                            selectedEmployeeId === employee.id
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        <div>
                          <p className="font-medium">
                            {employee.firstName} {employee.lastName}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {employee.email}
                          </p>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex justify-end gap-3">
          <MainButton
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </MainButton>
          <MainButton
            variant="primary"
            onClick={handleSubmit}
            disabled={!selectedEmployeeId || isSubmitting}
            isLoading={isSubmitting}
          >
            Assign
          </MainButton>
        </div>
      </div>
    </ReusableDialog>
  );
};
