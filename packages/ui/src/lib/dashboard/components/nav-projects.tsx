/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@workspace/ui/components/sidebar';
import Link from 'next/link';
import { cn } from '../../utils';
import { Icon } from '@workspace/ui/lib/icons/icon';

export function NavProjects({
  title,
  projects,
}: {
  title?: string;
  projects: {
    name: string;
    url: string;
    icon?: any;
    isActive?: boolean;
  }[];
}) {
  const { state, isMobile, setOpenMobile } = useSidebar();

  const handleNavigate = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarGroup className="px-0">
      <SidebarGroupLabel className={`font-light mb-2 ml-5`}>
        {title}
      </SidebarGroupLabel>
      <SidebarMenu className="gap-5">
        {projects.map((item) => (
          <SidebarMenuItem
            key={item.name}
            className={cn(
              `px-1`,
              state === 'collapsed' && 'flex items-center justify-center'
            )}
          >
            <SidebarMenuButton
              asChild
              isActive={item.isActive}
              className={cn(
                'hover:bg-primary/10 border-transparent w-full cursor-pointer' +
                  ' p-6 transition-all duration-75',
                item.isActive &&
                  'border-primary bg-primary/40 shadow-[0px_0px_0px_2px_#0057e6]'
              )}
            >
              <Link href={item.url} onClick={handleNavigate}>
                {item.icon && (
                  <Icon
                    variant={item.isActive ? `Bulk` : `Linear`}
                    name={item.icon}
                    size={18}
                    className={cn(``)}
                  />
                )}
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
