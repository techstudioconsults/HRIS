/**
 * Format utilities for resources module
 */

/**
 * Get file icon based on file type/extension
 */
export const getFileIcon = (fileType?: string): string => {
  const iconMapping: Record<string, string> = {
    pdf: "/images/resources/pdf-icon.svg",
    doc: "/images/resources/doc-icon.svg",
    docx: "/images/resources/doc-icon.svg",
    xls: "/images/resources/xls-icon.svg",
    xlsx: "/images/resources/xls-icon.svg",
    jpg: "/images/resources/img-icon.svg",
    jpeg: "/images/resources/img-icon.svg",
    png: "/images/resources/img-icon.svg",
    default: "/images/resources/doc-icon.svg",
  };

  if (!fileType) return iconMapping.default;

  const extension = fileType.toLowerCase().split("/").pop() || "";
  return iconMapping[extension] || iconMapping.default;
};

/**
 * Format date to readable string
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return "Invalid date";
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Invalid date";
  }
};

/**
 * Format file size to readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, index)) * 100) / 100} ${sizes[index]}`;
};
