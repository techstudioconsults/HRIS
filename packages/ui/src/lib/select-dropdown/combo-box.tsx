'use client';

import { Button } from '@workspace/ui/components/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';
import { CheckIcon } from 'lucide-react';
import * as React from 'react';
import { cn } from '../utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@workspace/ui/components/command';
import { Icon } from '@workspace/ui/lib/icons/icon';

export interface ComboBoxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboBoxProperties {
  options: ComboBoxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  width?: string;
  triggerClassName?: string;
  contentClassName?: string;
  allowClear?: boolean;
}

export function ComboBox({
  options,
  value = '',
  onValueChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No options found.',
  disabled = false,
  readOnly = false,
  className,
  width = 'w-full',
  triggerClassName,
  contentClassName,
  allowClear = true,
}: ComboBoxProperties) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(value);

  // Update internal value when prop changes
  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const currentValue = onValueChange ? value : internalValue;
  const setCurrentValue = onValueChange || setInternalValue;

  const selectedOption = options.find(
    (option) => option.value === currentValue
  );

  const handleSelect = (selectedValue: string) => {
    const newValue =
      selectedValue === currentValue && allowClear ? '' : selectedValue;
    setCurrentValue(newValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={readOnly ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            `bg-background text-foreground ring-offset-background focus-visible:ring-ring border-border
             hover:bg-background flex h-12 w-full rounded-md border px-3 py-2 text-sm
              shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium 
              placeholder:text-gray-200 focus-visible:ring-2 focus-visible:ring-offset-2
               focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50`,
            width,
            'justify-between',
            readOnly && 'pointer-events-none cursor-default',
            triggerClassName,
            className
          )}
        >
          {/*<span className={cn(!selectedOption && 'text-gray-200')}>*/}
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
          <Icon name={`ChevronsUpDown`} className="ml-2 size-3 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn('p-0 shadow-none', contentClassName)}
        style={{ width: 'var(--radix-popover-trigger-width)' }}
        align="start"
      >
        <Command className="w-full">
          <CommandInput
            placeholder={searchPlaceholder}
            className={`placeholder:text-primary-75`}
          />
          <CommandList className="max-h-[200px]">
            <CommandEmpty className="py-6 text-center text-sm text-primary">
              {emptyMessage}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label} // Use label for search instead of value
                  disabled={option.disabled}
                  onSelect={() => handleSelect(option.value)}
                  className="data-[selected=true]:bg-primary-50 cursor-pointer"
                >
                  <CheckIcon
                    className={cn(
                      'mr-2 h-4 w-4',
                      currentValue === option.value
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
