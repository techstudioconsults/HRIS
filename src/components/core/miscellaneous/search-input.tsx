"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useKBar } from "kbar";
import { Search, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

interface SearchInputProperties {
  placeholder?: string;
  onSearch: (query: string) => void;
  delay?: number; // debounce delay in ms
  className?: string;
  isDisabled?: boolean;
}

export const SearchInput = ({
  placeholder = "Search...",
  onSearch,
  delay = 300,
  className = "",
  isDisabled = false,
}: SearchInputProperties) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, delay);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <div className={`relative ${className}`}>
      <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
      <Input
        disabled={isDisabled}
        type="search"
        placeholder={placeholder}
        className="border-border h-full border-none pr-4 pl-10 shadow-none"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />
    </div>
  );
};

// global search

export function GlobalSearchInput({
  className,
  placeholder = "Search...",
}: {
  className?: string;
  placeholder?: string;
}) {
  const { query } = useKBar();

  return (
    <div
      onClick={() => query.toggle()}
      className={cn(
        "bg-background border-border flex h-10 min-w-[350px] cursor-pointer items-center gap-2 rounded-md border p-1 text-sm text-gray-500 transition-colors hover:bg-gray-50 focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      <Search className="h-4" />
      <span className="flex-1 text-left">{placeholder}</span>
      <div className="flex h-full items-center gap-1">
        <kbd className="bg-border flex h-full items-center justify-center rounded px-2 text-xs font-medium">⌘</kbd>
        <kbd className="bg-border flex h-full items-center justify-center rounded px-2 text-xs font-medium">K</kbd>
      </div>
    </div>
  );
}
