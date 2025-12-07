"use client";

import { Icons } from "@workspace/ui/components/core/miscellaneous/icons";
import React from "react";
import { cn } from "../utils";

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

export const BackButton: React.FC<BackButtonProperties> = ({
  iconClassName,
}) => {
  return (
    <Icons.chevronLeft
      onClick={handleBack}
      className={cn(`cursor-pointer stroke-3`, iconClassName)}
    />
  );
};
