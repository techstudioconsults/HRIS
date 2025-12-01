import { Card, CardContent, CardHeader } from "../../card";
import { Skeleton } from "../../skeleton";

export default function FormCardSkeleton() {
  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-10 w-24" />
      </CardContent>
    </Card>
  );
}
