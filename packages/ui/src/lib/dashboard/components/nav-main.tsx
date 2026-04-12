/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@workspace/ui/components/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@workspace/ui/components/sidebar';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '../../utils';
import { Icon } from '@workspace/ui/lib/icons/icon';

export function NavMain({
  title,
  items,
}: {
  title?: string;
  items: {
    name: string;
    url: string;
    icon?: any;
    isActive?: boolean;
    subItems?: {
      name: string;
      url: string;
      isActive?: boolean;
    }[];
  }[];
}) {
  const { state, isMobile, setOpenMobile } = useSidebar();

  const handleNavigate = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarGroup className={`px-0`}>
      <SidebarGroupLabel className={`font-light mb-2 ml-5`}>
        {title}
      </SidebarGroupLabel>
      <SidebarMenu className={`gap-3`}>
        {items.map((item) => {
          const hasSubItems = Boolean(item.subItems?.length);
          // Check if any sub-item is active to determine if collapsible should be open
          const hasActiveSubItem =
            item.subItems?.some((subItem) => subItem.isActive) || false;
          const shouldBeOpen = item.isActive || hasActiveSubItem;
          const parentIsActive = item.isActive || hasActiveSubItem;

          if (!hasSubItems) {
            return (
              <SidebarMenuItem
                key={item.name}
                className={cn(
                  `px-1`,
                  state === 'collapsed' && 'flex items-center justify-center'
                )}
              >
                <SidebarMenuButton
                  asChild
                  tooltip={item.name}
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
                        className={cn(`text-white`)}
                      />
                    )}
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              key={item.name}
              asChild
              defaultOpen={shouldBeOpen}
              className="group/collapsible"
            >
              <SidebarMenuItem
                className={cn(
                  state === 'collapsed' && 'flex items-center justify-center'
                )}
              >
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    type="button"
                    isActive={parentIsActive}
                    className={cn(
                      'hover:bg-primary/10 border-transparent w-full cursor-pointer' +
                        ' p-6 transition-all duration-75',
                      parentIsActive &&
                        'border-primary bg-primary/40 shadow-[0px_0px_0px_2px_#0057e6]'
                    )}
                  >
                    {item.icon && (
                      <Icon
                        variant={parentIsActive ? `Bulk` : `Linear`}
                        name={item.icon}
                        size={18}
                        className={cn(`text-white`)}
                      />
                    )}
                    <span>{item.name}</span>
                    <ChevronRight
                      className="ml-auto h-4 w-4 transition-transform
                        duration-200 group-data-[state=open]/collapsible:rotate-90"
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.subItems?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.name}>
                        <SidebarMenuSubButton
                          asChild
                          className={cn(
                            'w-full transition-colors',
                            subItem.isActive &&
                              'bg-accent text-accent-foreground font-medium'
                          )}
                        >
                          <Link href={subItem.url} onClick={handleNavigate}>
                            <span>{subItem.name}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
