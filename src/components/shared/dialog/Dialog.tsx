"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { HTMLAttributes, ReactNode } from "react";

interface ReusableDialogProperties extends HTMLAttributes<HTMLDivElement> {
  trigger?: ReactNode;
  title?: string;
  img?: string;
  description?: string;
  children?: ReactNode;
  headerClassName?: string;
  wrapperClassName?: string;
  open?: boolean;
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
  onOpenChange,
}: ReusableDialogProperties) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <div className={cn("fixed inset-0 z-50", open ? "bg-black/50 backdrop-blur-sm" : "pointer-events-none")}>
        <DialogContent
          hideClose={hideClose}
          className={cn("border-default h-full max-w-xl items-center md:h-fit", className)}
        >
          {/* {wrapperClassName ?? */}
          {/* (img && ( */}
          <DialogHeader className={cn("h-fit", wrapperClassName)}>
            {img && <Image width={100} height={100} src={img || ""} alt="dangerous" className="h-[100px] w-[100px]" />}
            <DialogTitle className={cn("text-lg", headerClassName)}>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {/* )) */}
          {/* } */}
          {children}
        </DialogContent>
      </div>
    </Dialog>
  );
}
