import MainButton from "@/components/shared/button";

interface ErrorStateProperties {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({ message, onRetry }: ErrorStateProperties) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-full bg-red-100 p-3">
        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-red-800">Error loading resources</h3>
      <p className="text-muted-foreground mt-2 text-sm">{message || "An unexpected error occurred"}</p>
      {onRetry && (
        <MainButton className="mt-4" variant="primary" onClick={onRetry}>
          Try Again
        </MainButton>
      )}
    </div>
  );
};
