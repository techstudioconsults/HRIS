import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { More } from "iconsax-reactjs";
import Image from "next/image";

import type { Folder } from "../../services/types";
import { formatDate } from "../../utils/format";

interface FolderCardProperties {
  folder: Folder;
  onClick: (folderId: string) => void;
  onRename: (folder: Folder) => void;
  onDelete: (folderId: string) => void;
}

export const FolderCard = ({ folder, onClick, onRename, onDelete }: FolderCardProperties) => {
  return (
    <div
      className="group cursor-pointer rounded-lg border bg-white p-4 transition-all hover:shadow-md"
      onClick={() => onClick(folder.id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <Image
            src="/images/resources/folder.svg"
            alt="Folder icon"
            width={40}
            height={40}
            className="mt-1 h-10 w-10 flex-shrink-0 object-contain"
          />
          <div className="min-w-0 flex-1">
            <h6 className="truncate font-medium text-gray-900" title={folder.name}>
              {folder.name}
            </h6>
            <p className="text-muted-foreground mt-1 text-sm">
              {folder.fileCount || 0} files • {formatDate(folder.createdAt)}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(event) => event.stopPropagation()}>
            <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Folder actions menu">
              <More className="h-4 w-4 rotate-90" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48" onClick={(event) => event.stopPropagation()}>
            <DropdownMenuItem onClick={() => onClick(folder.id)}>View Folder</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onRename(folder)}>Rename Folder</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(folder.id)} className="text-red-600">
              Delete Folder
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
