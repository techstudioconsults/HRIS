/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  BookOpen,
  Bot,
  Frame,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from 'lucide-react';
import * as React from 'react';

import { NavMain, NavProjects } from '@workspace/ui/lib/dashboard';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@workspace/ui/components/sidebar';
import { useActiveNavigation } from '@workspace/ui/hooks';
import { Logo } from '@workspace/ui/lib/logo';
import { cn } from '@workspace/ui/lib/utils';

/**
 * Reusable Dashboard Sidebar Types
 */
export type DashboardUser = {
  name: string;
  email: string;
  avatar: string;
};

export type DashboardTeam = {
  name: string;
  logo: React.ReactNode;
  plan: string;
};

export type DashboardNavItem = {
  name: string;
  url: string;
  icon?: any;
  isActive?: boolean;
  items?: {
    name: string;
    url: string;
  }[];
};

export type DashboardProject = {
  name: string;
  url: string;
  icon?: any;
};

export interface AppSidebarProperties extends React.ComponentProps<
  typeof Sidebar
> {
  theme: any;
  user?: DashboardUser;
  teams?: DashboardTeam[];
  navMain?: DashboardNavItem[];
  navSecondary?: DashboardProject[];
  navMainTitle?: string;
  secondaryTitle?: string;
}

const defaultData: {
  user: DashboardUser;
  teams: DashboardTeam[];
  navMain: DashboardNavItem[];
  projects: DashboardProject[];
} = {
  user: {
    name: 'Admin',
    email: 'techstudioacademy.com',
    avatar: '',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: ``,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: ``,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: ``,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      name: 'Playground',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        { name: 'History', url: '#' },
        { name: 'Starred', url: '#' },
        { name: 'Settings', url: '#' },
      ],
    },
    {
      name: 'Models',
      url: '#',
      icon: Bot,
      items: [
        { name: 'Genesis', url: '#' },
        { name: 'Explorer', url: '#' },
        { name: 'Quantum', url: '#' },
      ],
    },
    {
      name: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        { name: 'Introduction', url: '#' },
        { name: 'Get Started', url: '#' },
        { name: 'Tutorials', url: '#' },
        { name: 'Changelog', url: '#' },
      ],
    },
    {
      name: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        { name: 'General', url: '#' },
        { name: 'Team', url: '#' },
        { name: 'Billing', url: '#' },
        { name: 'Limits', url: '#' },
      ],
    },
  ],
  projects: [
    { name: 'Design Engineering', url: '#', icon: Frame },
    { name: 'Sales & Marketing', url: '#', icon: PieChart },
    { name: 'Travel', url: '#', icon: Map },
  ],
};

export function AppSidebar({
  user,
  teams,
  navMain,
  navSecondary,
  navMainTitle,
  secondaryTitle,
  variant = 'sidebar',
  collapsible = 'offcanvas',
  ...properties
}: AppSidebarProperties) {
  const { state } = useSidebar();

  const resolved = {
    user: user ?? defaultData.user,
    teams: teams ?? defaultData.teams,
    navMain: navMain ?? defaultData.navMain,
    projects: navSecondary ?? defaultData.projects,
    mainTitle: navMainTitle,
    secondaryTitle: secondaryTitle,
  };

  // Use active navigation hook to determine active states
  const activeNavItems = useActiveNavigation(resolved.navMain);
  const projectNavItems = useActiveNavigation(resolved.projects);

  // Extract the first team's logo for the sidebar header display
  const primaryTeam = resolved.teams[0];
  const hasContent = Boolean(navMainTitle || secondaryTitle);

  return (
    <Sidebar variant={variant} collapsible={collapsible} {...properties}>
      <SidebarHeader className="mt-2 flex items-center py-2">
        <div
          className={cn('flex items-center justify-center h-10 w-full')}
          aria-label={primaryTeam ? primaryTeam.name : 'Dashboard'}
          role="banner"
        >
          {primaryTeam?.logo ? (
            <span className="shrink-0">{primaryTeam.logo}</span>
          ) : (
            <Logo
              logo="/images/logo.png"
              width={32}
              height={32}
              className="shrink-0"
            />
          )}
          {state !== 'collapsed' && primaryTeam && (
            <div className="ml-3 min-w-0 truncate">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">
                {primaryTeam.name}
              </p>
              {primaryTeam.plan && (
                <p className="truncate text-[11px] text-sidebar-foreground/60">
                  {primaryTeam.plan}
                </p>
              )}
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className={cn(`px-3`, hasContent ? 'mt-8' : '')}>
        {navMainTitle ? (
          <NavMain title={resolved.mainTitle} items={activeNavItems} />
        ) : null}
        {secondaryTitle ? (
          <NavProjects
            title={resolved.secondaryTitle}
            projects={projectNavItems}
          />
        ) : null}
      </SidebarContent>
      <SidebarFooter className={`px-3 flex items-center justify-center`}>
        {/*<NavUser theme={theme} user={resolved.user} />*/}
        <span className={`text-[8px] font-light`}>Powered By</span>
        <Logo
          key="expanded-logo"
          logo={'/images/logo-white.svg'}
          className={`w-auto mx-auto`}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
