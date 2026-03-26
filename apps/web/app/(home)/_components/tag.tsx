import { Badge } from '@workspace/ui/components/badge';

const Tag = ({ content }: { content: string }) => {
  return (
    <Badge className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
      <span className="size-2 rounded-full bg-primary/60" />
      <span className="text-sm font-normal text-primary">{content}</span>
    </Badge>
  );
};

export default Tag;
