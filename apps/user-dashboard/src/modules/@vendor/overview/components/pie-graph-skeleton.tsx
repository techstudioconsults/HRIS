import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PieGraphSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <Skeleton className="h-[200px] w-[200px] rounded-full" />
      </CardContent>
    </Card>
  );
}
