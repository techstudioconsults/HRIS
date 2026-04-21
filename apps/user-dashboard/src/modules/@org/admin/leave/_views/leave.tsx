'use client';

import { LeaveSetupModal } from '@/modules/@org/admin/leave';
import { useCallback, useState } from 'react';

import { LeaveDetailsDrawer } from '../_components/leave-details-drawer';
import { LeaveBody } from '../_components/LeaveBody';
import { LeaveHeader } from '../_components/LeaveHeader';
import { useLeaveRowActions } from './table-data';

const LeaveView = () => {
  const { getRowActions } = useLeaveRowActions();
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = useCallback(
    (query: string) => setSearchQuery(query),
    []
  );

  return (
    <div className="space-y-6">
      <LeaveSetupModal />
      <LeaveDetailsDrawer />

      <LeaveHeader onSearch={handleSearch} />
      <LeaveBody searchQuery={searchQuery} getRowActions={getRowActions} />
    </div>
  );
};

export { LeaveView };
