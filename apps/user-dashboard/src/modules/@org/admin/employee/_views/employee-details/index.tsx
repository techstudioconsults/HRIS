'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@workspace/ui/components/alert-dialog';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar';
import { Card } from '@workspace/ui/components/card';
import { DropdownMenuItem } from '@workspace/ui/components/dropdown-menu';
import { Input } from '@workspace/ui/components/input';
import { BreadCrumb } from '@workspace/ui/lib/breadcrumb';
import { DashboardHeader } from '@workspace/ui/lib/dashboard';
import { ErrorEmptyState } from '@workspace/ui/lib/empty-state';
import { GenericDropdown } from '@workspace/ui/lib/drop-down';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import Image from 'next/image';

import { useEmployeeService } from '../../services/use-service';
import { EmployeeDetailsSkeleton } from './loader';
import { routes } from '@/lib/routes/routes';
import {
  formatAccountNumber,
  formatCurrency,
  formatDate,
  formatPhoneNumber,
} from '@/lib/formatters';
import { formatInitials } from '@workspace/ui/lib/utils';
import { GradientMask } from '@workspace/ui/lib/gradient-mask';
import { AnyIconName } from '@workspace/ui/lib/icons/types';
import { Button } from '@workspace/ui/components/button';
import React, { ReactNode, useRef, useState } from 'react';
import { toast } from 'sonner';

const getStatusClassName = (status?: string) => {
  switch ((status ?? '').toLowerCase()) {
    case 'active':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
    case 'inactive':
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    case 'suspended':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const DetailsItem = ({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | number | boolean | null;
  icon?: React.ReactNode;
}) => (
  <div className="flex items-start gap-3">
    {icon && <span className="text-muted-foreground shrink-0">{icon}</span>}
    <div className="min-w-0 flex-1">
      <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
        {label}
      </p>
      <p className="text-foreground capitalize truncate text-sm font-medium">
        {value || 'N/A'}
      </p>
    </div>
  </div>
);

const DetailsFieldset = ({
  legend,
  children,
  className = '',
  icon,
}: {
  legend: string;
  children: ReactNode;
  className?: string;
  icon?: AnyIconName;
}) => (
  <fieldset className={`space-y-4 ${className}`}>
    <legend className="text-base mb-10 flex text-muted-foreground items-center gap-2 font-semibold">
      {icon ? (
        <span
          className={`size-8 flex items-center justify-center bg-primary-50 rounded-md`}
        >
          <Icon name={icon} className="text-primary" />
        </span>
      ) : null}
      {legend}
    </legend>
    <div className="space-y-3">{children}</div>
  </fieldset>
);

const getDocumentFileName = (url: string): string => {
  try {
    const pathname = new URL(url).pathname;
    const segments = pathname.split('/').filter(Boolean);
    return segments[segments.length - 1] || 'document';
  } catch {
    const segments = url.split('/').filter(Boolean);
    return segments[segments.length - 1] || 'document';
  }
};

const getDocumentExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
};

const isPreviewableImage = (ext: string): boolean => {
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext);
};

const isPDF = (ext: string): boolean => ext === 'pdf';

const DocumentPreview = ({ url }: { url: string }) => {
  const filename = getDocumentFileName(url);
  const ext = getDocumentExtension(filename);

  if (isPreviewableImage(ext)) {
    return (
      <div className="space-y-4">
        <div className="border-border relative overflow-hidden rounded-lg border bg-muted/30">
          <Image
            src={url}
            alt={filename}
            width={800}
            height={600}
            className="max-h-96 w-full object-contain"
            unoptimized
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium truncate">{filename}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" asChild>
              <a href={url} target="_blank" rel="noopener noreferrer">
                <Icon name="Eye" className="mr-1.5 size-4" />
                View
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href={url} download={filename}>
                <Icon name="Download" className="mr-1.5 size-4" />
                Download
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border-border flex flex-col items-center gap-4 rounded-lg border bg-muted/30 p-6 text-center sm:flex-row sm:text-left">
        <div className="bg-background flex size-14 shrink-0 items-center justify-center rounded-lg border shadow-sm">
          {isPDF(ext) ? (
            <Image
              src="/images/pdf-icon.svg"
              width={28}
              height={36}
              alt="PDF"
            />
          ) : (
            <Icon
              name="DocumentText"
              className="text-muted-foreground size-7"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{filename}</p>
          <p className="text-muted-foreground mt-0.5 text-xs uppercase">
            {ext || 'FILE'}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button size="sm" variant="outline" asChild>
            <a href={url} target="_blank" rel="noopener noreferrer">
              <Icon name="Eye" className="mr-1.5 size-4" />
              View
            </a>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a href={url} download={filename}>
              <Icon name="Download" className="mr-1.5 size-4" />
              Download
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

const AccountNumberField = ({ accountNumber }: { accountNumber?: string }) => {
  const [visible, setVisible] = useState(false);

  if (!accountNumber) {
    return (
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
            Account Number
          </p>
          <p className="text-foreground truncate text-sm font-medium">N/A</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
          Account Number
        </p>
        <div className="flex items-center gap-2">
          <p className="text-foreground truncate text-sm font-medium tabular-nums">
            {visible
              ? formatAccountNumber(accountNumber, accountNumber.length)
              : formatAccountNumber(accountNumber)}
          </p>
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
            aria-label={visible ? 'Hide account number' : 'Show account number'}
          >
            <Icon name={visible ? 'EyeSlash' : 'Eye'} className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const EmployeeDetailsHeader = ({
  employeeId,
  employeeName,
  isSuspended,
  isTerminated,
  onSuspend,
  onUnsuspend,
  onTerminate,
  onUndoTerminate,
}: {
  employeeId?: string;
  employeeName?: string;
  isSuspended: boolean;
  isTerminated: boolean;
  onSuspend?: () => void;
  onUnsuspend?: () => void;
  onTerminate?: () => void;
  onUndoTerminate?: () => void;
}) => (
  <DashboardHeader
    title="Employee Details"
    subtitle={
      <BreadCrumb
        items={[
          { label: 'Employees', href: routes.admin.employees.list() },
          {
            label: employeeName || 'Employee Profile',
            href: employeeId
              ? routes.admin.employees.detail(employeeId)
              : routes.admin.employees.list(),
          },
        ]}
        showHome={true}
      />
    }
    actionComponent={
      <div className="flex gap-2 justify-between items-center sm:gap-3">
        <div>
          <MainButton
            isLeftIconVisible
            icon={<Icon name="Edit" variant={`Bold`} />}
            href={
              employeeId
                ? routes.admin.employees.edit(employeeId)
                : routes.admin.employees.add()
            }
            variant="primary"
            className="w-full sm:w-auto"
          >
            Edit Employee
          </MainButton>
        </div>
        <GenericDropdown
          align="end"
          trigger={
            <Button
              size={`icon`}
              variant={`primaryOutline`}
              className={`size-10.5`}
            >
              <Icon
                name="More"
                size={20}
                variant={`Outline`}
                className={`text-primary rotate-90`}
              />
            </Button>
          }
        >
          <DropdownMenuItem disabled>Download Profile PDF</DropdownMenuItem>
          <DropdownMenuItem disabled>Reset Password</DropdownMenuItem>
          <DropdownMenuItem
            onSelect={isSuspended ? onUnsuspend : onSuspend}
            disabled={isTerminated}
          >
            {isSuspended ? 'Unsuspend Employee' : 'Suspend Employee'}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={isTerminated ? onUndoTerminate : onTerminate}
            className="text-destructive focus:text-destructive"
          >
            {isTerminated ? 'Undo Termination' : 'Terminate Employee'}
          </DropdownMenuItem>
        </GenericDropdown>
      </div>
    }
  />
);

const AVATAR_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const AVATAR_MAX_BYTES = 5 * 1024 * 1024;

const EmployeeAvatarUpload = ({
  employeeId,
  avatarUrl,
  firstName,
  lastName,
}: {
  employeeId: string;
  avatarUrl: string;
  firstName?: string;
  lastName?: string;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingObjectUrlRef = useRef<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { useUpdateEmployee } = useEmployeeService();
  const { mutate: updateEmployee, isPending: isUploading } =
    useUpdateEmployee();

  // Revoke any pending blob URL when the server-confirmed avatar arrives or on unmount
  React.useEffect(() => {
    if (previewUrl && avatarUrl && !avatarUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      pendingObjectUrlRef.current = null;
    }
  }, [avatarUrl, previewUrl]);

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

    updateEmployee(
      { id: employeeId, data: formData },
      {
        onSuccess: () => {
          toast.success('Avatar updated successfully');
          // previewUrl cleared via useEffect when refetched avatarUrl arrives
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
      aria-label="Upload employee avatar"
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
      <Avatar className="border-primary/20 bg-muted size-32 border shadow-lg group-hover:brightness-90 transition-[filter]">
        <AvatarImage src={previewUrl || avatarUrl || ''} />
        <AvatarFallback className="bg-primary-50 text-2xl font-bold text-primary-75">
          {formatInitials(`${firstName ?? ''} ${lastName ?? ''}`) || 'NA'}
        </AvatarFallback>
      </Avatar>
      <span className="absolute bottom-1 right-1 flex size-8 items-center justify-center rounded-full border-2 border-background bg-primary shadow-sm">
        {isUploading ? (
          <Icon
            name="Loader2"
            className="text-primary-foreground animate-spin"
            size={16}
          />
        ) : (
          <Icon name="Pencil" className="text-primary-foreground" size={14} />
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
};

const EmployeeDetailsContent = ({
  employeeId,
  employeeData,
}: {
  employeeId: string;
  employeeData: Employee;
}) => {
  const fullName =
    `${employeeData?.firstName ?? ''} ${employeeData?.lastName ?? ''}`.trim();
  const employeeStatus = employeeData?.status || 'Unknown';

  return (
    <section className="space-y-6 py-5">
      {/* Sticky Sidebar + Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Employee Profile Card - Sticky on Desktop */}
        <Card
          className="border-border space-y-6 bg-linear-to-b from-background to-muted/20 p-6
        shadow-sm lg:col-span-4 lg:sticky lg:top-20 lg:h-fit md:p-8"
        >
          <div className="flex flex-col items-center text-center">
            <EmployeeAvatarUpload
              employeeId={employeeId}
              avatarUrl={employeeData?.avatar || ''}
              firstName={employeeData?.firstName}
              lastName={employeeData?.lastName}
            />

            <h2 className="mt-6 text-2xl font-bold">{fullName || 'N/A'}</h2>
            <p className="text-muted-foreground mt-2 text-base">
              {employeeData?.employmentDetails?.role?.name ||
                'No role assigned'}
            </p>
            <span
              className={`mt-4 inline-flex items-center rounded-full px-4 py-1 text-xs font-bold ${getStatusClassName(employeeStatus)}`}
            >
              {employeeStatus.toUpperCase()}
            </span>
          </div>

          <div className={`relative`}>
            <hr className=" bg-primary/50" />
            <GradientMask className={`absolute`} direction={`left`} />
            <GradientMask className={`absolute`} direction={`right`} />
          </div>

          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-foreground">
              Quick Contact
            </legend>
            <DetailsItem
              icon={<Icon className={`text-primary`} name="Sms" />}
              label="Email"
              value={employeeData?.email}
            />
            <DetailsItem
              icon={<Icon className={`text-primary`} name="Call" />}
              label="Phone"
              value={formatPhoneNumber(employeeData?.phoneNumber ?? '')}
            />
          </fieldset>

          <div className={`relative`}>
            <hr className=" bg-primary/50" />
            <GradientMask className={`absolute`} direction={`left`} />
            <GradientMask className={`absolute`} direction={`right`} />
          </div>

          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-foreground">
              Employment Summary
            </legend>
            <DetailsItem
              label="Department"
              value={employeeData?.employmentDetails?.team?.name}
            />
            <DetailsItem
              label="Work Mode"
              value={employeeData?.employmentDetails?.workMode || 'N/A'}
            />
            <DetailsItem
              label="Employment Type"
              value={employeeData?.employmentDetails?.employmentType || 'N/A'}
            />
          </fieldset>
        </Card>

        {/* Main Content - Scrollable */}
        <div className="space-y-6 lg:col-span-8">
          {/* Personal Information */}
          <Card className="border-border p-6 shadow-sm md:p-8">
            <DetailsFieldset icon={`Profile`} legend="Personal Information">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <DetailsItem label="Full Name" value={fullName} />
                <DetailsItem
                  label="Date of Birth"
                  value={
                    employeeData?.dateOfBirth
                      ? formatDate(employeeData.dateOfBirth)
                      : 'N/A'
                  }
                />
                <DetailsItem label="Gender" value={employeeData?.gender} />
                <DetailsItem label="Work Email" value={employeeData?.email} />
                <DetailsItem
                  label="Phone Number"
                  value={formatPhoneNumber(employeeData?.phoneNumber ?? '')}
                />
              </div>
            </DetailsFieldset>
          </Card>

          {/* Employment Details */}
          <Card className="border-border p-6 shadow-sm md:p-8">
            <DetailsFieldset icon={`Buildings`} legend="Employment Details">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <DetailsItem
                  label="Start Date"
                  value={
                    formatDate(employeeData.employmentDetails.startDate) ||
                    'N/A'
                  }
                />
                <DetailsItem
                  label="Employment Type"
                  value={
                    employeeData?.employmentDetails.employmentType || 'N/A'
                  }
                />
                <DetailsItem
                  label="Work Mode"
                  value={employeeData?.employmentDetails.workMode || 'N/A'}
                />
                <DetailsItem
                  label="Department"
                  value={employeeData?.employmentDetails.team?.name || 'N/A'}
                />
                <DetailsItem
                  label="Role"
                  value={employeeData?.employmentDetails.role?.name || 'N/A'}
                />
              </div>
            </DetailsFieldset>
          </Card>

          {/* Salary and Payroll */}
          <Card className="border-border p-6 shadow-sm md:p-8">
            <DetailsFieldset
              icon={`WalletMoney`}
              legend="Salary and Payroll Details"
            >
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <DetailsItem
                  label="Monthly Salary"
                  value={
                    employeeData?.payProfile.baseSalary != null
                      ? formatCurrency(employeeData.payProfile.baseSalary)
                      : '-'
                  }
                />
                <DetailsItem
                  label="Bank Name"
                  value={employeeData?.payProfile.bankName}
                />
                <AccountNumberField
                  accountNumber={employeeData?.payProfile.accountNumber}
                />
                <DetailsItem
                  label="Account Name"
                  value={employeeData?.payProfile.accountName}
                />
              </div>
            </DetailsFieldset>
          </Card>

          {/* Employee Documents */}
          <Card className="border-border p-6 shadow-sm md:p-8">
            <DetailsFieldset icon="DocumentText" legend="Employee Documents">
              {employeeData?.document ? (
                <DocumentPreview url={employeeData.document} />
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                  <div className="bg-muted flex size-16 items-center justify-center rounded-full">
                    <Icon
                      name="DocumentText"
                      className="text-muted-foreground size-8"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      No documents uploaded
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Upload employment letters, contracts, or other documents
                    </p>
                  </div>
                </div>
              )}
            </DetailsFieldset>
          </Card>
        </div>
      </div>
    </section>
  );
};

export const EmployeeDetails = ({ params }: { params: { id: string } }) => {
  const { useGetEmployeeById, useUpdateEmployee } = useEmployeeService();
  const {
    data: employeeData,
    isLoading: isLoadingEmployee,
    isError: isErrorEmployee,
    refetch,
  } = useGetEmployeeById(params.id);

  const { mutate: updateEmployee, isPending: isUpdating } = useUpdateEmployee();

  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [isUnsuspendDialogOpen, setIsUnsuspendDialogOpen] = useState(false);
  const [isTerminateDialogOpen, setIsTerminateDialogOpen] = useState(false);
  const [isUndoTerminateDialogOpen, setIsUndoTerminateDialogOpen] =
    useState(false);
  const [terminateInputValue, setTerminateInputValue] = useState('');

  const handleSuspendConfirm = () => {
    if (!employeeData) return;
    const formData = new FormData();
    formData.append('status', 'inactive');
    updateEmployee(
      { id: employeeData.id, data: formData },
      {
        onSuccess: () => {
          setIsSuspendDialogOpen(false);
          toast.success(`${employeeData.firstName} has been suspended.`);
        },
        onError: () => {
          toast.error('Failed to suspend employee. Please try again.');
        },
      }
    );
  };

  const handleUnsuspendConfirm = () => {
    if (!employeeData) return;
    const formData = new FormData();
    formData.append('status', 'active');
    updateEmployee(
      { id: employeeData.id, data: formData },
      {
        onSuccess: () => {
          setIsUnsuspendDialogOpen(false);
          toast.success(`${employeeData.firstName} has been reinstated.`);
        },
        onError: () => {
          toast.error('Failed to reinstate employee. Please try again.');
        },
      }
    );
  };

  const handleTerminateConfirm = () => {
    if (!employeeData) return;
    const formData = new FormData();
    formData.append('status', 'terminated');
    updateEmployee(
      { id: employeeData.id, data: formData },
      {
        onSuccess: () => {
          setIsTerminateDialogOpen(false);
          setTerminateInputValue('');
          toast.success(`${employeeData.firstName} has been terminated.`);
        },
        onError: () => {
          toast.error('Failed to terminate employee. Please try again.');
        },
      }
    );
  };

  const handleUndoTerminateConfirm = () => {
    if (!employeeData) return;
    const formData = new FormData();
    formData.append('status', 'active');
    updateEmployee(
      { id: employeeData.id, data: formData },
      {
        onSuccess: () => {
          setIsUndoTerminateDialogOpen(false);
          toast.success(`${employeeData.firstName} has been reinstated.`);
        },
        onError: () => {
          toast.error('Failed to reinstate employee. Please try again.');
        },
      }
    );
  };

  if (isLoadingEmployee) {
    return <EmployeeDetailsSkeleton />;
  }

  if (isErrorEmployee) {
    return <ErrorEmptyState onRetry={refetch} />;
  }

  if (!employeeData) return null;

  const employeeName =
    `${employeeData.firstName} ${employeeData.lastName}`.trim();
  const isSuspended = employeeData.status === 'inactive';
  const isTerminated = employeeData.status === 'terminated';

  return (
    <section className="space-y-6">
      <EmployeeDetailsHeader
        employeeId={employeeData.id}
        employeeName={employeeName}
        isSuspended={isSuspended}
        isTerminated={isTerminated}
        onSuspend={() => setIsSuspendDialogOpen(true)}
        onUnsuspend={() => setIsUnsuspendDialogOpen(true)}
        onTerminate={() => setIsTerminateDialogOpen(true)}
        onUndoTerminate={() => setIsUndoTerminateDialogOpen(true)}
      />
      <EmployeeDetailsContent
        employeeId={employeeData.id}
        employeeData={employeeData}
      />

      {/* Suspend */}
      <AlertDialog
        open={isSuspendDialogOpen}
        onOpenChange={setIsSuspendDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend <strong>{employeeName}</strong>?
              Their account will be deactivated until reinstated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSuspendConfirm}
              disabled={isUpdating}
            >
              {isUpdating ? 'Suspending…' : 'Suspend'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unsuspend */}
      <AlertDialog
        open={isUnsuspendDialogOpen}
        onOpenChange={setIsUnsuspendDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reinstate Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reinstate <strong>{employeeName}</strong>
              ? Their account will be reactivated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnsuspendConfirm}
              disabled={isUpdating}
            >
              {isUpdating ? 'Reinstating…' : 'Reinstate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Terminate — two-step confirmation */}
      <AlertDialog
        open={isTerminateDialogOpen}
        onOpenChange={(open) => {
          if (!open) setTerminateInputValue('');
          setIsTerminateDialogOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Terminate Employee
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <p>
                  You are about to permanently terminate{' '}
                  <strong>{employeeName}</strong>. This action is{' '}
                  <strong>irreversible</strong> — their employment record will
                  be closed and access revoked immediately.
                </p>
                <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  This is an irreversible process. Terminated employees cannot
                  be reactivated through this system.
                </div>
                <div className="space-y-2">
                  <p className="text-foreground text-sm font-medium">
                    Type the employee ID to confirm:
                  </p>
                  <code className="block rounded bg-muted px-3 py-1.5 text-xs font-mono text-muted-foreground select-all">
                    {employeeData.id}
                  </code>
                  <Input
                    placeholder="Paste or type the employee ID"
                    value={terminateInputValue}
                    onChange={(event) =>
                      setTerminateInputValue(event.target.value)
                    }
                    disabled={isUpdating}
                    autoComplete="off"
                  />
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleTerminateConfirm}
              disabled={isUpdating || terminateInputValue !== employeeData.id}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
            >
              {isUpdating ? 'Terminating…' : 'Terminate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Undo Termination */}
      <AlertDialog
        open={isUndoTerminateDialogOpen}
        onOpenChange={setIsUndoTerminateDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Undo Termination</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reinstate <strong>{employeeName}</strong>
              ? Their account will be reactivated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUndoTerminateConfirm}
              disabled={isUpdating}
            >
              {isUpdating ? 'Reinstating…' : 'Reinstate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};
