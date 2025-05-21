// /* eslint-disable unicorn/prefer-spread */
// /* eslint-disable @typescript-eslint/no-explicit-any */

// "use client";

// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import fileIcon from "@/icons/Property_2_Selected-file_ybygib.svg";
// import uploadIcon from "@/icons/Property_2_Uploaded-file_sxo5a6.svg";
// import { cn } from "@/lib/utils";
// import Image from "next/image";
// import { Controller, useFieldArray, useFormContext } from "react-hook-form";

// import "react-quill/dist/quill.snow.css";

// import { CameraIcon, Eye, EyeOff, InfoIcon, PlusIcon } from "lucide-react";
// import dynamic from "next/dynamic";
// import { useEffect, useRef, useState } from "react";
// import { MdCancel } from "react-icons/md";

// import { BlurImage } from "../core/miscellaneous/blur-image";
// import { Badge } from "../ui/badge";
// import { Card } from "../ui/card";
// import { Checkbox } from "../ui/checkbox";
// import { Switch } from "../ui/switch";
// import CustomButton from "./common-button/common-button";
// import { StarRating } from "./rating/star";

// const ReactQuill = dynamic(() => import("react-quill"), {
//   ssr: false,
// });

// interface FormFieldProperties {
//   label?: string;
//   labelDetailedNode?: React.ReactNode;
//   name: string;
//   type?: "text" | "textarea" | "select" | "number" | "password" | "email";
//   placeholder?: string;
//   required?: boolean;
//   disabled?: boolean;
//   options?: { value: string; label: string }[];
//   className?: string;
//   containerClassName?: string;
//   leftAddon?: React.ReactNode; // Add left icon or button
//   rightAddon?: React.ReactNode; // Add right icon or button
//   onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
// }

// export function FormField({
//   label,
//   name,
//   type = "text",
//   placeholder,
//   required = false,
//   disabled = false,
//   options = [],
//   className = "",
//   containerClassName,
//   leftAddon,
//   rightAddon,
//   labelDetailedNode,
//   onChange,
// }: FormFieldProperties) {
//   const {
//     control,
//     formState: { errors },
//   } = useFormContext();
//   const error = errors[name];
//   const [showPassword, setShowPassword] = useState(false);

//   const togglePasswordVisibility = () => {
//     setShowPassword((previous) => !previous);
//   };

//   return (
//     <div className="space-y-2">
//       {label && (
//         <div>
//           <Label className="text-[16px] font-medium">
//             {label}
//             {required && <span className="text-destructive ml-1">*</span>}
//           </Label>
//           {labelDetailedNode && <div className="text-mid-grey-II text-xs">{labelDetailedNode}</div>}
//         </div>
//       )}

//       <Controller
//         name={name}
//         control={control}
//         render={({ field }) => {
//           const inputClassName = cn(
//             "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
//             error && "border-destructive",
//             className,
//           );

//           const inputWithAddons = (
//             <div className={cn(`flex items-center gap-2`, containerClassName)}>
//               {leftAddon && <div className="flex items-center">{leftAddon}</div>}
//               {type === "textarea" ? (
//                 <Textarea
//                   {...field}
//                   placeholder={placeholder}
//                   disabled={disabled}
//                   className={cn(inputClassName, "resize-y")}
//                 />
//               ) : type === "select" ? (
//                 <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
//                   <SelectTrigger className={cn(inputClassName, "w-full")}>
//                     <SelectValue placeholder={placeholder} />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {options.map((option, index) => (
//                       <SelectItem key={index} value={option.value}>
//                         {option.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               ) : type === "number" ? (
//                 <input
//                   {...field}
//                   type="number"
//                   placeholder={placeholder}
//                   disabled={disabled}
//                   className={inputClassName}
//                   value={field.value || ""}
//                   onChange={(event) => field.onChange(event.target.valueAsNumber)}
//                 />
//               ) : type === "password" ? (
//                 <div className="relative w-full">
//                   <Input
//                     {...field}
//                     type={showPassword ? "text" : "password"}
//                     placeholder={placeholder}
//                     disabled={disabled}
//                     className={inputClassName}
//                     onChange={(event) => {
//                       field.onChange(event);
//                       onChange?.(event);
//                     }}
//                   />
//                   <button
//                     type="button"
//                     onClick={togglePasswordVisibility}
//                     className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
//                   >
//                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </button>
//                 </div>
//               ) : (
//                 <Input
//                   {...field}
//                   type={type}
//                   placeholder={placeholder}
//                   disabled={disabled}
//                   className={inputClassName}
//                 />
//               )}
//               {rightAddon && <div className="flex items-center">{rightAddon}</div>}
//             </div>
//           );

//           return inputWithAddons;
//         }}
//       />

//       {error && <p className="text-destructive text-sm">{error.message?.toString()}</p>}
//     </div>
//   );
// }

// export function RadioCardGroup({
//   label,
//   name,
//   options,
//   required = false,
//   disabled = false,
//   className = "",
// }: RadioCardGroupProperties) {
//   const {
//     control,
//     formState: { errors },
//   } = useFormContext();
//   const error = errors[name];

//   return (
//     <div className="space-y-4">
//       {label && (
//         <Label className="font-semibold">
//           {label}
//           {required && <span className="text-destructive ml-1">*</span>}
//         </Label>
//       )}

//       <div className="flex flex-col gap-4 sm:flex-row">
//         <Controller
//           name={name}
//           control={control}
//           render={({ field }) => (
//             <>
//               {options.map((option) => (
//                 <label
//                   key={option.value}
//                   className={cn(
//                     "flex w-full cursor-pointer items-start rounded-lg border p-4 transition-colors",
//                     field.value === option.value
//                       ? "bg-low-purple border-none shadow-[2px_2px_0px_0.5px_#6D5DD3]"
//                       : "border-low-grey-III hover:border-primary/50",
//                     disabled && "cursor-not-allowed opacity-50",
//                     className,
//                   )}
//                 >
//                   <input
//                     type="radio"
//                     {...field}
//                     value={option.value}
//                     checked={field.value === option.value}
//                     disabled={disabled}
//                     className="sr-only" // Hide the default radio input
//                   />
//                   <div className="flex flex-col space-y-1">
//                     {option.icon && <Image src={option.icon} alt={`ico`} width={52} height={52} />}
//                     <span className="text-sm font-bold">{option.label}</span>
//                     {option.description && <span className="text-mid-grey-II text-xs">{option.description}</span>}
//                   </div>
//                 </label>
//               ))}
//             </>
//           )}
//         />
//       </div>

//       {error && <p className="text-destructive text-sm">{error.message?.toString()}</p>}
//     </div>
//   );
// }

// export function RichTextEditor({
//   label = "Description",
//   name,
//   placeholder = "Enter description of your product",
//   required = false,
//   disabled = false,
//   className = "",
// }: RichTextEditorProperties) {
//   const {
//     control,
//     formState: { errors },
//   } = useFormContext();
//   const error = errors[name];

//   // Define toolbar options for the rich text editor
//   const modules = {
//     toolbar: [
//       [{ header: [1, 2, 3, false] }],
//       ["bold", "italic", "underline", "strike"],
//       [{ list: "ordered" }, { list: "bullet" }],
//       ["link", "image"],
//       ["clean"],
//     ],
//   };

//   return (
//     <div className="space-y-2">
//       {label && (
//         <Label className="text-[16px] font-medium">
//           {label}
//           {required && <span className="text-destructive ml-1">*</span>}
//         </Label>
//       )}

//       <Controller
//         name={name}
//         control={control}
//         render={({ field }) => (
//           <ReactQuill
//             {...field}
//             theme="snow" // Use the "snow" theme for a clean UI
//             modules={modules} // Add toolbar options
//             placeholder={placeholder}
//             readOnly={disabled}
//             className={cn(error && "border-destructive", className)}
//           />
//         )}
//       />

//       {error && <p className="text-destructive text-sm">{error.message?.toString()}</p>}
//     </div>
//   );
// }

// export function Highlights({
//   name,
//   label,
//   placeholder = "Enter information",
//   description = "Write key description of your product",
//   addButtonText = "Add more highlight",
//   maxFields = 10,
//   className = "",
// }: HighlightsProperties) {
//   const {
//     control,
//     formState: { errors },
//   } = useFormContext();
//   const error = errors[name];
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name,
//   });

//   return (
//     <div className={`max-w-[552px] space-y-4 ${className}`}>
//       <Label className="text-[16px] font-medium">
//         {label}
//         <div className="text-mid-grey-II flex items-center gap-1">
//           <InfoIcon className="h-4 w-4" />
//           <span className="text-xs font-semibold">{description}</span>
//         </div>
//       </Label>

//       {fields.map((field, index) => (
//         <div key={field.id} className="flex items-center space-x-2">
//           <Controller
//             name={`${name}.${index}`}
//             control={control}
//             render={({ field: { value, onChange } }) => (
//               <Input
//                 value={value}
//                 onChange={onChange}
//                 placeholder={placeholder}
//                 className="bg-low-grey-III h-12 flex-1"
//               />
//             )}
//           />
//           <CustomButton
//             className={`dark:bg-white`}
//             isIconOnly
//             icon={<MdCancel className="h-4 w-4" />}
//             variant="ghost"
//             type="button"
//             size="icon"
//             onClick={() => remove(index)}
//           />
//         </div>
//       ))}

//       {fields.length < maxFields && (
//         <CustomButton
//           isLeftIconVisible
//           size="xl"
//           icon={<PlusIcon className="mr-2 h-4 w-4" />}
//           type="button"
//           variant="outline"
//           onClick={(event) => {
//             event.preventDefault();
//             append("");
//           }}
//           className="border-primary text-primary w-full"
//         >
//           {addButtonText}
//         </CustomButton>
//       )}

//       {error && <p className="text-destructive text-sm">{error.message?.toString()}</p>}
//     </div>
//   );
// }

// export function ImageUpload({
//   label = "Cover photo",
//   name,
//   required = false,
//   disabled = false,
//   className = "",
//   maxFiles = 4,
//   acceptedFormats = "image/jpeg, image/png",
//   maxFileSize = 2 * 1024 * 1024, // Default to 2MB
//   initialValue = [], // Add this prop for initial values
// }: ImageUploadProperties & { initialValue?: (string | File)[] }) {
//   const {
//     control,
//     formState: { errors },
//   } = useFormContext();
//   const error = errors[name];
//   const fileInputReference = useRef<HTMLInputElement>(null);
//   const [previews, setPreviews] = useState<string[]>([]);

//   // Handle initial values
//   useEffect(() => {
//     if (initialValue && initialValue.length > 0) {
//       const initialPreviews = initialValue.map((item) => {
//         if (typeof item === "string") {
//           return item; // If it's a URL, use it directly
//         } else if (item instanceof File) {
//           return URL.createObjectURL(item); // If it's a File, create a preview URL
//         }
//         return ""; // Fallback for invalid values
//       });
//       setPreviews(initialPreviews);
//     }
//   }, [initialValue]);

//   const handleButtonClick = (event: React.MouseEvent) => {
//     event.preventDefault();
//     fileInputReference.current?.click();
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: any) => {
//     const files = event.target.files;
//     if (files && files.length > 0) {
//       // Convert FileList to an array and slice to respect maxFiles
//       const newFiles = Array.from(files).slice(0, maxFiles - (field.value?.length || 0));
//       // Validate file size and type
//       const validFiles = newFiles.filter((file) => {
//         if (file.size > maxFileSize) {
//           alert(`File "${file.name}" exceeds the maximum size of ${maxFileSize / 1024 / 1024}MB.`);
//           return false;
//         }
//         if (!acceptedFormats.includes(file.type)) {
//           alert(`File "${file.name}" is not a supported format. Accepted formats: ${acceptedFormats}.`);
//           return false;
//         }
//         return true;
//       });

//       // Create new previews for the valid files
//       const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
//       // Append new previews to the existing previews
//       setPreviews((previousPreviews) => [...previousPreviews, ...newPreviews].slice(0, maxFiles));
//       // Append new files to the existing files in the form state
//       const updatedFiles = field.value ? [...field.value, ...validFiles] : validFiles;
//       field.onChange(updatedFiles.slice(0, maxFiles)); // Ensure we don't exceed maxFiles
//     }
//   };

//   const handleRemoveFile = (index: number, field: any) => {
//     const updatedPreviews = previews.filter((_, index_) => index_ !== index);
//     const updatedFiles = field.value.filter((_: any, index_: number) => index_ !== index);
//     setPreviews(updatedPreviews);
//     field.onChange(updatedFiles);
//   };

//   return (
//     <div className={cn("space-y-2", className)}>
//       {label && (
//         <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
//           <div className="">
//             <Label className="text-[16px] font-medium">
//               {label}
//               {required && <span className="text-destructive ml-1">*</span>}
//             </Label>
//             <p className="text-mid-grey-II text-xs">
//               Upload the photos to promote your product, a maximum of {maxFiles} photos.
//             </p>
//           </div>
//           {previews.length > 0 && previews.length < maxFiles && (
//             <CustomButton
//               size="xl"
//               variant="outline"
//               className="border-primary text-primary"
//               isLeftIconVisible
//               icon={<Image src={uploadIcon} alt="upload" width={16} height={16} />}
//               type="button"
//               onClick={handleButtonClick}
//             >
//               Add Photos
//             </CustomButton>
//           )}
//         </section>
//       )}

//       <Controller
//         name={name}
//         control={control}
//         render={({ field }) => (
//           <div>
//             <div
//               className={cn(
//                 "flex cursor-pointer flex-wrap gap-4",
//                 error && "border-destructive",
//                 disabled && "cursor-not-allowed opacity-50",
//               )}
//             >
//               <input
//                 ref={fileInputReference}
//                 type="file"
//                 multiple
//                 accept={acceptedFormats}
//                 disabled={disabled}
//                 onChange={(event) => handleFileChange(event, field)}
//                 className="hidden"
//               />

//               {previews.length === 0 && (
//                 <div className="border-default bg-low-purple flex h-[200px] w-full flex-col items-center justify-center gap-2 rounded-md">
//                   <CustomButton
//                     size="xl"
//                     variant="outline"
//                     className="border-primary text-primary"
//                     isLeftIconVisible
//                     icon={<Image src={uploadIcon} alt="upload" width={16} height={16} />}
//                     type="button"
//                     onClick={handleButtonClick}
//                   >
//                     Add Photos
//                   </CustomButton>
//                   <div className="text-mid-grey-II flex items-center gap-1">
//                     <InfoIcon className="h-4 w-4" />
//                     <span className="text-xs font-semibold">Upload images (jpg, png, webp)</span>
//                   </div>
//                 </div>
//               )}
//               <section className={`grid w-full grid-cols-2 gap-4 md:grid-cols-3`}>
//                 {previews.map((preview, index) => (
//                   <div key={index} className="relative h-[200px]">
//                     <Image src={preview} alt={`Preview ${index + 1}`} fill className="rounded-lg object-cover" />
//                     <CustomButton
//                       isIconOnly
//                       icon={<MdCancel className="h-4 w-4" />}
//                       variant="ghost"
//                       type="button"
//                       size="icon"
//                       className="bg-background/80 absolute top-2 right-2 backdrop-blur-sm"
//                       onClick={(event) => {
//                         event.preventDefault();
//                         handleRemoveFile(index, field);
//                       }}
//                     />
//                   </div>
//                 ))}
//               </section>
//             </div>
//           </div>
//         )}
//       />

//       {error && <p className="text-destructive text-sm">{error.message?.toString()}</p>}
//     </div>
//   );
// }

// export function FileUpload({
//   label = "Product",
//   name,
//   required = false,
//   disabled = false,
//   className = "",
//   maxFiles = 4,
//   acceptedFormats = "application/pdf",
//   maxFileSize = 100 * 1024 * 1024, // Default to 100MB
//   initialValue = [], // Add this prop for initial values
// }: FileUploadProperties & {
//   initialValue?: Array<{ name: string; size: string; mime_type: string; extension: string }>;
// }) {
//   const {
//     control,
//     formState: { errors },
//   } = useFormContext();
//   const error = errors[name];
//   const fileUploadInputReference = useRef<HTMLInputElement>(null);
//   const [previews, setPreviews] = useState<{ name: string; size: string; type: string }[]>([]);

//   // Handle initial values
//   useEffect(() => {
//     if (initialValue && initialValue.length > 0) {
//       const initialPreviews = initialValue.map((item) => ({
//         name: item.name,
//         size: item.size, // Keep size as a string (e.g., "0.169MB")
//         type: item.mime_type, // Use mime_type for the file type
//       }));
//       setPreviews(initialPreviews);
//     }
//   }, [initialValue]);

//   const handleButtonClick = (event: React.MouseEvent) => {
//     event.preventDefault();
//     fileUploadInputReference.current?.click();
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: any) => {
//     const files = event.target.files;
//     if (files && files.length > 0) {
//       // Convert FileList to an array and slice to respect maxFiles
//       const newFiles = Array.from(files).slice(0, maxFiles - (field.value?.length || 0));
//       // Validate file size and type
//       const validFiles = newFiles.filter((file) => {
//         if (file.size > maxFileSize) {
//           alert(`File "${file.name}" exceeds the maximum size of ${maxFileSize / 1024 / 1024}MB.`);
//           return false;
//         }
//         if (!acceptedFormats.includes(file.type)) {
//           alert(`File "${file.name}" is not a supported format. Accepted formats: ${acceptedFormats}.`);
//           return false;
//         }
//         return true;
//       });

//       // Create new previews for the valid files
//       const newPreviews = validFiles.map((file) => ({
//         name: file.name,
//         size: `${(file.size / 1024 / 1024).toFixed(3)}MB`, // Convert size to MB string
//         type: file.type,
//       }));
//       // Append new previews to the existing previews
//       setPreviews((previousPreviews) => [...previousPreviews, ...newPreviews].slice(0, maxFiles));
//       // Append new files to the existing files in the form state
//       const updatedFiles = field.value ? [...field.value, ...validFiles] : validFiles;
//       field.onChange(updatedFiles.slice(0, maxFiles)); // Ensure we don't exceed maxFiles
//     }
//   };

//   const handleRemoveFile = (index: number, field: any) => {
//     const updatedPreviews = previews.filter((_, index_) => index_ !== index);
//     const updatedFiles = field.value.filter((_: any, index_: number) => index_ !== index);
//     setPreviews(updatedPreviews);
//     field.onChange(updatedFiles);
//   };

//   return (
//     <div className={cn("space-y-2", className)}>
//       {label && (
//         <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
//           <div className="">
//             <Label className="text-[16px] font-medium">
//               {label}
//               {required && <span className="text-destructive ml-1">*</span>}
//             </Label>
//             <p className="text-mid-grey-II text-xs">
//               Upload the actual product you want to sell. Upload the product file.
//             </p>
//           </div>
//           {previews.length > 0 && previews.length < maxFiles && (
//             <CustomButton
//               variant="outline"
//               className="border-primary text-primary"
//               isLeftIconVisible
//               icon={<Image src={uploadIcon} alt="upload" width={16} height={16} />}
//               type="button"
//               onClick={handleButtonClick}
//               size="xl"
//             >
//               Upload Files
//             </CustomButton>
//           )}
//         </section>
//       )}

//       <Controller
//         name={name}
//         control={control}
//         render={({ field }) => (
//           <div>
//             <div
//               className={cn(
//                 "flex cursor-pointer flex-wrap gap-4",
//                 error && "border-destructive",
//                 disabled && "cursor-not-allowed opacity-50",
//               )}
//             >
//               <input
//                 ref={fileUploadInputReference}
//                 type="file"
//                 multiple
//                 accept={acceptedFormats}
//                 disabled={disabled}
//                 onChange={(event) => handleFileChange(event, field)}
//                 className="hidden"
//               />

//               {previews.length === 0 && (
//                 <div className="border-default bg-low-purple flex h-[200px] w-full flex-col items-center justify-center gap-2 rounded-md">
//                   <CustomButton
//                     size="xl"
//                     variant="outline"
//                     className="border-primary text-primary"
//                     isLeftIconVisible
//                     icon={<Image src={uploadIcon} alt="upload" width={16} height={16} />}
//                     type="button"
//                     onClick={handleButtonClick}
//                   >
//                     Upload Files
//                   </CustomButton>
//                   <div className="text-mid-grey-II flex items-center gap-1">
//                     <InfoIcon className="hidden h-4 w-4 lg:block" />
//                     <span className="px-4 text-center text-xs font-semibold">
//                       File can be an image, video, document in various formats (jpg, png, mp4, pdf etc). Min: 100MB
//                     </span>
//                   </div>
//                 </div>
//               )}
//               <section className={`grid w-full grid-cols-2 gap-4`}>
//                 {previews.map((preview, index) => (
//                   <Card
//                     key={index}
//                     className="bg-low-purple relative flex min-h-[94px] items-center gap-4 rounded-md p-6"
//                   >
//                     <Image
//                       src={fileIcon}
//                       alt={`Preview ${index + 1}`}
//                       className={`h-10 w-10 dark:invert dark:filter`}
//                       width={72}
//                       height={72}
//                     />
//                     <div className="flex flex-col gap-1">
//                       <p className="text-sm font-bold text-wrap break-all">{preview.name}</p>
//                       <span className="text-mid-grey-II text-xs">{preview.size}KB</span>
//                     </div>
//                     <CustomButton
//                       isIconOnly
//                       icon={<MdCancel className="h-4 w-4" />}
//                       variant="ghost"
//                       type="button"
//                       size="icon"
//                       className="bg-background/80 absolute top-2 right-2 backdrop-blur-sm"
//                       onClick={(event) => {
//                         event.preventDefault();
//                         handleRemoveFile(index, field);
//                       }}
//                     />
//                   </Card>
//                 ))}
//               </section>
//             </div>
//           </div>
//         )}
//       />

//       {error && <p className="text-destructive text-sm">{error.message?.toString()}</p>}
//     </div>
//   );
// }

// export function ThumbNailUpload({
//   label = "Thumbnail",
//   labelText = "This image will appear in the explore page. Upload a square image of 2MB or less.",
//   name,
//   required = false,
//   disabled = false,
//   className = "",
//   acceptedFormats = "image/jpeg, image/png",
//   maxFileSize = 2 * 1024 * 1024,
//   initialValue = null, // Add this prop
// }: ThumbNailUploadProperties & { initialValue?: string | null | File }) {
//   const {
//     control,
//     formState: { errors },
//   } = useFormContext();
//   const error = errors[name];
//   const thumbnailUploadInputReference = useRef<HTMLInputElement>(null);
//   const [preview, setPreview] = useState<string | null>();

//   const handleButtonClick = (event: React.MouseEvent) => {
//     event.preventDefault();
//     thumbnailUploadInputReference.current?.click();
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: any) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       // Validate file size
//       if (file.size > maxFileSize) {
//         alert(`File size must be less than ${maxFileSize / 1024 / 1024}MB.`);
//         return;
//       }

//       // Validate file type
//       if (!acceptedFormats.includes(file.type)) {
//         alert(`File type must be one of: ${acceptedFormats}.`);
//         return;
//       }

//       // Create a preview URL for the file
//       setPreview(URL.createObjectURL(file));

//       // Update the form state with the file
//       field.onChange(file);
//     }
//   };

//   const handleRemoveFile = (field: any) => {
//     setPreview(null); // Clear the preview
//     field.onChange(null); // Clear the file in the form state
//   };

//   useEffect(() => {
//     // const getInit = async () => {
//     if (initialValue && typeof initialValue === "string") {
//       // console.log(await createFileFromUrl(initialValue));
//       setPreview(initialValue);
//     }
//     // };
//     // getInit();
//   }, [initialValue]);

//   return (
//     <div className={cn("space-y-2", className)}>
//       {label && (
//         <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
//           <div className="">
//             <Label className="text-[16px] font-medium">
//               {label}
//               {required && <span className="text-destructive ml-1">*</span>}
//             </Label>
//             <p className="text-mid-grey-II text-xs">{labelText}</p>
//           </div>
//           {preview && (
//             <CustomButton
//               size="xl"
//               variant="outline"
//               className="border-primary text-primary"
//               isLeftIconVisible
//               icon={<CameraIcon className="h-4 w-4" />}
//               type="button"
//               onClick={handleButtonClick}
//             >
//               Replace Image
//             </CustomButton>
//           )}
//         </section>
//       )}

//       <Controller
//         name={name}
//         control={control}
//         render={({ field }) => (
//           <div>
//             <div
//               className={cn(
//                 "flex flex-wrap gap-4",
//                 error && "border-destructive",
//                 disabled && "cursor-not-allowed opacity-50",
//               )}
//             >
//               <input
//                 ref={thumbnailUploadInputReference}
//                 type="file"
//                 accept={acceptedFormats}
//                 disabled={disabled}
//                 onChange={(event) => handleFileChange(event, field)}
//                 className="hidden"
//               />

//               {!preview && (
//                 <div className="border-default bg-low-purple flex h-[200px] w-full flex-col items-center justify-center gap-2 rounded-md">
//                   <CustomButton
//                     size="xl"
//                     variant="outline"
//                     className="border-primary text-primary"
//                     isLeftIconVisible
//                     icon={<CameraIcon className="h-4 w-4" />}
//                     type="button"
//                     onClick={handleButtonClick}
//                   >
//                     Upload Image
//                   </CustomButton>
//                 </div>
//               )}

//               {preview && (
//                 <div className="relative h-[200px] w-[200px]">
//                   <Image src={preview} alt="Thumbnail Preview" fill className="rounded-lg object-cover" />
//                   <CustomButton
//                     isIconOnly
//                     icon={<MdCancel className="h-4 w-4" />}
//                     variant="ghost"
//                     type="button"
//                     size="icon"
//                     className="bg-background/80 absolute top-2 right-2 backdrop-blur-sm"
//                     onClick={() => handleRemoveFile(field)}
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       />

//       {error && <p className="text-destructive text-sm">{error.message?.toString()}</p>}
//     </div>
//   );
// }

// export function MultiSelect({
//   label,
//   name,
//   options,
//   placeholder = "Select options",
//   required = false,
//   className = "",
// }: {
//   label?: string;
//   name: string;
//   options: { value: string; label: string; thumbnail?: string | File | null }[];
//   placeholder?: string;
//   required?: boolean;
//   disabled?: boolean;
//   className?: string;
// }) {
//   const {
//     control,
//     formState: { errors },
//   } = useFormContext();
//   const error = errors[name];

//   return (
//     <div className="space-y-2">
//       {label && (
//         <Label className="text-[16px] font-medium">
//           {label}
//           {required && <span className="text-destructive ml-1">*</span>}
//         </Label>
//       )}

//       <Controller
//         name={name}
//         control={control}
//         render={({ field }) => {
//           const selectedValues = field.value || [];

//           const handleSelect = (value: string) => {
//             const newSelectedValues = selectedValues.includes(value)
//               ? selectedValues.filter((v: string) => v !== value) // Deselect if already selected
//               : [...selectedValues, value]; // Select if not already selected
//             field.onChange(newSelectedValues);
//           };

//           return (
//             <>
//               <Select>
//                 <SelectTrigger className={cn(error && "border-destructive", className)}>
//                   <SelectValue placeholder={placeholder}>
//                     {selectedValues.length > 0 ? `${selectedValues.length} selected` : placeholder}
//                   </SelectValue>
//                 </SelectTrigger>
//                 <SelectContent>
//                   {options.map((option) => (
//                     <section
//                       key={option.value}
//                       className="flex items-center justify-between space-x-2 p-2"
//                       onClick={() => handleSelect(option.value)}
//                     >
//                       <div className="flex items-center space-x-2">
//                         {option.thumbnail && (
//                           <BlurImage
//                             src={typeof option.thumbnail === "string" ? option.thumbnail : ""}
//                             alt={option.label}
//                             width={40}
//                             height={40}
//                             className="h-[20px] w-[20px] rounded-full object-cover"
//                           />
//                         )}

//                         <label className="text-sm">{option.label}</label>
//                       </div>
//                       <Checkbox
//                         checked={selectedValues.includes(option.value)}
//                         onCheckedChange={() => handleSelect(option.value)}
//                       />
//                     </section>
//                   ))}
//                 </SelectContent>
//               </Select>

//               {/* Display selected values below the input */}
//               {selectedValues.length > 0 && (
//                 <div className="mt-2 flex flex-wrap gap-2">
//                   {selectedValues.map((value: string) => {
//                     const selectedOption = options.find((opt) => opt.value === value);
//                     return selectedOption ? (
//                       <Badge key={value} className="text-xs">
//                         {selectedOption.thumbnail && (
//                           <Image
//                             src={typeof selectedOption.thumbnail === "string" ? selectedOption.thumbnail : ""}
//                             alt={selectedOption.label}
//                             width={40}
//                             height={40}
//                             className="mr-1 h-[20px] w-[20px] rounded-full object-cover"
//                           />
//                         )}
//                         {selectedOption.label}
//                       </Badge>
//                     ) : null;
//                   })}
//                 </div>
//               )}
//             </>
//           );
//         }}
//       />

//       {error && <p className="text-destructive text-sm">{error.message?.toString()}</p>}
//     </div>
//   );
// }

// interface StarRatingFieldProperties {
//   label?: string;
//   name: string;
//   required?: boolean;
//   disabled?: boolean;
//   className?: string;
//   size?: string;
// }

// export function StarRatingField({ label, size, name, required = false, className = "" }: StarRatingFieldProperties) {
//   const {
//     control,
//     formState: { errors },
//   } = useFormContext();
//   const error = errors[name];

//   return (
//     <div className="space-y-2">
//       {label && (
//         <Label className="text-[16px] font-medium">
//           {label}
//           {required && <span className="text-destructive ml-1">*</span>}
//         </Label>
//       )}

//       <Controller
//         name={name}
//         control={control}
//         render={({ field }) => (
//           <StarRating
//             disabled={false}
//             rating={field.value}
//             onRatingChange={field.onChange}
//             size={size}
//             className={cn(error && "border-destructive", className)}
//           />
//         )}
//       />

//       {error && <p className="text-destructive text-sm">{error.message?.toString()}</p>}
//     </div>
//   );
// }

// // export function SwitchField({
// //   label,
// //   name,
// //   required = false,
// //   disabled = false,
// //   className = "",
// // }: {
// //   label?: string | ReactNode;
// //   name: string;
// //   required?: boolean;
// //   disabled?: boolean;
// //   className?: string;
// // }) {
// //   const {
// //     control,
// //     formState: { errors },
// //   } = useFormContext();
// //   const error = errors[name];

// //   return (
// //     <div>
// //       <div className={cn(className)}>
// //         {label && (
// //           <Label className="h-fit text-sm font-medium">
// //             {label}
// //             {required && <span className="ml-1 text-destructive">*</span>}
// //           </Label>
// //         )}

// //         <Controller
// //           name={name}
// //           control={control}
// //           render={({ field }) => (
// //             <Switch
// //               checked={field.value}
// //               onCheckedChange={field.onChange}
// //               disabled={disabled}
// //               className={cn(error && "border-destructive", "mt-0")}
// //             />
// //           )}
// //         />
// //       </div>

// //       {error && <p className="text-sm text-destructive">{error.message?.toString()}</p>}
// //     </div>
// //   );
// // }

// export function SwitchField({
//   label,
//   name,
//   required = false,
//   disabled = false,
//   className = "",
//   onChange, // Add an onChange prop
// }: {
//   label?: string | React.ReactNode;
//   name: string;
//   required?: boolean;
//   disabled?: boolean;
//   className?: string;
//   onChange?: (checked: boolean) => void; // Callback function to handle switch toggle
// }) {
//   const {
//     control,
//     formState: { errors },
//   } = useFormContext();
//   const error = errors[name];

//   return (
//     <div>
//       <div className={cn(className)}>
//         {label && (
//           <Label className="h-fit text-sm font-medium">
//             {label}
//             {required && <span className="text-destructive ml-1">*</span>}
//           </Label>
//         )}

//         <Controller
//           name={name}
//           control={control}
//           render={({ field }) => (
//             <Switch
//               checked={field.value}
//               onCheckedChange={(checked) => {
//                 field.onChange(checked); // Update the form state
//                 if (onChange) {
//                   onChange(checked); // Trigger the onChange callback
//                 }
//               }}
//               disabled={disabled}
//               className={cn(error && "border-destructive", "mt-0")}
//             />
//           )}
//         />
//       </div>

//       {error && <p className="text-destructive text-sm">{error.message?.toString()}</p>}
//     </div>
//   );
// }

// export const PasswordValidation = ({ password }: { password: string }) => {
//   const hasMinLength = password.length >= 8;
//   const hasUppercase = /[A-Z]/.test(password);
//   const hasNumber = /\d/.test(password);
//   const hasSpecialChar = /[#$%&@^]/.test(password);

//   return (
//     <div className="mt-2 space-y-2">
//       <div className="flex items-center space-x-2">
//         <Checkbox className={`rounded-full border-black px-[1px]`} checked={hasMinLength} />
//         <span className="text-mid-grey-II text-[10px]">Password should be at least 8 characters long</span>
//       </div>
//       <div className="flex items-center space-x-2">
//         <Checkbox className={`rounded-full border-black px-[1px]`} checked={hasUppercase} />
//         <span className="text-mid-grey-II text-[10px]">Password should contain at least one uppercase letter</span>
//       </div>
//       <div className="flex items-center space-x-2">
//         <Checkbox className={`rounded-full border-black px-[1px]`} checked={hasNumber} />
//         <span className="text-mid-grey-II text-[10px]">Password should contain at least one number</span>
//       </div>
//       <div className="flex items-center space-x-2">
//         <Checkbox className={`rounded-full border-black px-[1px]`} checked={hasSpecialChar} />
//         <span className="text-mid-grey-II text-[10px]">
//           Password should contain at least one special character (@#$%^&)
//         </span>
//       </div>
//     </div>
//   );
// };
export {};
