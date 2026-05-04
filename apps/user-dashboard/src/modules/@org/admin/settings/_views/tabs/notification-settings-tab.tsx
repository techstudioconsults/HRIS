'use client';

import { Checkbox } from '@workspace/ui/components/checkbox';
import { Switch } from '@workspace/ui/components/switch';
import { cn } from '@workspace/ui/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useSession } from '@/lib/session';
import { useUserProfileService } from '@/modules/@org/user/profile';
import type { NotificationCategoryKey } from '../../types';

function ChannelToggle({
  label,
  description,
  checked,
  onToggle,
  disabled,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onToggle: (value: boolean) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-base font-medium">{label}</p>
        {description && (
          <p className="text-muted-foreground text-xs">{description}</p>
        )}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onToggle}
        disabled={disabled}
      />
    </div>
  );
}

function CategoryCheckbox({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <Checkbox
        className={cn(
          `border-primary/30`,
          `data-[state=checked]:border-primary
          data-[state=checked]:bg-primary/10
          data-[state=checked]:text-primary`,
          `data-[state=checked]:dark:border-muted-foreground
          data-[state=checked]:dark:bg-primary
          data-[state=checked]:dark:text-white`
        )}
        checked={checked}
        onCheckedChange={(value) => onToggle(Boolean(value))}
      />
      <span className="text-muted-foreground">{label}</span>
    </label>
  );
}

const DEFAULT_CATEGORIES: Record<NotificationCategoryKey, boolean> = {
  newEmployeeAdded: true,
  employeeTermination: true,
  newRoleCreated: true,
  newTeamCreated: true,
  resourceUploaded: true,
  probationReviewDue: false,
  salaryDisbursement: false,
  walletTopUp: true,
  paydayReminder: true,
  loginFromNewDevice: true,
  passwordChange: true,
  rolePermissionChanges: false,
};

export const NotificationSettingsTab = () => {
  const { data: session } = useSession();
  const employeeId = session?.user?.id ?? '';

  const { useGetMyProfile, useUpdateMyProfile } = useUserProfileService();
  const { data: profile, isLoading } = useGetMyProfile(employeeId);
  const { mutate: updateProfile, isPending: isSaving } = useUpdateMyProfile();

  const [emailEnabled, setEmailEnabled] = useState(true);
  const [inAppEnabled, setInAppEnabled] = useState(false);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  // Hydrate channel state from server profile
  useEffect(() => {
    if (!profile?.notifications) return;
    setEmailEnabled(profile.notifications.email);
    setInAppEnabled(profile.notifications.inApp);
  }, [profile]);

  const handleChannelToggle = (field: 'email' | 'inApp', value: boolean) => {
    const previous = field === 'email' ? emailEnabled : inAppEnabled;

    // Optimistic update
    if (field === 'email') setEmailEnabled(value);
    else setInAppEnabled(value);

    const formData = new FormData();
    formData.append(
      'notifications[email]',
      String(field === 'email' ? value : emailEnabled)
    );
    formData.append(
      'notifications[inApp]',
      String(field === 'inApp' ? value : inAppEnabled)
    );

    updateProfile(
      { employeeId, data: formData },
      {
        onError: () => {
          // Revert on failure
          if (field === 'email') setEmailEnabled(previous);
          else setInAppEnabled(previous);
          toast.error(
            'Failed to update notification preference. Please try again.'
          );
        },
      }
    );
  };

  const handleCategoryToggle = (
    key: NotificationCategoryKey,
    value: boolean
  ) => {
    setCategories((previous) => ({ ...previous, [key]: value }));
  };

  const groupedCategories = useMemo(
    () => [
      {
        title: 'HR & Employee Management',
        items: [
          { key: 'newEmployeeAdded' as const, label: 'New employee added' },
          {
            key: 'employeeTermination' as const,
            label: 'Employee termination/resignation',
          },
          { key: 'newRoleCreated' as const, label: 'New role created' },
          { key: 'newTeamCreated' as const, label: 'New team created' },
          { key: 'resourceUploaded' as const, label: 'Resource uploaded' },
          { key: 'probationReviewDue' as const, label: 'Probation review due' },
        ],
      },
      {
        title: 'Payroll & Finance',
        items: [
          { key: 'salaryDisbursement' as const, label: 'Salary disbursement' },
          { key: 'walletTopUp' as const, label: 'Wallet top up' },
          { key: 'paydayReminder' as const, label: 'Payday reminder' },
        ],
      },
      {
        title: 'System & Security',
        items: [
          {
            key: 'loginFromNewDevice' as const,
            label: 'Login from new device',
          },
          { key: 'passwordChange' as const, label: 'Password Change' },
          {
            key: 'rolePermissionChanges' as const,
            label: 'Role/Permission Changes',
          },
        ],
      },
    ],
    []
  );

  const isDisabled = isLoading || isSaving;

  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">Notification Settings</h3>
      </div>

      <div className="rounded-lg p-4 sm:p-8 shadow bg-background">
        <div className="grid gap-10 lg:grid-cols-[560px_1fr]">
          {/* Left descriptors */}
          <div className="space-y-10">
            <div className="space-y-1">
              <h4 className="text-lg font-semibold">Notification Channels</h4>
              <p className="text-muted-foreground text-xs">
                Choose your preferred way of receiving notifications
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-semibold">Notification Categories</h4>
              <p className="text-muted-foreground text-xs">
                Toggle on/off for specific events
              </p>
            </div>
          </div>

          {/* Right controls */}
          <div className="space-y-10">
            <div className="space-y-4">
              <ChannelToggle
                label="Email Notifications"
                checked={emailEnabled}
                onToggle={(value) => handleChannelToggle('email', value)}
                disabled
              />
              <ChannelToggle
                label="In-app Notifications"
                checked={inAppEnabled}
                onToggle={(value) => handleChannelToggle('inApp', value)}
                disabled
              />
            </div>

            <div className="space-y-8">
              {groupedCategories.map((group) => (
                <div key={group.title} className="space-y-3">
                  <p className="text-lg font-semibold">{group.title}</p>
                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <CategoryCheckbox
                        key={item.key}
                        label={item.label}
                        checked={categories[item.key]}
                        onToggle={(value) =>
                          handleCategoryToggle(item.key, value)
                        }
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
