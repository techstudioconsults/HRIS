import Image from 'next/image';

import type { ProductCardItem } from '../constants';

interface ProductCardProperties {
  card: ProductCardItem;
  isWide?: boolean;
}

export const OurProductCard = ({ card, isWide = false }: ProductCardProperties) => {
  return (
    <article className="relative overflow-hidden rounded-[13px] border border-zinc-200/80 bg-white">
      <div className="space-y-3 px-6 pb-6 pt-6">
        <h3 className="text-2xl font-semibold tracking-[-0.02em] text-zinc-800">{card.title}</h3>
        <p className="text-base tracking-[-0.02em] text-zinc-500">{card.description}</p>
      </div>

      <div className={`relative ${isWide ? 'h-80 md:h-[330px] lg:h-84' : 'h-[300px] md:h-80'} px-3 pb-3`}>
        <div className="relative h-full w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_9px_20px_rgba(189,189,189,0.1)]">
          <Image src={card.imageSrc} alt={card.imageAlt} fill className="object-cover object-top" />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-white to-transparent" />
      </div>
    </article>
  );
};
