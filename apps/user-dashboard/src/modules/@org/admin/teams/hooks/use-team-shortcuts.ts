'use client';

import { useActiveTarget } from '@/context/active-target';
import { useShortcuts } from '@workspace/ui/hooks';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/routes/routes';

export function useTeamShortcuts() {
  const router = useRouter();
  const { entity: activeTeam } = useActiveTarget<Team>();

  useShortcuts([
    {
      combo: 'v',
      when: () => !!activeTeam,
      run: () => {
        if (!activeTeam) return;
        router.push(routes.admin.teams.detail(activeTeam.id));
      },
    },
    {
      combo: 'e',
      when: () => !!activeTeam,
      run: () => {
        if (!activeTeam) return;
        router.push(`/admin/teams/${activeTeam.id}/edit`);
      },
    },
    {
      combo: 'backspace',
      when: () => !!activeTeam,
      run: () => {
        if (!activeTeam) return;
        window.dispatchEvent(new CustomEvent('team:request-delete'));
      },
    },
    {
      combo: 'delete',
      when: () => !!activeTeam,
      run: () => {
        if (!activeTeam) return;
        window.dispatchEvent(new CustomEvent('team:request-delete'));
      },
    },
  ]);
}
