import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { More } from "iconsax-reactjs";
import Image from "next/image";

import type { FolderFile } from "../../services/types";
import { downloadFile, formatDate, formatFileSize, getFileIcon } from "../../utils/format";

interface FileCardProperties {
  file: FolderFile;
  onDelete: (file: FolderFile) => void;
}

export const FileCard = ({ file, onDelete }: FileCardProperties) => {
  return (
    <div className="group rounded-lg border bg-white p-4 transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <Image
            src={getFileIcon(file.type)}
            alt={`${file.type} icon`}
            width={40}
            height={40}
            className="mt-1 h-10 w-10 flex-shrink-0 object-contain"
          />
          <div className="min-w-0 flex-1">
            <h6 className="truncate font-medium text-gray-900" title={file.name}>
              {file.name}
            </h6>
            <p className="text-muted-foreground mt-1 text-sm">
              {formatFileSize(file.size)} • {formatDate(file.createdAt)}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0" aria-label="File actions menu">
              <More className="h-4 w-4 rotate-90" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => downloadFile(file.url)}>Download File</DropdownMenuItem>
            <DropdownMenuItem onClick={() => file.url && window.open(file.url, "_blank")}>View File</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(file)} className="text-red-600">
              Delete File
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
