/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { useActiveNavigation } from "@/hooks/use-active-navigation";
import { BookOpen, Bot, Frame, Map, PieChart, Settings2, SquareTerminal } from "lucide-react";
import * as React from "react";

import { NavMain } from "../components/nav-main";
import { NavProjects } from "../components/nav-projects";
import { NavUser } from "../components/nav-user";
import { TeamSwitcher } from "../components/team-switcher";

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
  // logo: React.ReactNode | React.ElementType | string;
  plan: string;
};

export type DashboardNavItem = {
  title: string;
  url: string;
  icon?: any;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
};

export type DashboardProject = {
  name: string;
  url: string;
  icon?: any;
};

export interface AppSidebarProperties extends React.ComponentProps<typeof Sidebar> {
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
    name: "Admin",
    email: "techstudioacademy.com",
    avatar: "",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: ``,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: ``,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: ``,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "History", url: "#" },
        { title: "Starred", url: "#" },
        { title: "Settings", url: "#" },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        { title: "Genesis", url: "#" },
        { title: "Explorer", url: "#" },
        { title: "Quantum", url: "#" },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        { title: "Introduction", url: "#" },
        { title: "Get Started", url: "#" },
        { title: "Tutorials", url: "#" },
        { title: "Changelog", url: "#" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        { title: "General", url: "#" },
        { title: "Team", url: "#" },
        { title: "Billing", url: "#" },
        { title: "Limits", url: "#" },
      ],
    },
  ],
  projects: [
    { name: "Design Engineering", url: "#", icon: Frame },
    { name: "Sales & Marketing", url: "#", icon: PieChart },
    { name: "Travel", url: "#", icon: Map },
  ],
};

export function AppSidebar({
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
    mainTitle: navMainTitle ?? `Platform`,
    secondaryTitle: secondaryTitle ?? `project`,
  };

  // Use active navigation hook to determine active states
  const activeNavItems = useActiveNavigation(resolved.navMain);

  return (
    <Sidebar collapsible="icon" {...properties}>
      <SidebarHeader>
        <TeamSwitcher teams={resolved.teams} />
      </SidebarHeader>
      <SidebarContent>
        {navMainTitle && <NavMain title={resolved.mainTitle} items={activeNavItems} />}
        {secondaryTitle && <NavProjects title={resolved.secondaryTitle} projects={resolved.projects} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={resolved.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
