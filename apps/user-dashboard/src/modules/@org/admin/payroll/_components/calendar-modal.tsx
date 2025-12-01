"use client";

import { Calendar } from "@workspace/ui/components/calendar";
import { MainButton } from "@workspace/ui/lib/button";
import { format, startOfToday } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

import { ReusableDialog } from "../../../../../../../../packages/ui/src/lib/dialog/Dialog";

interface CalendarModalProperties {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
  onDateSelect?: (date: Date | undefined) => void;
  onContinue?: (date: Date | undefined) => void;
  /** Indicates if the schedule action is currently submitting */
  isSubmitting?: boolean;
}

export const CalendarModal = ({
  open,
  onOpenChange,
  selectedDate,
  onDateSelect,
  onContinue,
  isSubmitting,
}: CalendarModalProperties) => {
  const [date, setDate] = useState<Date | undefined>(selectedDate);

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    onDateSelect?.(newDate);
  };

  const handleContinue = () => {
    onContinue?.(date);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <ReusableDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Change Scheduled Date"
      className="min-w-sm"
      trigger={<div />} // Hidden trigger since we control open state
    >
      <div className="space-y-6">
        {/* Date Input Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Scheduled Date</label>
          <div className="relative">
            <input
              type="text"
              value={date ? format(date, "dd/MM/yyyy") : ""}
              placeholder="Select a date"
              readOnly
              className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
            <CalendarIcon className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Calendar */}
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            disabled={(d) => d < startOfToday()}
            className="w-full rounded-md border"
            classNames={{
              months: "flex flex-col",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "flex items-center gap-1",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse",
              head_row: "flex w-full",
              head_cell: "text-muted-foreground rounded-md font-normal text-[0.8rem] flex-1 text-center",
              row: "flex w-full mt-2",
              cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected])]:rounded-md flex-1",
              day: "h-8 w-full p-0 font-normal aria-selected:opacity-100 flex items-center justify-center",
              day_selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "day-outside text-muted-foreground aria-selected:text-muted-foreground",
              day_disabled: "text-muted-foreground opacity-50",
              day_hidden: "invisible",
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <MainButton
            variant="outline"
            onClick={handleCancel}
            className="text-destructive border-destructive flex-1"
            isDisabled={isSubmitting}
          >
            Cancel
          </MainButton>
          <MainButton
            variant="primary"
            onClick={handleContinue}
            className="flex-1"
            isLoading={isSubmitting}
            isDisabled={!date || isSubmitting}
          >
            Continue
          </MainButton>
        </div>
      </div>
    </ReusableDialog>
  );
};
