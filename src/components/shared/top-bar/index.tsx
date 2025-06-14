"use client";

import { ArrowDown2, Notification, SearchNormal1 } from "iconsax-reactjs";
import { useState } from "react";

type TopBarProperties = {
  adminName: string;
  // onSearch: (query: string) => void;
  notificationsCount?: number;
  className?: string;
};

// onSearch,
export default function TopBar({ adminName, notificationsCount = 0, className = "" }: TopBarProperties) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className={`flex h-16 items-center justify-between px-4 ${className}`}>
      {/* Search Input */}
      <div className="relative w-full max-w-[240px]">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchNormal1 size="15" className="text-gray-400" variant="Outline" />
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="focus:ring-primary-500 block w-full rounded border-0 bg-gray-50 py-2 pr-4 pl-10 text-gray-900 ring-1 ring-gray-200 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          // onChange={(e) => onSearch(e.target.value)}
        />
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
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
