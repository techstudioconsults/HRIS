import { EmptyState } from "@workspace/ui/lib";

import empty1 from "~/images/empty-state.svg";
import type { Folder } from "../../services/types";
import { FolderCard } from "../ui/FolderCard";

interface FoldersTabProperties {
  folders: Folder[];
  searchQuery: string;
}

export const FoldersTab = ({ folders, searchQuery }: FoldersTabProperties) => {
  if (folders.length === 0) {
    return (
      <EmptyState
        className="bg-background"
        images={[{ src: empty1.src, alt: "No folders", width: 100, height: 100 }]}
        title="No Folder found"
        description={searchQuery ? "Try adjusting your search" : "Create your first folder to organize your files"}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {folders.map((folder) => (
        <FolderCard key={folder.id} folder={folder} />
      ))}
    </div>
  );
};
