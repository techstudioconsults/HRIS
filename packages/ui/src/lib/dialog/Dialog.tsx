"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import Image from "next/image";
import { HTMLAttributes, ReactNode } from "react";
import { cn } from "../utils";

interface ReusableDialogProperties extends HTMLAttributes<HTMLDivElement> {
  trigger: ReactNode;
  title?: string;
  img?: string;
  description?: string;
  children?: ReactNode;
  headerClassName?: string;
  wrapperClassName?: string;
  open?: boolean;
  icon?: ReactNode;
  hideClose?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ReusableDialog({
  trigger,
  hideClose,
  title,
  description,
  children,
  headerClassName,
  wrapperClassName,
  className,
  open,
  img,
  icon,
  onOpenChange,
}: ReusableDialogProperties) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        hideClose={hideClose}
        className={cn("border-default min-w-2xl items-center", className)}
      >
        <DialogHeader className={cn("h-fit", wrapperClassName)}>
          {img &&
            (img.startsWith("http") || img.startsWith("/") ? (
              <Image
                width={100}
                height={100}
                src={img}
                alt="icon"
                className="h-[100px] w-[100px]"
              />
            ) : (
              <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-orange-100 text-6xl">
                {img}
              </div>
            ))}
          <DialogTitle
            className={cn("flex items-center gap-2 text-2xl", headerClassName)}
          >
            <span>{icon}</span>
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
