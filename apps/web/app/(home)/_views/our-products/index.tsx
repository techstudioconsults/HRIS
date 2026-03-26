import { OurProductCard } from './_components/product-card';
import { OurProductsSectionHeader } from './_components/section-header';
import { productCardsBottomRow, productCardsTopRow } from './constants';

export const OurProducts = () => {
  return (
    <section data-home-products className="bg-background px-4 pb-20 pt-20 sm:px-6 lg:px-8 lg:pb-28">
      <div className="mx-auto flex w-full max-w-[1226px] flex-col gap-10 lg:gap-12">
        <OurProductsSectionHeader />
        <div className="space-y-7">
          <div className="grid gap-[37px] md:grid-cols-2 xl:grid-cols-3">
            {productCardsTopRow.map((card) => (
              <OurProductCard key={card.title} card={card} />
            ))}
          </div>

          <div className="grid gap-[37px] lg:grid-cols-12">
            <div className="lg:col-span-5">
              <OurProductCard card={productCardsBottomRow[0]} />
            </div>

            <div className="lg:col-span-7">
              <OurProductCard card={productCardsBottomRow[1]} isWide />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
