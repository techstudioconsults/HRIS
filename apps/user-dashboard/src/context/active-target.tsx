"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

export interface ActiveTarget<T = unknown> {
  entity: T | null;
  set: (value: T | null) => void;
}

const ActiveTargetContext = createContext<ActiveTarget<unknown> | null>(null);

export function ActiveTargetProvider({ children }: { children: React.ReactNode }) {
  const [entity, setEntity] = useState<unknown>(null);
  const set = useCallback((value: unknown | null) => setEntity(value), []);

  return <ActiveTargetContext.Provider value={{ entity, set }}>{children}</ActiveTargetContext.Provider>;
}

export function useActiveTarget<T>() {
  const context = useContext(ActiveTargetContext);
  if (!context) throw new Error("useActiveTarget must be used within ActiveTargetProvider");
  return context as ActiveTarget<T>;
}
