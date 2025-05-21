// src/context/LoadingContext.tsx
"use client";

import React, { createContext, useState } from "react";

interface LoadingContextProperties {
  isOnAboutMe: boolean;
  toggleAboutMe: (status: boolean) => void;
}

export const AppContext = createContext<LoadingContextProperties | undefined>(undefined);

interface LoadingProviderProperties {
  children: React.ReactNode;
}

export const AppProvider: React.FC<LoadingProviderProperties> = ({ children }) => {
  const [isOnAboutMe, setOnAboutMe] = useState(false);

  const toggleAboutMe = (status: boolean) => {
    setOnAboutMe(status);
  };

  return <AppContext.Provider value={{ isOnAboutMe, toggleAboutMe }}>{children}</AppContext.Provider>;
};
