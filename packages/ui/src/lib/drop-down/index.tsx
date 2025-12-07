import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { cn } from "../utils";

interface GenericDropdownProperties {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
  contentClassName?: string;
  isDisabled?: boolean;
}

export function GenericDropdown({
  trigger,
  children,
  align = "start",
  className,
  isDisabled = false,
  contentClassName = "w-56",
}: GenericDropdownProperties) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={isDisabled} asChild className={className}>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn(`bg-background shadow-none`, contentClassName)}
        align={align}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
