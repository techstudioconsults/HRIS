import { Badge } from '@workspace/ui/components/badge';

export const AnnouncementChip = () => {
  return (
    <Badge className="text-foreground p-1 bg-background shadow-md">
      <span className="rounded-full bg-primary px-2 py-1 text-sm font-bold text-white">New</span>
      <span className="pr-1 font-normal text-sm text-zinc-500">Now available across Africa</span>
    </Badge>
  );
};
