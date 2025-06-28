"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

interface SearchInputProperties {
  placeholder?: string;
  onSearch: (query: string) => void;
  delay?: number; // debounce delay in ms
  className?: string;
}

export const SearchInput = ({
  placeholder = "Search...",
  onSearch,
  delay = 300,
  className = "",
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
        type="search"
        placeholder={placeholder}
        className="pr-4 pl-10"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />
    </div>
  );
};
