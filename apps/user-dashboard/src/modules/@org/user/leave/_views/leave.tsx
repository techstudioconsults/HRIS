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

  const handleEditRequest = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setActiveModal('edit');
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

      {/* Create */}
      <RequestLeaveModal
        open={activeModal === 'request'}
        onOpenChange={(open) => !open && closeModal()}
        onSuccess={handleRequestSuccess}
      />

      {/* Edit */}
      <RequestLeaveModal
        open={activeModal === 'edit'}
        onOpenChange={(open) => !open && closeModal()}
        initialRequest={selectedRequest}
      />

      {/* View Details */}
      <LeaveDetailsModal
        open={activeModal === 'details'}
        onOpenChange={(open) => !open && closeModal()}
        request={selectedRequest}
        onEdit={handleEditRequest}
      />

      {/* Post-submit confirmation */}
      <LeaveRequestSubmittedModal
        open={activeModal === 'submitted'}
        onOpenChange={(open) => !open && closeModal()}
      />
    </Wrapper>
  );
};
export { UserLeaveView };
