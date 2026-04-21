'use client';

import { useState } from 'react';
import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';
import {
  UserLeaveBody,
  UserLeaveHeader,
  LeaveDetailsModal,
  LeaveRequestSubmittedModal,
  RequestLeaveModal,
} from '@/modules/@org/user';

import type { LeaveRequest, LeaveModalState } from '../types';

const UserLeaveView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<LeaveModalState>(null);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null
  );

  const handleCreateRequest = () => setActiveModal('request');

  const handleViewDetails = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setActiveModal('details');
  };

  const handleRequestSuccess = () => setActiveModal('submitted');

  const closeModal = () => {
    setActiveModal(null);
    setSelectedRequest(null);
  };
  return (
    <Wrapper className="my-0! p-0 max-w-800">
      <UserLeaveHeader
        onSearch={setSearchQuery}
        onCreateRequest={handleCreateRequest}
      />
      <UserLeaveBody
        searchQuery={searchQuery}
        onViewDetails={handleViewDetails}
      />
      <RequestLeaveModal
        open={activeModal === 'request'}
        onOpenChange={(open) => !open && closeModal()}
        onSuccess={handleRequestSuccess}
      />
      <LeaveDetailsModal
        open={activeModal === 'details'}
        onOpenChange={(open) => !open && closeModal()}
        request={selectedRequest}
      />
      <LeaveRequestSubmittedModal
        open={activeModal === 'submitted'}
        onOpenChange={(open) => !open && closeModal()}
      />
    </Wrapper>
  );
};
export { UserLeaveView };
