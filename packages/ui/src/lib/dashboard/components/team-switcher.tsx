'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@workspace/ui/components/sidebar';
import { ChevronsUpDown, Plus } from 'lucide-react';
import * as React from 'react';
import { cn } from '@workspace/ui/lib/utils';
import { Logo } from '@workspace/ui/lib/logo';

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ReactNode;
    plan: string;
  }[];
}) {
  const { isMobile, state } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={cn(
                'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground',
                `flex items-center p-0 focus:border-none! focus:ring-0!`
              )}
            >
              <span className={`w-[208px]`}>
                {activeTeam.logo as React.ReactNode}
              </span>
              <span className={cn(state === `collapsed` && `hidden`)}>
                <ChevronsUpDown className="size-3" />
              </span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) lg:min-w-xs rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={38}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Teams
            </DropdownMenuLabel>
            {teams.map(
              (team, index) =>
                (
                  <DropdownMenuItem
                    key={team.name}
                    onClick={() => setActiveTeam(team)}
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-md border">
                      {/*{team.logo as React.ReactNode}*/}
                      <Logo logo={`/images/logo.png`} />
                    </div>
                    {team.name as React.ReactNode}
                    <DropdownMenuShortcut>
                      ⌘{(index + 1) as React.ReactNode}
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                ) as React.ReactNode
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
