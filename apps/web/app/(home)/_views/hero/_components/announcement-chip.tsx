import { Badge } from '@workspace/ui/components/badge';

export const AnnouncementChip = () => {
  return (
    <Badge className="text-foreground mx-auto inline-flex max-w-full flex-wrap items-center justify-center gap-1 bg-background p-1 shadow-md sm:flex-nowrap">
      <span className="rounded-full bg-primary px-2 py-1 text-sm font-bold text-white">
        New
      </span>
      <span className="pr-1 text-center text-sm font-normal text-zinc-500 sm:text-left">
        Now available across Africa
      </span>
    </Badge>
  );
};
