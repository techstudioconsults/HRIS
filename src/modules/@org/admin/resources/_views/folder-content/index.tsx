// import Image from "next/image";

// interface FileItem {
//   id: string;
//   name: string;
//   createdAt: string;
//   type: string;
// }

// const getFileIcon = (fileType: string) => {
//   const iconMapping: Record<string, string> = {
//     pdf: "/images/resources/pdf-icon.svg",
//     doc: "/images/resources/doc-icon.svg",
//     xls: "/images/resources/xls-icon.svg",
//     jpg: "/images/resources/img-icon.svg",
//     jpeg: "/images/resources/img-icon.svg",
//     png: "/images/resources/img-icon.svg",
//     default: "/images/resources/folder.svg",
//   };

// export const FolderContent = ({ params }: { params: { id: string } }) => {
//   // In a real app, you would fetch files for this folder from an API
//   const folderFiles: FileItem[] = [
//     { id: params.id, name: "Document in Folder", createdAt: "12/05/2025", type: "pdf" },
//     { id: "2", name: "Image in Folder", createdAt: "12/05/2025", type: "jpeg" },
//   ];

//   return (
//     <>
//       <div className="mt-6 grid grid-cols-1 gap-5 space-y-2 lg:grid-cols-3">
//         {folderFiles.map((file) => (
//           <div key={file.id} className="rounded-md bg-white p-4 transition-colors hover:shadow-sm">
//             {/* Render files in this folder */}
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <Image
//                  src={getFileIcon(file.type)}
//                   alt={`${file.type} icon`}
//                   width="50"
//                   height="50"
//                   className="h-12 w-8"
//                 />
//                 <div>
//                   <h6 className="font-medium">{file.name}</h6>
//                   <p className="text-muted-foreground mt-1 text-sm">Created on {file.createdAt}</p>
//                 </div>
//               </div>
//               {/* ... dropdown menu for file actions ... */}
//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };
