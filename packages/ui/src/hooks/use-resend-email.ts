// "use client";

// import { updateQueryParamameters, useDecodedSearchParameters } from "@/hooks/use-search-parameters";
// import { useOnboardingUserService } from "@/services/externals/onboarding/use-onboarding-user-service";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { useCallback } from "react";
// import { toast } from "sonner";

// export const useResendEmail = () => {
//   const email = useDecodedSearchParameters("email");
//   const pathname = usePathname();
//   const searchParameters = useSearchParams();
//   const router = useRouter();
//   const { useResendOTP } = useOnboardingUserService();
//   const { mutateAsync: resendOTP, isPending: isResending } = useResendOTP();

//   const handleResendEmail = useCallback(async () => {
//     try {
//       if (email) {
//         await resendOTP(
//           { email },
//           {
//             onSuccess: (response) => {
//               if (response?.success && response?.data?.token) {
//                 updateQueryParamameters(router, pathname, searchParameters, {
//                   token: response.data.token,
//                 });

//                 toast.success("Verification code sent", {
//                   description: "A new verification code has been sent to your email address.",
//                 });
//               }
//             },
//           },
//         );
//       }
//     } catch {
//       toast.error("Failed to send verification email", {
//         description: "Please try again later.",
//       });
//     }
//   }, [email, resendOTP, router, pathname, searchParameters]);

//   return {
//     handleResendEmail,
//     isResending,
//     email,
//   };
// };
export {};
