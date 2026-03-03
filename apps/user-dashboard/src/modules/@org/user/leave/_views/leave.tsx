'use client';

import { useState } from 'react';

import { UserLeaveBody, UserLeaveHeader } from '@/modules/@org/user';
import { LeaveDetailsModal } from '../_components/LeaveDetailsModal';
import { LeaveRequestSubmittedModal } from '../_components/LeaveRequestSubmittedModal';
import { RequestLeaveModal } from '../_components/RequestLeaveModal';
import type { LeaveRequest } from '../types';

const UserLeaveView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isSubmittedModalOpen, setIsSubmittedModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

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
    <div className="space-y-6">
      <UserLeaveHeader onSearch={setSearchQuery} onCreateRequest={handleCreateRequest} />
      <UserLeaveBody searchQuery={searchQuery} onViewDetails={handleViewDetails} />

      <RequestLeaveModal
        open={isRequestModalOpen}
        onOpenChange={setIsRequestModalOpen}
        onSuccess={handleRequestSuccess}
      />

      <LeaveDetailsModal open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen} request={selectedRequest} />

      <LeaveRequestSubmittedModal open={isSubmittedModalOpen} onOpenChange={setIsSubmittedModalOpen} />
    </div>
  );
};

export { UserLeaveView };
