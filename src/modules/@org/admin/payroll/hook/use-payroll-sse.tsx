/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
// src/hooks/useSSEPayroll.ts
"use client";

import { useEffect, useState } from "react";

export const EventRegistry = {
  PAYROLL_APPROVE_REQUEST: "payroll.approve.request",
  PAYROLL_APPROVED: "payroll.approve.success",
  PAYROLL_REJECTED: "payroll.approve.rejected",
  PAYROLL_COMPLETED: "payroll.completed",
  PAYROLL_STATUS: "payroll.status",
  SALARY_PAID: "salary.paid",
  WALLET_CREATED_SUCCESS: "wallet.created.success",
} as const;

export type EventNameType = (typeof EventRegistry)[keyof typeof EventRegistry];

export const useSSEPayroll = (userId: string) => {
  const [latestEvent, setLatestEvent] = useState<{ type: EventNameType; payload: any } | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Add token as query parameter since EventSource doesn't support custom headers
    const url = `https://hrdev.techstudioacademy.com/api/v1/notifications/users/${userId}`;

    const eventSource = new EventSource(url, {
      withCredentials: true,
    });
    console.log(eventSource);

    for (const eventName of Object.values(EventRegistry)) {
      eventSource.addEventListener(eventName, (event) => {
        try {
          const data = JSON.parse((event as MessageEvent).data);
          console.log(`[SSE Event Received]: ${eventName}`, data);

          setLatestEvent({ type: eventName as EventNameType, payload: data });
        } catch (error) {
          console.error(`Error parsing SSE data for ${eventName}:`, error);
        }
      });
    }

    // eslint-disable-next-line unicorn/prefer-add-event-listener
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("[SSE Generic Message]", data);
        setLatestEvent({ type: "GENERIC" as EventNameType, payload: data });
      } catch {
        setLatestEvent({ type: "GENERIC" as EventNameType, payload: event.data });
      }
    };

    // eslint-disable-next-line unicorn/prefer-add-event-listener
    eventSource.onerror = (error) => {
      console.error("[SSE Error]", error);
      eventSource.close();
    };

    return () => {
      console.log("Closing SSE connection...");
      eventSource.close();
    };
  }, [userId]);

  return latestEvent;
};
