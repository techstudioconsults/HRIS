'use client';

import { BuiltForAllTeamsSectionHeader } from './_components/section-header';
import dynamic from 'next/dynamic';
import { SuspenseLoading } from '@workspace/ui/lib';
import { teamCards } from './constants';

const TeamCard = dynamic(
  () => import('./_components/team-card').then((module) => module.TeamCard),
  {
    ssr: false,
    loading: () => <SuspenseLoading />,
  }
);

export const BuiltForAllTeams = () => {
  return (
    <section
      data-home-built-for-all-teams
      className="bg-primary/5 px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-14 lg:gap-[75px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <BuiltForAllTeamsSectionHeader />
          <p className="max-w-[507px] text-balance text-base leading-[1.4] tracking-[-0.02em] text-zinc-500 lg:text-lg">
            Whether you&apos;re managing 10 employees or scaling to hundreds,
            Techstudio HR grows with you.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-11">
          {teamCards.map((card) => (
            <TeamCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
};
