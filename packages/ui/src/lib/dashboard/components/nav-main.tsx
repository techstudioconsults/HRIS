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
  const { isMobile, setOpenMobile } = useSidebar();

  const handleNavigate = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // Check if any sub-item is active to determine if collapsible should be open
          const hasActiveSubItem =
            item.subItems?.some((subItem) => subItem.isActive) || false;
          const shouldBeOpen = item.isActive || hasActiveSubItem;

          return (
            <Collapsible
              key={item.name}
              asChild
              defaultOpen={shouldBeOpen}
              className="group/collapsible"
            >
              <SidebarMenuItem className="flex items-center justify-center">
                <CollapsibleTrigger asChild>
                  <Link href={item.url} onClick={handleNavigate}>
                    <SidebarMenuButton
                      className={cn(
                        'w-full p-6 transition-colors',
                        item.isActive &&
                          'border-primary/70 text-primary border-2 font-medium shadow-[0px_0px_0px_2px_#0266F333]'
                      )}
                    >
                      {/*{item.icon && <item.icon className={cn('h-4 w-4')} />}*/}
                      {item.icon && <Icon name={item.icon} />}
                      <span>{item.name}</span>
                      {item.subItems && (
                        <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </SidebarMenuButton>
                  </Link>
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
