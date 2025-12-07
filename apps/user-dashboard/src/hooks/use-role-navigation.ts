// "use client";

// import { useSession } from "next-auth/react";

// export const useRoleNavigation = () => {
//   const { data: session } = useSession();
//   const userRole = session?.user?.role?.name?.toUpperCase() || "";

//   switch (userRole) {
//     case "SUPER_ADMIN": {
//       return superAdminSideItems;
//     }
//     case "ADMIN": {
//       return adminSideItems;
//     }
//     case "VENDOR": {
//       return vendorSideItems;
//     }
//     default: {
//       return vendorSideItems;
//     } // Default to vendor items for unknown roles
//   }
// };
export {};
