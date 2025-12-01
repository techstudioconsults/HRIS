"use client";

import { useActiveTarget } from "@/context/active-target";
import { useShortcuts } from "@workspace/ui/hooks";
import { useRouter } from "next/navigation";

export function useTeamShortcuts() {
  const router = useRouter();
  const { entity: activeTeam } = useActiveTarget<Team>();

  useShortcuts([
    {
      combo: "mod+v",
      when: () => !!activeTeam,
      run: () => {
        if (!activeTeam) return;
        router.push(`/admin/teams/${activeTeam.id}`);
      },
    },
    {
      combo: "mod+e",
      when: () => !!activeTeam,
      run: () => {
        if (!activeTeam) return;
        router.push(`/admin/teams/${activeTeam.id}/edit`);
      },
    },
    {
      combo: "mod+backspace",
      when: () => !!activeTeam,
      run: () => {
        if (!activeTeam) return;
        window.dispatchEvent(new CustomEvent("team:request-delete"));
      },
    },
    {
      combo: "mod+delete",
      when: () => !!activeTeam,
      run: () => {
        if (!activeTeam) return;
        window.dispatchEvent(new CustomEvent("team:request-delete"));
      },
    },
  ]);
}
