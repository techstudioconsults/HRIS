import type { TeamCardItem } from '../constants';

interface TeamCardProperties {
  card: TeamCardItem;
}

export const TeamCard = ({ card }: TeamCardProperties) => {
  return (
    <article className="rounded-[11px] border border-zinc-300/40 bg-background p-7 shadow-[0px_1px_2px_rgba(0,0,0,0.03)]">
      <div className="flex flex-col gap-10">
        <div className="size-[54px]">{card.icon}</div>
        <div className="space-y-2.5">
          <h3 className="text-2xl font-semibold leading-[1.36] text-zinc-900 lg:text-[26px]">
            {card.title}
          </h3>
          <p className="text-base leading-[1.32] tracking-[-0.02em] text-zinc-600 lg:text-[18px]">
            {card.description}
          </p>
        </div>
      </div>
    </article>
  );
};
