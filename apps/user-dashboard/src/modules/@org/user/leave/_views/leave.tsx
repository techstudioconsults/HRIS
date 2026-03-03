'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { RequestLeaveModal, UserLeaveBody, UserLeaveHeader } from '@/modules/@org/user';
import type { LeaveRequest } from '../types';

const UserLeaveView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const handleCreateRequest = () => {
    setIsRequestModalOpen(true);
  };

  const handleViewDetails = (request: LeaveRequest) => {
    // TODO: Open leave details modal/drawer
    console.log('View details for request:', request.id);
  };

  const handleRequestSuccess = () => {
    toast.success('Leave Request Submitted', {
      description:
        "Your leave request has been submitted successfully. You'll receive a notification once it's reviewed by your HR admin.",
    });
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
    </div>
  );
};

export { UserLeaveView };
