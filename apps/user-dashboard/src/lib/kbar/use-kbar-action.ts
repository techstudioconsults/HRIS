/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useKBar } from "kbar";
import { useEffect } from "react";

export function useRegisterActions(actions: any[], dependencies: any[] = []) {
  const { query } = useKBar();

  useEffect(() => {
    if (actions.length > 0) {
      return query.registerActions(actions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, query, ...dependencies]);
}
