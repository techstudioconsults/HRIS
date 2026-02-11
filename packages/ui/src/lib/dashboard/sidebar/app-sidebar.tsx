/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {
  BookOpen,
  Bot,
  Frame,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from 'lucide-react'
import * as React from 'react'

import { NavMain } from '../components/nav-main'
import { NavProjects } from '../components/nav-projects'
import { NavUser } from '../components/nav-user'
import { TeamSwitcher } from '../components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@workspace/ui/components/sidebar'
import { useActiveNavigation } from '@workspace/ui/hooks'

/**
 * Reusable Dashboard Sidebar Types
 */
export type DashboardUser = {
  name: string
  email: string
  avatar: string
}

export type DashboardTeam = {
  name: string
  logo: React.ReactNode
  // logo: React.ReactNode | React.ElementType | string;
  plan: string
}

export type DashboardNavItem = {
  name: string
  url: string
  icon?: any
  isActive?: boolean
  items?: {
    name: string
    url: string
  }[]
}

export type DashboardProject = {
  name: string
  url: string
  icon?: any
}

export interface AppSidebarProperties extends React.ComponentProps<
  typeof Sidebar
> {
  theme: any
  user?: DashboardUser
  teams?: DashboardTeam[]
  navMain?: DashboardNavItem[]
  navSecondary?: DashboardProject[]
  navMainTitle?: string
  secondaryTitle?: string
}

const defaultData: {
  user: DashboardUser
  teams: DashboardTeam[]
  navMain: DashboardNavItem[]
  projects: DashboardProject[]
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
}

export function AppSidebar({
  theme,
  user,
  teams,
  navMain,
  navSecondary,
  navMainTitle,
  secondaryTitle,
  ...properties
}: AppSidebarProperties) {
  const resolved = {
    user: user ?? defaultData.user,
    teams: teams ?? defaultData.teams,
    navMain: navMain ?? defaultData.navMain,
    projects: navSecondary ?? defaultData.projects,
    mainTitle: navMainTitle,
    secondaryTitle: secondaryTitle,
  }

  // Use active navigation hook to determine active states
  const activeNavItems = useActiveNavigation(resolved.navMain)
  const projectNavItems = useActiveNavigation(resolved.projects)

  return (
    <Sidebar collapsible='icon' {...properties}>
      <SidebarHeader>
        <TeamSwitcher teams={resolved.teams} />
      </SidebarHeader>
      <SidebarContent>
        {navMainTitle ? (
          <NavMain title={resolved.mainTitle} items={activeNavItems} />
        ) : null}
        {secondaryTitle ? (
          <NavProjects
            title={resolved.secondaryTitle}
            projects={projectNavItems}
          />
        ) : (
          <NavProjects projects={projectNavItems} />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser theme={theme} user={resolved.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
