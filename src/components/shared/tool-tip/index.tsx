import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";

export const SetToolTip = ({ children, content }: { children: React.ReactNode; content: string }) => {
  return (
    <Tooltip className={`text-[10px] text-white`} side={`bottom`} content={content}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
    </Tooltip>
  );
};
