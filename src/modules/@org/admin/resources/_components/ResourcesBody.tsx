"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { More } from "iconsax-reactjs";
import Image from "next/image";
import { useRouter } from "next/navigation";

// import Link from "next/link";

interface FileItem {
  id: string;
  name: string;
  createdAt: string;
  type: string;
}

interface FolderItem {
  id: string;
  name: string;
  createdAt: string;
}

interface ResourcesViewProperties {
  defaultView?: "files" | "folders";
}

// File icon mapping utility
const getFileIcon = (fileType: string) => {
  const iconMapping: Record<string, string> = {
    pdf: "/images/resources/pdf-icon.svg",
    doc: "/images/resources/doc-icon.svg",
    xls: "/images/resources/xls-icon.svg",
    jpg: "/images/resources/img-icon.svg",
    jpeg: "/images/resources/img-icon.svg",
    png: "/images/resources/img-icon.svg",
    default: "/images/resources/folder.svg",
  };

  return iconMapping[fileType.toLowerCase()] || iconMapping.default;
};

// Dummy data for files
export const files: FileItem[] = [
  { id: "1", name: "Match Payroll Report", createdAt: "12/05/2025", type: "pdf" },
  { id: "2", name: "Employee_Handbook_2025", createdAt: "12/05/2025", type: "pdf" },
  { id: "3", name: "Internship Process", createdAt: "10/05/2025", type: "doc" },
  { id: "4", name: "Company Policies", createdAt: "05/05/2025", type: "doc" },
  { id: "5", name: "Course Curriculum", createdAt: "05/05/2025", type: "jpeg" },
];

// Dummy data for folders
export const folders: FolderItem[] = [
  { id: "1", name: "Useful Files", createdAt: "12/05/2025" },
  { id: "2", name: "HR Documents", createdAt: "10/05/2025" },
  { id: "3", name: "Training Materials", createdAt: "05/05/2025" },
  { id: "4", name: "Useful Files", createdAt: "12/05/2025" },
  { id: "5", name: "HR Documents", createdAt: "10/05/2025" },
  { id: "6", name: "Training Materials", createdAt: "05/05/2025" },
];

export const ResourcesBody = ({ defaultView = "files" }: ResourcesViewProperties) => {
  const router = useRouter();
  const handleFolderClick = (folderId: string) => {
    router.push(`/resources/folders/${folderId}`);
    // or for Next.js 13+: router.push(`/resources/${folderId}`);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue={defaultView} className="w-full">
        <TabsList className="bg-transparent">
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="folders">Folders</TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="mt-6">
          <div className="grid grid-cols-1 gap-5 space-y-2 lg:grid-cols-3">
            {files.map((file) => (
              <div key={file.id} className="rounded-md bg-white p-4 transition-colors hover:shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src={getFileIcon(file.type)}
                      alt={`${file.type} icon`}
                      width="50"
                      height="50"
                      className="h-12 w-8"
                    />
                    <div>
                      <h6 className="font-medium">{file.name}</h6>
                      <p className="text-muted-foreground mt-1 text-sm">Created on {file.createdAt}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="h-8 w-8 p-0" aria-label="Open actions menu">
                        <More className="rotate-90 cursor-pointer" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white shadow-lg">
                      <DropdownMenuItem>View File</DropdownMenuItem>
                      <DropdownMenuItem>Download File</DropdownMenuItem>
                      <DropdownMenuItem>Add to Folder</DropdownMenuItem>
                      <DropdownMenuItem>Delete File</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="folders" className="mt-6">
          <div className="grid grid-cols-1 gap-5 space-y-2 lg:grid-cols-3">
            {folders.map((folder) => (
              <div key={folder.id} className="rounded-md bg-white p-4 transition-colors hover:shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/images/resources/folder.svg"
                      alt="Folder icon"
                      width="50"
                      height="50"
                      className="h-14 w-10"
                    />
                    <div>
                      <h6 className="font-medium">{folder.name}</h6>
                      <p className="text-muted-foreground mt-1 text-sm">Created on {folder.createdAt}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="h-8 w-8 p-0" aria-label="Open actions menu">
                        <More onClick={() => handleFolderClick(folder.id)} className="rotate-90 cursor-pointer" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white shadow-lg">
                      {/* <DropdownMenuItem>View Folder</DropdownMenuItem> */}
                      <DropdownMenuItem onClick={() => handleFolderClick(folder.id)}>View Folder</DropdownMenuItem>
                      <DropdownMenuItem>Download Folder</DropdownMenuItem>
                      <DropdownMenuItem>Upload New Folder</DropdownMenuItem>
                      <DropdownMenuItem>Delete Folder</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
