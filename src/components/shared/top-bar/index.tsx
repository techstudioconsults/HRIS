"use client";

import { GlobalSearchInput } from "@/components/core/miscellaneous/search-input";
import { ArrowDown2, Notification } from "iconsax-reactjs";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

type TopBarProperties = {
  adminName: string;
  // onSearch: (query: string) => void;
  notificationsCount?: number;
  className?: string;
};

const handleLogout = async () => {
  try {
    await signOut({
      redirect: true,
      callbackUrl: "/login",
    });
  } catch {
    toast.error(`Something went wrong`);
  }
};

// onSearch,
export default function TopBar({ adminName, notificationsCount = 0, className = "" }: TopBarProperties) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className={`bg-background flex h-16 items-center justify-between px-4 ${className}`}>
      {/* Search Input */}
      <div className="relative hidden w-full max-w-[240px] md:block">
        <GlobalSearchInput />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button
          type="button"
          className="focus:ring-primary-500 relative rounded-full p-1 text-gray-500 hover:text-gray-700 focus:ring-2 focus:ring-offset-2 focus:outline-none"
        >
          <span className="sr-only">View notifications</span>
          <Notification size="24" className="text-gray-500" variant="Outline" />
          {notificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
              {notificationsCount > 9 ? "9+" : notificationsCount}
            </span>
          )}
        </button>

        {/* Admin Dropdown */}
        <div className="relative">
          <button
            type="button"
            className="focus:ring-primary-500 flex items-center gap-x-2 rounded-full px-2 py-1 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="sr-only">Open user menu</span>
            <span className="font-medium text-gray-800">{adminName}</span>
            <ArrowDown2
              size="16"
              className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-gray-200 focus:outline-none">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                My Profile
              </a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Account Settings
              </a>
              <span onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Logout
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
