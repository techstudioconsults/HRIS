export const LoadingState = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-b-2"></div>
        <p className="text-muted-foreground mt-4">Loading resources...</p>
      </div>
    </div>
  );
};
