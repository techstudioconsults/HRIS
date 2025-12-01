import empty1 from "~/images/empty-state.svg";
import type { FolderFile } from "../../services/types";
import { FileCard } from "../ui/FileCard";
import { EmptyState } from "@workspace/ui/lib";

interface FilesTabProperties {
  files: FolderFile[];
  searchQuery: string;
}

export const FilesTab = ({ files, searchQuery }: FilesTabProperties) => {
  if (files.length === 0) {
    return (
      <EmptyState
        className="bg-background"
        images={[{ src: empty1.src, alt: "No files", width: 100, height: 100 }]}
        title="No files found"
        description={searchQuery ? "Try adjusting your search" : "Upload files to folders to see them here"}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {files.map((file) => (
        <FileCard key={file.id} file={file} />
      ))}
    </div>
  );
};
