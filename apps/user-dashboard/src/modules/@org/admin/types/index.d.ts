declare global {
  // ============================================================================
  // TABLE INFRASTRUCTURE TYPES
  // ============================================================================

  interface IColumnDefinition<T extends DataItem> {
    header: string;
    accessorKey: keyof T;
    render?: (value: T[keyof T], row: T) => ReactNode;
  }

  interface IRowAction<T> {
    label: string | ReactNode;
    icon?: ReactNode;
    onClick: (row: T) => void;
    kbd?: string;
    type?: 'action' | 'separator';
    variant?: 'destructive' | 'default';
    ariaLabel?: string;
  }

  interface IDashboardTableProperties<T extends DataItem> {
    data: T[];
    columns: IColumnDefinition<T>[];
    currentPage?: number;
    onPageChange?: (page: number) => void;
    totalPages?: number;
    itemsPerPage?: number;
    hasPreviousPage?: boolean;
    hasNextPage?: boolean;
    rowActions?: (row: T) => IRowAction<T>[];
    onRowClick?: (row: T) => void;
    showPagination?: boolean;
  }

  // ============================================================================
  // ADMIN UI TYPES
  // ============================================================================

  interface OnboardingStep {
    title: string;
    description: string;
    buttonLabel: string;
    icon: string | ReactNode;
    isCompleted: boolean | undefined;
    action: () => void;
  }
}

export {};
