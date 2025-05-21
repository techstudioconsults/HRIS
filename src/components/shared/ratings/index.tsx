import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export const Ratings = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          // size={14}
          className={cn(index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300", "h-2 w-2 lg:h-4 lg:w-4")}
        />
      ))}
    </div>
  );
};
