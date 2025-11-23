"use client";

import MainButton from "@/components/shared/button";
import { ReusableDialog } from "@/components/shared/dialog/Dialog";
import { useSSE } from "@/context/sse-provider";
import { EventRegistry, type INotificationPayload } from "@/lib/sse/use-notifications";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

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
}

function createId() {
  return Math.random().toString(36).slice(2, 11);
}

// Map incoming SSE event -> UI notification config
function mapEventToNotification(payload: INotificationPayload, inPayrollRoute: boolean): BaseNotification | null {
  const { type: eventType, data } = payload;
  const base: Omit<BaseNotification, "id" | "render"> = {
    event: eventType,
    title: data?.title ? String(data.title) : eventType,
    body: data?.body ? String(data.body) : "",
  };

  switch (eventType) {
    case EventRegistry.WALLET_TOP_SUCCESS: {
      return { id: createId(), render: "toast", severity: "success", ...base };
    }
    case EventRegistry.WALLET_CREATED_SUCCESS: {
      return {
        id: createId(),
        render: "banner",
        severity: "success",
        dismissible: true,
        ...base,
        actions: [
          {
            label: "Fund Wallet",
            variant: "primary",
            onClick: () => window.dispatchEvent(new CustomEvent("wallet:fund")),
          },
        ],
      };
    }
    case EventRegistry.PAYROLL_APPROVE_REQUEST: {
      return {
        id: createId(),
        render: inPayrollRoute ? "modal" : "banner",
        severity: "info",
        dismissible: true,
        ...base,
        actions: [
          {
            label: "View",
            variant: "primary",
            onClick: () => window.dispatchEvent(new CustomEvent("payroll:approval-open")),
          },
        ],
      };
    }
    case EventRegistry.PAYROLL_APPROVED:
    case EventRegistry.PAYROLL_COMPLETED:
    case EventRegistry.SALARY_PAID: {
      return { id: createId(), render: "toast", severity: "success", ...base };
    }
    case EventRegistry.PAYROLL_REJECTED: {
      return { id: createId(), render: "toast", severity: "error", ...base };
    }
    case EventRegistry.PAYROLL_STATUS: {
      return { id: createId(), render: "toast", severity: "info", ...base };
    }
    default: {
      return null;
    }
  }
}

export const AppEventsListener = () => {
  const { on } = useSSE();
  const pathname = usePathname();
  const inPayrollRoute = pathname.startsWith("/admin/payroll");

  const [banners, setBanners] = useState<BaseNotification[]>([]);
  const [modal, setModal] = useState<BaseNotification | null>(null);

  const dismissBanner = useCallback((id: string) => {
    setBanners((previous) => previous.filter((b) => b.id !== id));
  }, []);

  const handleNotification = useCallback(
    (payload: INotificationPayload) => {
      const mapped = mapEventToNotification(payload, inPayrollRoute);
      if (!mapped) return;

      if (mapped.render === "toast") {
        const message = mapped.title && mapped.body ? `${mapped.title} - ${mapped.body}` : mapped.title || mapped.body;
        switch (mapped.severity) {
          case "success": {
            toast.success(message);
            break;
          }
          case "error": {
            toast.error(message);
            break;
          }
          case "warning": {
            // Fallback to generic toast if warning variant absent
            const potential: unknown = (toast as unknown as Record<string, unknown>).warning;
            if (typeof potential === "function") {
              (potential as (message_: string) => void)(message);
            } else {
              toast(message);
            }
            break;
          }
          default: {
            toast(message);
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
    [inPayrollRoute],
  );

  useEffect(() => {
    // Wildcard subscription to capture any future events without explicit mapping at registration
    const offAll = on("*", (payload) => handleNotification(payload));
    return () => offAll();
  }, [on, handleNotification]);

  // Auto-dismiss banners after 25s (optional)
  useEffect(() => {
    if (banners.length === 0) return;
    const timers = banners.map((banner) => {
      if (!banner.dismissible) return null;
      return window.setTimeout(() => dismissBanner(banner.id), 25_000);
    });
    return () => {
      for (const t of timers) if (t) clearTimeout(t);
    };
  }, [banners, dismissBanner]);

  return (
    <>
      {/* <div className="flex w-full items-center justify-between bg-green-500 p-4 px-8">
        <p className="text-background flex max-w-5xl text-sm font-medium">
          <span>
            <Info className="mr-4 stroke-2" size={18} />
          </span>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae alias suscipit accusantium ullam, facere
          laboriosam, non aspernatur iure inventore reiciendis quo fuga sapiente labore odio consequuntur quaerat
          perferendis nisi modi!
        </p>
        <div className="flex items-center gap-4">
          <MainButton variant="default" className="">
            Accept
          </MainButton>
          <MainButton variant="destructiveOutline">Decline</MainButton>
        </div>
      </div> */}
      {/* Banners Stack (top fixed) */}
      <div>
        {banners.map((banner) => {
          const Icon =
            banner.severity === "success"
              ? CheckCircle2
              : banner.severity === "error"
                ? XCircle
                : banner.severity === "warning"
                  ? AlertTriangle
                  : Info;
          return (
            <div
              key={banner.id}
              className={cn(
                "pointer-events-auto flex w-full items-start justify-between rounded-md border p-4 shadow",
                banner.severity === "success" && "border-success-200 bg-success-50",
                banner.severity === "error" && "border-destructive-200 bg-destructive-50",
                banner.severity === "warning" && "border-warning-200 bg-warning-50",
                banner.severity === "info" && "border-blue-200 bg-blue-50",
              )}
            >
              <div className="flex max-w-4xl items-start gap-3">
                <Icon size={18} className="mt-0.5" />
                <div className="space-y-1">
                  {banner.title ? <p className="text-sm font-semibold">{banner.title}</p> : null}
                  <p className="text-muted-foreground text-xs leading-relaxed">{banner.body}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {banner.actions?.map((a) => (
                  <MainButton key={a.label} size="sm" variant={a.variant || "outline"} onClick={() => a.onClick()}>
                    {a.label}
                  </MainButton>
                ))}
                {banner.dismissible && (
                  <button
                    aria-label="Dismiss notification"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => dismissBanner(banner.id)}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
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
