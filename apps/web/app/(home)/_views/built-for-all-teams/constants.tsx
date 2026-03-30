import type { ReactNode } from 'react';
import StartupsIcon from '~/images/home/built-for-teams-startups-icon.svg';
import AgenciesIcon from '~/images/home/built-for-teams-agencies-icon.svg';
import EnterprisesIcon from '~/images/home/built-for-teams-enterprises-icon.svg';

export interface TeamCardItem {
  title: string;
  description: string;
  icon: ReactNode;
}

export const teamCards: TeamCardItem[] = [
  {
    title: 'Startups',
    description: 'Simple HR administration operations without complexity.',
    icon: <StartupsIcon />,
  },
  {
    title: 'Agencies',
    description: 'Track distributed teams and automate admin work.',
    icon: <AgenciesIcon />,
  },
  {
    title: 'Enterprises',
    description: 'Advanced roles, permissions, and organizational control.',
    icon: <EnterprisesIcon />,
  },
];
