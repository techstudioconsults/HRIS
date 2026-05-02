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
import { useUserLeaveModalParams } from '@/lib/nuqs/use-user-leave-modal-params';

import type { LeaveRequest } from '../types';

const UserLeaveView = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Modal URL state (nuqs) — request, details, edit survive refresh
  const {
    isRequestLeaveOpen,
    isLeaveDetailsOpen,
    isEditLeaveOpen,
    modalId,
    openRequestLeave,
    openLeaveDetails,
    openEditLeave,
    closeModal,
  } = useUserLeaveModalParams();

  // Local entity state — non-URL-serializable; populated on user action or cold-refresh lookup
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null
  );
  // 'submitted' success alert stays as useState (ephemeral)
  const [isSubmittedOpen, setIsSubmittedOpen] = useState(false);

  const handleCreateRequest = () => {
    openRequestLeave();
  };

  const handleViewDetails = (request: LeaveRequest) => {
    setSelectedRequest(request);
    openLeaveDetails(request.id);
  };

  const handleEditRequest = (request: LeaveRequest) => {
    setSelectedRequest(request);
    openEditLeave(request.id);
  };

  const handleRequestSuccess = () => {
    closeModal();
    setIsSubmittedOpen(true);
  };

  const handleCloseModal = () => {
    closeModal();
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

      {/* Create — persists across refresh */}
      <RequestLeaveModal
        open={isRequestLeaveOpen}
        onOpenChange={(open) => !open && handleCloseModal()}
        onSuccess={handleRequestSuccess}
      />

      {/* Edit — persists across refresh with modalId */}
      <RequestLeaveModal
        open={isEditLeaveOpen}
        onOpenChange={(open) => !open && handleCloseModal()}
        initialRequest={selectedRequest}
      />

      {/* View Details — persists across refresh with modalId */}
      <LeaveDetailsModal
        open={isLeaveDetailsOpen}
        onOpenChange={(open) => !open && handleCloseModal()}
        request={selectedRequest}
        onEdit={handleEditRequest}
      />

      {/* Post-submit confirmation — stays as useState (ephemeral success alert) */}
      <LeaveRequestSubmittedModal
        open={isSubmittedOpen}
        onOpenChange={(open) => !open && setIsSubmittedOpen(false)}
      />
    </Wrapper>
  );
};
export { UserLeaveView };
