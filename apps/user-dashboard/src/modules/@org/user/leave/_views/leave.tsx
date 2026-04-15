'use client';

import { useState } from 'react';

import { UserLeaveBody, UserLeaveHeader } from '@/modules/@org/user';
import { LeaveDetailsModal } from '@/modules/@org/user';
import { LeaveRequestSubmittedModal } from '@/modules/@org/user';
import { RequestLeaveModal } from '@/modules/@org/user';
import type { LeaveRequest } from '../types';
import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';

const UserLeaveView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isSubmittedModalOpen, setIsSubmittedModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null
  );

  const handleCreateRequest = () => {
    setIsRequestModalOpen(true);
  };

  const handleViewDetails = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setIsDetailsModalOpen(true);
  };

  const handleRequestSuccess = () => {
    setIsSubmittedModalOpen(true);
  };

  return (
    <Wrapper className="my-0! p-0 max-w-200">
      <UserLeaveHeader
        onSearch={setSearchQuery}
        onCreateRequest={handleCreateRequest}
      />
      <UserLeaveBody
        searchQuery={searchQuery}
        onViewDetails={handleViewDetails}
      />

      <RequestLeaveModal
        open={isRequestModalOpen}
        onOpenChange={setIsRequestModalOpen}
        onSuccess={handleRequestSuccess}
      />

      <LeaveDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        request={selectedRequest}
      />

      <LeaveRequestSubmittedModal
        open={isSubmittedModalOpen}
        onOpenChange={setIsSubmittedModalOpen}
      />
    </Wrapper>
  );
};

export { UserLeaveView };
