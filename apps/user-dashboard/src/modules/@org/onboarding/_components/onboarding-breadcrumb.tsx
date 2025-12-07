"use client";

import { MainButton } from "@workspace/ui/lib/button";
import { usePathname } from "next/navigation";

export const OnboardingBreadcrumb = () => {
  const pathname = usePathname();

  const getBreadcrumbItems = () => {
    const items = [
      { label: "Welcome", href: "/onboarding/welcome", active: pathname.includes("/welcome") },
      { label: "Company Profile", href: "/onboarding/step-1", active: pathname.includes("/step-1") },
      { label: "Team Setup", href: "/onboarding/step-2", active: pathname.includes("/step-2") },
      { label: "Employee Setup", href: "/onboarding/step-3", active: pathname.includes("/step-3") },
    ];

    return items;
  };

  const items = getBreadcrumbItems();

  return (
    <nav className="mb-6 flex items-center space-x-2 text-sm text-gray-500">
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && <span className="mx-2">/</span>}
          <MainButton
            href={item.href}
            variant={item.active ? "link" : "ghost"}
            className={`text-sm ${item.active ? "text-primary font-medium" : "text-gray-500"}`}
            size="sm"
          >
            {item.label}
          </MainButton>
        </div>
      ))}
    </nav>
  );
};
