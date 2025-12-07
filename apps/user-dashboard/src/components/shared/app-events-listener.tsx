/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Wrapper } from "@workspace/ui/components/core/layout/wrapper/index";
import { MainButton, ReusableDialog } from "@workspace/ui/lib/index";
import { cn } from "@workspace/ui/lib/utils";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { PiInfoFill } from "react-icons/pi";
import { toast } from "sonner";

import { useSSE } from "../../context/sse-provider";
import { queryKeys } from "../../lib/react-query/query-keys";
import { EventRegistry, INotificationPayload } from "../../lib/sse/use-notifications";
import { usePayrollService } from "../../modules/@org/admin/payroll/services/use-service";

type RenderType = "toast" | "banner" | "modal";

interface BaseNotification {
  id: string;
  event: string;
  title: string;
  body: string;
  render: RenderType;
  severity?: "info" | "success" | "warning" | "error";
  actions?: Array<{
    label: string;
    variant?: "primary" | "outline" | "destructive" | "default";
    onClick: () => void;
  }>;
  dismissible?: boolean;
  payrollId?: string;
}

interface PayrollMetadata {
  payrollId?: string;
  id?: string;
  payroll_id?: string;
}

function createId() {
  return Math.random().toString(36).slice(2, 11);
}

// Map incoming SSE event -> UI notification config
function mapEventToNotification(payload: INotificationPayload, inPayrollRoute: boolean): BaseNotification | null {
  const { type: eventType, data } = payload;
  const meta = data?.metadata as PayrollMetadata | undefined;
  const payrollId: string | undefined = meta?.payrollId ?? meta?.id ?? meta?.payroll_id;

  const base: Omit<BaseNotification, "id" | "render"> = {
    event: eventType,
    title: data?.title ? String(data.title) : eventType,
    body: data?.body ? String(data.body) : "",
    payrollId,
  };

  // Determine render type based on route
  const renderType: RenderType = inPayrollRoute ? "banner" : "toast";

  switch (eventType) {
    case EventRegistry.WALLET_CREATED_SUCCESS: {
      return {
        id: createId(),
        render: renderType,
        severity: "info",
        dismissible: true,
        ...base,
      };
    }
    case EventRegistry.WALLET_TOP_SUCCESS: {
      return {
        id: createId(),
        render: renderType,
        severity: "info",
        dismissible: true,
        actions: [
          {
            label: "View",
            onClick: () => {
              window.location.href = `/admin/payroll`;
            },
          },
        ],
        ...base,
      };
    }
    case EventRegistry.PAYROLL_APPROVE_REQUEST: {
      return {
        id: createId(),
        render: renderType,
        severity: "info",
        dismissible: true,
        actions: [
          {
            label: "Approve Payroll",
            variant: "primary",
            onClick: () => {}, // Will be wired in component
          },
          {
            label: "Decline Payroll",
            variant: "destructive",
            onClick: () => {}, // Will be wired in component
          },
        ],
        ...base,
      };
    }
    case EventRegistry.PAYROLL_APPROVED: {
      return {
        id: createId(),
        render: renderType,
        severity: "info",
        dismissible: true,
        ...base,
      };
    }
    case EventRegistry.PAYROLL_COMPLETED: {
      return {
        id: createId(),
        render: renderType,
        severity: "info",
        dismissible: true,
        ...base,
      };
    }
    case EventRegistry.PAYROLL_REJECTED: {
      return {
        id: createId(),
        render: renderType,
        severity: "error",
        dismissible: true,
        ...base,
      };
    }
    case EventRegistry.SALARY_PAID: {
      return {
        id: createId(),
        render: renderType,
        severity: "info",
        dismissible: true,
        ...base,
      };
    }
    case EventRegistry.PAYROLL_STATUS: {
      return {
        id: createId(),
        render: renderType,
        severity: "info",
        dismissible: true,
        ...base,
      };
    }
    default: {
      return null;
    }
  }
}

export const AppEventsListener = () => {
  const { on } = useSSE();
  const pathname = usePathname();
  const inPayrollRoute = pathname.includes("/admin/payroll");

  const [banners, setBanners] = useState<BaseNotification[]>([]);
  const [modal, setModal] = useState<BaseNotification | null>(null);
  const queryClient = useQueryClient();
  const { useDecidePayrollApproval } = usePayrollService();
  const { mutateAsync: decideApproval, isPending: isDeciding } = useDecidePayrollApproval();

  const dismissBanner = useCallback((id: string) => {
    setBanners((previous) => previous.filter((b) => b.id !== id));
  }, []);

  const handleApprovePayroll = useCallback(
    async (payrollId: string, bannerId: string) => {
      if (!payrollId) {
        toast.error("Unable to approve", { description: "Payroll ID not found" });
        return;
      }
      try {
        await decideApproval({ payrollId, status: "approved" });
        toast.success("Payroll approved successfully");
        dismissBanner(bannerId);
        queryClient.invalidateQueries({ queryKey: queryKeys.payroll.approvals(payrollId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.payroll.details(payrollId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.payroll.list({}) });
      } catch (error: any) {
        const message = error?.response?.data?.message ?? "Failed to approve payroll";
        toast.error("Approval failed", { description: message });
      }
    },
    [decideApproval, dismissBanner, queryClient],
  );

  const handleDeclinePayroll = useCallback(
    async (payrollId: string, bannerId: string) => {
      if (!payrollId) {
        toast.error("Unable to decline", { description: "Payroll ID not found" });
        return;
      }
      try {
        await decideApproval({ payrollId, status: "declined" });
        toast.success("Payroll declined");
        dismissBanner(bannerId);
        queryClient.invalidateQueries({ queryKey: queryKeys.payroll.approvals(payrollId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.payroll.details(payrollId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.payroll.list({}) });
      } catch (error: any) {
        const message = error?.response?.data?.message ?? "Failed to decline payroll";
        toast.error("Decline failed", { description: message });
      }
    },
    [decideApproval, dismissBanner, queryClient],
  );

  const handleNotification = useCallback(
    (payload: INotificationPayload) => {
      const mapped = mapEventToNotification(payload, inPayrollRoute);
      if (!mapped) return;

      const meta = payload?.data?.metadata as PayrollMetadata | undefined;
      const payrollId: string | undefined = meta?.payrollId ?? meta?.id ?? meta?.payroll_id;

      // Helper to invalidate a set of payroll-related queries
      const invalidatePayrollQueries = (withApprovals: boolean) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.payroll.list({}) });
        if (payrollId) {
          queryClient.invalidateQueries({ queryKey: queryKeys.payroll.details(payrollId) });
          if (withApprovals) {
            queryClient.invalidateQueries({ queryKey: queryKeys.payroll.approvals(payrollId) });
          }
          // Invalidate payslips for this payroll (any filter variant)
          queryClient.invalidateQueries({
            predicate: (q) =>
              Array.isArray(q.queryKey) &&
              q.queryKey[0] === "payrolls" &&
              q.queryKey[1] === "payslips" &&
              q.queryKey[2] === payrollId,
          });
        }
      };

      // Wallet events -> refresh wallet + perhaps payroll list (balances may affect UI state)
      if (payload.type === EventRegistry.WALLET_TOP_SUCCESS || payload.type === EventRegistry.WALLET_CREATED_SUCCESS) {
        queryClient.invalidateQueries({ queryKey: queryKeys.payroll.wallet() });
        queryClient.invalidateQueries({ queryKey: queryKeys.payroll.list({}) });
      }

      // Approval lifecycle events
      if (payload.type === EventRegistry.PAYROLL_APPROVE_REQUEST) {
        invalidatePayrollQueries(true);
      }
      if (
        payload.type === EventRegistry.PAYROLL_APPROVED ||
        payload.type === EventRegistry.PAYROLL_REJECTED ||
        payload.type === EventRegistry.PAYROLL_COMPLETED ||
        payload.type === EventRegistry.PAYROLL_STATUS
      ) {
        invalidatePayrollQueries(true);
      }

      // Salary paid -> payroll details & wallet update
      if (payload.type === EventRegistry.SALARY_PAID) {
        queryClient.invalidateQueries({ queryKey: queryKeys.payroll.wallet() });
        invalidatePayrollQueries(false);
      }

      if (mapped.render === "toast") {
        const message = mapped.title && mapped.body ? `${mapped.title} - ${mapped.body}` : mapped.title || mapped.body;
        switch (mapped.severity) {
          case "info": {
            toast.info("Notification", {
              description: message,
              action: mapped.actions?.[0],
              actionButtonStyle: {
                backgroundColor: "var(--primary)",
              },
            });
            break;
          }
          case "success": {
            toast.success("Notification", { description: message });
            break;
          }
          case "error": {
            toast.error("Notification", { description: message });
            break;
          }
          case "warning": {
            // Fallback to generic toast if warning variant absent
            const potential: unknown = (toast as unknown as Record<string, unknown>).warning;
            if (typeof potential === "function") {
              (potential as (message_: string) => void)(message);
            } else {
              toast("Notification", { description: message });
            }
            break;
          }
          default: {
            toast("Notification", { description: message });
          }
        }
        return;
      }

      if (mapped.render === "modal") {
        setModal(mapped);
        return;
      }

      if (mapped.render === "banner") {
        setBanners((previous) => {
          const exists = previous.some((b) => b.event === mapped.event && b.body === mapped.body);
          if (exists) return previous;
          return [mapped, ...previous];
        });
      }
    },
    [queryClient, inPayrollRoute],
  );

  useEffect(() => {
    // Wildcard subscription to capture any future events without explicit mapping at registration
    const offAll = on("*", (payload: any) => handleNotification(payload));
    return () => offAll();
  }, [on, handleNotification]);

  // Auto-dismiss banners after 25s (optional)
  // useEffect(() => {
  //   if (banners.length === 0) return;
  //   const timers = banners.map((banner) => {
  //     if (!banner.dismissible) return null;
  //     return window.setTimeout(() => dismissBanner(banner.id), 25_000);
  //   });
  //   return () => {
  //     for (const t of timers) if (t) clearTimeout(t);
  //   };
  // }, [banners, dismissBanner]);

  return (
    <>
      {/* Banners Stack */}
      <div className="space-y-4">
        {banners.map((banner) => {
          const Icon =
            banner.severity === "success"
              ? CheckCircle2
              : banner.severity === "error"
                ? XCircle
                : banner.severity === "warning"
                  ? AlertTriangle
                  : PiInfoFill;
          return (
            <Wrapper
              key={banner.id}
              className={cn(
                "bg-background border-primary-75 animate-entrance pointer-events-auto mx-auto mt-10 flex w-full items-center justify-between border-y p-2",
                banner.severity === "success" && "border-success/20",
                banner.severity === "error" && "border-destructive/20",
                banner.severity === "warning" && "border-warning/20",
                banner.severity === "info" && "text-primary bg-primary-50",
              )}
            >
              <div className="flex items-start gap-3">
                <Icon
                  size={18}
                  className={cn(
                    "mt-0.5",
                    banner.severity === "success" && "text-success",
                    banner.severity === "error" && "text-destructive",
                    banner.severity === "warning" && "text-warning",
                    banner.severity === "info" && "text-primary",
                  )}
                />
                <div className="space-y-1">
                  {/* {banner.title ? <p className="text-sm font-medium">{banner.title}</p> : null} */}
                  <p className="text-primary text-sm font-medium">{banner.body}</p>
                </div>
              </div>
              <div className="flex items-center gap-10">
                {banner.actions?.map((a) => {
                  const isApprove = a.label === "Approve Payroll";
                  const isDecline = a.label === "Decline Payroll";
                  const handleClick = () => {
                    if (isApprove && banner.payrollId) {
                      handleApprovePayroll(banner.payrollId, banner.id);
                    } else if (isDecline && banner.payrollId) {
                      handleDeclinePayroll(banner.payrollId, banner.id);
                    } else {
                      a.onClick();
                    }
                  };
                  return (
                    <MainButton
                      key={a.label}
                      className="px-8"
                      size="sm"
                      variant={a.variant || "primary"}
                      onClick={handleClick}
                      isDisabled={isDeciding}
                    >
                      {a.label}
                    </MainButton>
                  );
                })}
                {banner.dismissible && (
                  <MainButton
                    aria-label="Dismiss notification"
                    icon={<XCircle />}
                    isIconOnly
                    size="icon"
                    variant="ghost"
                    className="p-0"
                    onClick={() => dismissBanner(banner.id)}
                  />
                )}
              </div>
            </Wrapper>
          );
        })}
      </div>

      {/* Modal Notification */}
      <ReusableDialog
        open={!!modal}
        onOpenChange={(open) => {
          if (!open) setModal(null);
        }}
        title={modal?.title || "Notification"}
        description={modal?.body || ""}
        trigger={<div />}
        className="min-w-md"
      >
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            {modal?.actions?.map((a) => (
              <MainButton
                key={a.label}
                variant={a.variant || "primary"}
                onClick={() => {
                  a.onClick();
                  setModal(null);
                }}
              >
                {a.label}
              </MainButton>
            ))}
            <MainButton variant="outline" onClick={() => setModal(null)}>
              Close
            </MainButton>
          </div>
        </div>
      </ReusableDialog>
    </>
  );
};
