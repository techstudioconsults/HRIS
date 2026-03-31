import type { ProductCardItem } from '../constants';
import { cn } from '@workspace/ui/lib/utils';
import { Suspense } from 'react';
import { SuspenseLoading } from '@workspace/ui/lib/loading';

interface ProductCardProperties {
  card: ProductCardItem;
  isWide?: boolean;
}

export const OurProductCard = ({
  card,
  isWide = false,
}: ProductCardProperties) => {
  const { ImageSrc } = card;

  return (
    <article
      data-product-card
      className="relative overflow-hidden rounded-[13px] border border-zinc-200/80 bg-background"
    >
      <div className="space-y-3 px-6 pb-6 pt-6 text-center lg:text-left">
        <h5 className="text-foreground font-semibold">{card.title}</h5>
        <p className="tracking-[-0.02em] text-sm text-zinc-500">
          {card.description}
        </p>
      </div>
      <div
        className={cn(
          'relative px-3 lg:px-6 pb-3',
          isWide ? 'h-80 md:h-[330px] lg:h-84' : 'h-[300px] md:h-80'
        )}
      >
        <div
          data-speed={1.1}
          data-product-animation-target={card.animationTarget}
          className="relative size-full overflow-hidden rounded-xl"
        >
          <Suspense fallback={<SuspenseLoading />}>
            <ImageSrc />
          </Suspense>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background to-transparent" />
      </div>
    </article>
  );
};
