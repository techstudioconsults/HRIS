/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { MainButton } from "@workspace/ui/lib/button";
import { cn } from "@workspace/ui/lib/utils";
import { format } from "date-fns";
import { saveAs } from "file-saver";
import { DocumentDownload } from "iconsax-reactjs";
import { HtmlHTMLAttributes, useTransition } from "react";

interface ExportActionProperties<T> extends HtmlHTMLAttributes<HTMLButtonElement> {
  isDisabled?: boolean;
  downloadMutation?: (parameters: T) => Promise<Blob | File>;
  currentPage?: number;
  dateRange?: { from?: Date; to?: Date };
  status?: string;
  onDownloadComplete?: () => void;
  buttonText?: string;
  additionalParameters?: Omit<T, "page" | "start_date" | "end_date" | "status">;
  fileName?: string;
  size?: "xs" | "lg" | "xl";
}

const ExportAction = <T extends object>({
  isDisabled = false,
  downloadMutation,
  currentPage = 1,
  dateRange,
  status,
  onDownloadComplete,
  buttonText = "Export",
  additionalParameters,
  fileName = "download",
  size = "lg",
  className,
}: ExportActionProperties<T>) => {
  const [isPending, startTransition] = useTransition();

  const handleDownload = async () => {
    startTransition(async () => {
      const parameters: any = {
        page: currentPage,
        ...(dateRange?.from && {
          start_date: format(dateRange.from, "yyyy-MM-dd"),
        }),
        ...(dateRange?.to && { end_date: format(dateRange.to, "yyyy-MM-dd") }),
        ...(status && status !== "all" && { status }),
        ...additionalParameters,
      };

      const file = await downloadMutation?.(parameters);
      const blob = new Blob([file as File], { type: "text/csv" });
      saveAs(blob, `${fileName}.csv`);
      onDownloadComplete?.();
    });
  };

  return (
    <MainButton
      isDisabled={isDisabled}
      variant="primaryOutline"
      className={cn("w-full lg:w-auto", className)}
      size={size as "lg" | "xl"}
      isLeftIconVisible={true}
      icon={<DocumentDownload />}
      onClick={handleDownload}
      isLoading={isPending}
      // isIconOnly={true}
    >
      {buttonText}
    </MainButton>
  );
};

export default ExportAction;
