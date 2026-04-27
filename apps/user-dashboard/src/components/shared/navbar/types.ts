import type { LinkProps } from 'next/link';
import type React from 'react';
import type { AnyIconName } from '@workspace/ui/lib/icons/types';

// nav-menu-item types
export interface NavItemProperties extends React.HTMLAttributes<HTMLElement> {
  links: NavLink[];
  isMobile?: boolean;
}

export interface ListItemProperties extends LinkProps {
  title: string;
  className?: string;
  children?: React.ReactNode;
}

// pwa-dock-nav types
export type DockItem = {
  name: string;
  url: string;
  icon: AnyIconName;
  id?: string;
};

export type DockLinkVariant = 'dock' | 'drawer';

export type DockLinkProps = {
  item: DockItem;
  pathname: string;
  variant?: DockLinkVariant;
  className?: string;
  onNavigate?: () => void;
};
