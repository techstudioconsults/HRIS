'use client';

import React, { useRef, useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar';
import { Card } from '@workspace/ui/components/card';
import { DashboardHeader } from '@workspace/ui/lib/dashboard/dashboard-header';
import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { toast } from 'sonner';
import { useSession } from '@/lib/session';
import { useUserProfileService } from '@/modules/@org/user/profile';
import { formatDate } from '@/lib/formatters';

const AVATAR_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const AVATAR_MAX_BYTES = 5 * 1024 * 1024;

function ProfileField({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm font-medium">{value ?? '—'}</span>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Skeleton className="size-20 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-36" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileAvatarUpload({
  employeeId,
  avatarUrl,
  initials,
}: {
  employeeId: string;
  avatarUrl: string;
  initials: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingObjectUrlRef = useRef<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { useUpdateMyProfile } = useUserProfileService();
  const { mutate: updateProfile, isPending: isUploading } =
    useUpdateMyProfile();

  // Revoke blob URL once server-confirmed avatar arrives
  React.useEffect(() => {
    if (previewUrl && avatarUrl && !avatarUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      pendingObjectUrlRef.current = null;
    }
  }, [avatarUrl, previewUrl]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (pendingObjectUrlRef.current) {
        URL.revokeObjectURL(pendingObjectUrlRef.current);
      }
    };
  }, []);

  const triggerPicker = () => {
    if (!isUploading) fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!AVATAR_ALLOWED_TYPES.includes(file.type)) {
      toast.error('Only JPEG, PNG, and WebP images are allowed.');
      event.target.value = '';
      return;
    }
    if (file.size > AVATAR_MAX_BYTES) {
      toast.error('Image must be smaller than 5 MB.');
      event.target.value = '';
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    pendingObjectUrlRef.current = objectUrl;
    setPreviewUrl(objectUrl);

    const formData = new FormData();
    formData.append('avatar', file);

    updateProfile(
      { employeeId, data: formData },
      {
        onSuccess: () => {
          toast.success('Avatar updated successfully');
        },
        onError: () => {
          if (pendingObjectUrlRef.current) {
            URL.revokeObjectURL(pendingObjectUrlRef.current);
            pendingObjectUrlRef.current = null;
          }
          setPreviewUrl(null);
          toast.error('Failed to update avatar. Please try again.');
        },
      }
    );

    event.target.value = '';
  };

  return (
    <div
      role="button"
      tabIndex={isUploading ? -1 : 0}
      aria-label="Upload profile avatar"
      aria-disabled={isUploading}
      className="relative group cursor-pointer"
      onClick={triggerPicker}
      onKeyDown={(event) => {
        if (!isUploading && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          fileInputRef.current?.click();
        }
      }}
    >
      <Avatar className="border-primary/20 bg-muted size-20 border shadow group-hover:brightness-90 transition-[filter]">
        <AvatarImage src={previewUrl || avatarUrl || ''} alt="Profile avatar" />
        <AvatarFallback className="bg-primary-50 text-xl font-bold text-primary-75">
          {initials}
        </AvatarFallback>
      </Avatar>
      <span className="absolute bottom-0 right-0 flex size-6 items-center justify-center rounded-full border-2 border-background bg-primary shadow-sm">
        {isUploading ? (
          <Icon
            name="Loader2"
            className="text-primary-foreground animate-spin"
            size={12}
          />
        ) : (
          <Icon name="Pencil" className="text-primary-foreground" size={11} />
        )}
      </span>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </div>
  );
}

export function UserProfileView() {
  const { data: session } = useSession();
  const employeeId = session?.user?.id ?? '';

  const { useGetMyProfile } = useUserProfileService();
  const { data: profile, isLoading, isError } = useGetMyProfile(employeeId);

  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : null;

  const initials = profile
    ? `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
    : '';

  return (
    <Wrapper className="my-0! max-w-200 p-0">
      <DashboardHeader title="My Profile" />

      <Card className="p-6">
        {isLoading && <ProfileSkeleton />}

        {isError && !isLoading && (
          <p className="text-destructive text-sm">
            Failed to load profile. Please refresh the page.
          </p>
        )}

        {profile && (
          <div className="flex flex-col gap-8">
            {/* Avatar + name block */}
            <div className="flex items-center gap-4">
              <ProfileAvatarUpload
                employeeId={employeeId}
                avatarUrl={profile.avatar ?? ''}
                initials={initials}
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-lg font-semibold">{fullName}</span>
                <span className="text-muted-foreground text-sm">
                  {profile.email}
                </span>
                <span className="text-muted-foreground text-xs capitalize">
                  {profile.employmentDetails?.role?.name ?? '—'}
                </span>
              </div>
            </div>

            {/* Personal details */}
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold">Personal Information</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ProfileField label="Phone" value={profile.phoneNumber} />
                <ProfileField label="Gender" value={profile.gender} />
                <ProfileField
                  label="Date of Birth"
                  value={
                    profile.dateOfBirth ? formatDate(profile.dateOfBirth) : null
                  }
                />
                <ProfileField label="Status" value={profile.status} />
              </div>
            </section>

            {/* Employment details */}
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold">Employment Details</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ProfileField
                  label="Team"
                  value={profile.employmentDetails?.team?.name}
                />
                <ProfileField
                  label="Role"
                  value={profile.employmentDetails?.role?.name}
                />
                <ProfileField
                  label="Employment Type"
                  value={profile.employmentDetails?.employmentType}
                />
                <ProfileField
                  label="Work Mode"
                  value={profile.employmentDetails?.workMode}
                />
                <ProfileField
                  label="Start Date"
                  value={
                    profile.employmentDetails?.startDate
                      ? formatDate(profile.employmentDetails.startDate)
                      : null
                  }
                />
              </div>
            </section>
          </div>
        )}
      </Card>
    </Wrapper>
  );
}
