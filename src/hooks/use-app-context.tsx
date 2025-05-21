"use client";

import { AppContext } from "@/context/app-provider";
import { useContext } from "react";

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
