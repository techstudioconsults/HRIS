"use client";

import { Input } from "@workspace/ui/components/input";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { EmptyState } from "@workspace/ui/lib";
import { cn } from "@workspace/ui/lib/utils";
import { Clock, Loader2, Search, SearchIcon, TrendingUp, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  category?: string;
  icon?: React.ReactNode;
  url?: string;
  metadata?: Record<string, unknown>;
}

interface GlobalSearchInputProperties {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
  onResultSelect?: (result: SearchResult) => void;
  results?: SearchResult[];
  isLoading?: boolean;
  disabled?: boolean;
  recentSearches?: string[];
  onClearRecent?: () => void;
  emptyMessage?: string;
  delay?: number;
}

export function GlobalSearchInput({
  className,
  placeholder = "Search anything...",
  onSearch,
  onResultSelect,
  results = [],
  isLoading = false,
  disabled = false,
  recentSearches = [],
  onClearRecent,
  emptyMessage = "Try searching with different keywords.",
  delay = 300,
}: GlobalSearchInputProperties) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, delay);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputReference = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (debouncedQuery) {
      onSearch?.(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    setSelectedIndex(-1);

    if (value.trim()) {
      setOpen(true);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    onResultSelect?.(result);
    setSearchQuery("");
    setOpen(false);
    inputReference.current?.blur();
  };

  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query);
    inputReference.current?.focus();
    onSearch?.(query);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;

    const totalResults = results.length;

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        setSelectedIndex((previous) => (previous < totalResults - 1 ? previous + 1 : previous));
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        setSelectedIndex((previous) => (previous > 0 ? previous - 1 : -1));
        break;
      }
      case "Enter": {
        event.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      }
      case "Escape": {
        event.preventDefault();
        setOpen(false);
        setSearchQuery("");
        inputReference.current?.blur();
        break;
      }
    }
  };

  const showDropdown = open && (searchQuery.trim() !== "" || recentSearches.length > 0);
  const hasResults = results.length > 0;
  const showRecent = searchQuery.trim() === "" && recentSearches.length > 0;

  return (
    <Popover open={showDropdown} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "bg-background border-border focus-within:ring-ring relative flex h-10 w-full min-w-[500px] items-center gap-2 rounded-md border px-3 transition-colors focus-within:ring-2 focus-within:ring-offset-0",
            disabled && "cursor-not-allowed opacity-50",
            className,
          )}
        >
          <Search className="text-muted-foreground h-4 w-4 shrink-0" />
          <Input
            ref={inputReference}
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setOpen(true)}
            disabled={disabled}
            className="placeholder:text-muted-foreground h-full flex-1 border-none bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
          />
          {isLoading && <Loader2 className="text-muted-foreground h-4 w-4 shrink-0 animate-spin" />}
          {searchQuery && !isLoading && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                inputReference.current?.focus();
              }}
              className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        sideOffset={16}
        align="start"
        className="min-w-[500px] p-0"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <ScrollArea className="max-h-[400px]">
          {showRecent && (
            <div className="p-2">
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="text-muted-foreground text-xs font-medium">Recent Searches</span>
                {onClearRecent && (
                  <button
                    type="button"
                    onClick={onClearRecent}
                    className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-1">
                {recentSearches.map((query, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleRecentSearchClick(query)}
                    className="hover:bg-accent flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-sm transition-colors"
                  >
                    <Clock className="text-muted-foreground h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate">{query}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchQuery.trim() && !isLoading && !hasResults && (
            <EmptyState
              className="text-primary"
              icon={<Search className="text-primary" />}
              title="No results found."
              description={emptyMessage}
            />
          )}

          {searchQuery.trim() && hasResults && (
            <div className="p-2">
              <div className="space-y-1">
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => handleResultClick(result)}
                    className={cn(
                      "hover:bg-accent flex w-full items-start gap-3 rounded-sm px-2 py-2.5 text-left transition-colors",
                      selectedIndex === index && "bg-accent",
                    )}
                  >
                    {result.icon ? (
                      <div className="text-muted-foreground mt-0.5 shrink-0">{result.icon}</div>
                    ) : (
                      <TrendingUp className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                    )}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{result.title}</p>
                        {result.category && (
                          <span className="bg-muted text-muted-foreground rounded-sm px-1.5 py-0.5 text-xs">
                            {result.category}
                          </span>
                        )}
                      </div>
                      {result.description && (
                        <p className="text-muted-foreground line-clamp-2 text-xs">{result.description}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
