"use client";

import { Icons } from "@/components/core/miscellaneous/icons";
import { cn } from "@/lib/utils";
import React from "react";

interface BackButtonProperties {
  href?: string;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "lg" | "icon" | "default" | "link" | "xl" | "circle" | string;
  variant?: "ghost" | "outline" | "primary" | "secondary";
  iconClassName?: string;
  ariaLabel?: string;
}

const handleBack = () => {
  history.back();
};

export const BackButton: React.FC<BackButtonProperties> = ({ iconClassName }) => {
  return <Icons.arrowLeft onClick={handleBack} className={cn(`cursor-pointer stroke-3`, iconClassName)} />;
};
