import { cn } from "../lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const badgeVariants = cva(
  "inline-flex items-center min-w-[7rem] justify-center rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        primary: "border-transparent bg-primary/10 text-primary [a&]:hover:bg-primary/90",
        success: "border-transparent bg-success-50 text-success [a&]:hover:bg-success-100",
        warning: "border-transparent bg-warning-50 text-warning [a&]:hover:bg-warning-100",
        danger: "border-transparent bg-danger-50 text-danger [a&]:hover:bg-danger-100",
        info: "border-transparent bg-info-50 text-info [a&]:hover:bg-info-100",
        light: "border-transparent bg-light-50 text-light-foreground [a&]:hover:bg-light-100",
        dark: "border-transparent bg-dark-50 text-dark-foreground [a&]:hover:bg-dark-100",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        primaryOutline: "bg-transparent text-primary border-primary [a&]:hover:bg-primary/10",
        secondaryOutline: "bg-transparent text-secondary border-secondary [a&]:hover:bg-secondary/10",
        successOutline: "bg-transparent text-success border-success [a&]:hover:bg-success-50",
        warningOutline: "bg-transparent text-warning border-warning [a&]:hover:bg-warning-50",
        dangerOutline: "bg-transparent text-danger border-danger [a&]:hover:bg-danger-50",
        infoOutline: "bg-transparent text-info border-info [a&]:hover:bg-info-50",
        lightOutline: "bg-transparent text-light-foreground border-light [a&]:hover:bg-light-50",
        darkOutline: "bg-transparent text-dark-foreground border-dark [a&]:hover:bg-dark-50",
        destructiveOutline:
          "bg-transparent text-destructive border-destructive [a&]:hover:bg-destructive/10 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...properties
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...properties} />;
}

export { Badge, badgeVariants };
