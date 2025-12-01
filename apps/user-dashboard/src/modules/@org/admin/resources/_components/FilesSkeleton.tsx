import { Skeleton } from "@workspace/ui/components/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";

interface FilesSkeletonProperties {
  count?: number;
}

// Individual file card skeleton
const FileCardSkeleton = () => {
  return <Skeleton className="h-20 w-full" />;
};

// Main skeleton component matching the ResourcesBody structure
export const FilesSkeleton = ({ count = 9 }: FilesSkeletonProperties) => {
  return (
    <div className="space-y-6">
      {/* Tabs skeleton */}
      <Tabs defaultValue="files" className="w-full">
        <TabsList className="bg-transparent">
          <TabsTrigger value="files" disabled>
            <Skeleton className="h-4 w-20" />
          </TabsTrigger>
          <TabsTrigger value="folders" disabled>
            <Skeleton className="h-4 w-24" />
          </TabsTrigger>
        </TabsList>

        {/* Grid of file card skeletons */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }).map((_, index) => (
            <FileCardSkeleton key={index} />
          ))}
        </div>
      </Tabs>
    </div>
  );
};
//
