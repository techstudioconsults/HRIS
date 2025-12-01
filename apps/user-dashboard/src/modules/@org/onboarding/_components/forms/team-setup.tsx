"use client";

import { FormHeader } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
// import { Skeleton } from "@/components/ui/skeleton";
import { People } from "iconsax-reactjs";
import Link from "next/link";

import { TeamConfig } from "../accordions/team-config";

export const TeamSetupForm = () => {
  return (
    <section className="rounded-[10px] border p-7" data-tour="team-form">
      <div className="">
        <FormHeader
          icon={<People />}
          title="Set up your team"
          subTitle="Configure teams and roles with specific permissions for your organization"
        />
      </div>

      <section>
        <section className="hide-scrollbar max-h-[500px] space-y-4 overflow-auto" data-tour="team-accordion">
          <TeamConfig />
        </section>

        <div className="mt-8">
          <div>
            <MainButton href={`/onboarding/step-3`} type="button" variant="primary" className="w-full" size="xl">
              Continue
            </MainButton>
          </div>

          <div className="flex w-full items-center justify-center py-5">
            <Link
              data-tour="skip-form"
              href={`/admin/dashboard`}
              className="text-primary text-sm font-medium hover:underline"
            >
              Skip for Later
            </Link>
          </div>
        </div>
      </section>
    </section>
  );
};

// export const FormLoadingSkeleton = () => {
//   return (
//     <section className="rounded-[10px] p-7 shadow-none">
//       {/* Header */}
//       <div className="mb-8 space-y-2">
//         <Skeleton className="h-8 w-[250px]" />
//         <Skeleton className="h-5 w-[400px]" />
//       </div>

//       {/* Team List */}
//       <div className="hide-scrollbar max-h-[500px] space-y-4 overflow-auto">
//         {/* Executive Team Skeleton */}
//         <div className="rounded-lg border p-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <Skeleton className="h-5 w-5 rounded" />
//               <Skeleton className="h-6 w-[150px]" />
//             </div>
//             <div className="flex space-x-4">
//               <Skeleton className="h-5 w-5 rounded" />
//               <Skeleton className="h-5 w-5 rounded" />
//             </div>
//           </div>
//         </div>

//         {/* Engineering Team Skeleton */}
//         <div className="rounded-lg border p-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <Skeleton className="h-5 w-5 rounded" />
//               <Skeleton className="h-6 w-[150px]" />
//             </div>
//             <div className="flex space-x-4">
//               <Skeleton className="h-5 w-5 rounded" />
//               <Skeleton className="h-5 w-5 rounded" />
//             </div>
//           </div>
//         </div>

//         {/* Add New Team Button */}
//         <Skeleton className="h-10 w-[150px] rounded-md" />
//       </div>

//       {/* Footer Buttons */}
//       <div className="mt-8 space-y-4">
//         <Skeleton className="h-12 w-full rounded-md" />
//         <Skeleton className="h-12 w-full rounded-md" />
//       </div>
//     </section>
//   );
// };
