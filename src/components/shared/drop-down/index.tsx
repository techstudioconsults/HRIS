import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface GenericDropdownProperties {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
  contentClassName?: string;
}

export function GenericDropdown({
  trigger,
  children,
  align = "start",
  className,
  contentClassName = "w-56",
}: GenericDropdownProperties) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn(`bg-background`, contentClassName)} align={align}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
