'use client';

import { useActiveTarget } from '@/context/active-target';
import { useRouter } from 'next/navigation';
import { useShortcuts } from '@workspace/ui/hooks';
import { routes } from '@/lib/routes/routes';

export function useTeamShortcuts() {
  const router = useRouter();
  const { entity: activeTeam } = useActiveTarget<Team>();

  useShortcuts([
    {
      combo: 'mod+v',
      when: () => !!activeTeam,
      run: () => {
        if (!activeTeam) return;
        router.push(routes.admin.teams.detail(activeTeam.id));
      },
    },
    {
      combo: 'mod+e',
      when: () => !!activeTeam,
      run: () => {
        if (!activeTeam) return;
        router.push(`/admin/teams/${activeTeam.id}/edit`);
      },
    },
    {
      combo: 'mod+backspace',
      when: () => !!activeTeam,
      run: () => {
        if (!activeTeam) return;
        window.dispatchEvent(new CustomEvent('team:request-delete'));
      },
    },
    {
      combo: 'mod+delete',
      when: () => !!activeTeam,
      run: () => {
        if (!activeTeam) return;
        window.dispatchEvent(new CustomEvent('team:request-delete'));
      },
    },
  ]);
}
