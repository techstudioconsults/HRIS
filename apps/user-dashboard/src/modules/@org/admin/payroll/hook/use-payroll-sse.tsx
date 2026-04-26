/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
// src/hooks/useSSEPayroll.ts
'use client';

import { useEffect, useState } from 'react';

import { EventRegistry } from '../types';
import type { EventNameType } from '../types';

export { EventRegistry, EventNameType };

export const useSSEPayroll = (userId: string) => {
  const [latestEvent, setLatestEvent] = useState<{
    type: EventNameType;
    payload: any;
  } | null>(null);

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

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('[SSE Generic Message]', data);
        setLatestEvent({ type: 'GENERIC' as EventNameType, payload: data });
      } catch {
        setLatestEvent({
          type: 'GENERIC' as EventNameType,
          payload: event.data,
        });
      }
    };

    eventSource.onerror = (error) => {
      console.error('[SSE Error]', error);
      eventSource.close();
    };

    return () => {
      console.log('Closing SSE connection...');
      eventSource.close();
    };
  }, [userId]);

  return latestEvent;
};
