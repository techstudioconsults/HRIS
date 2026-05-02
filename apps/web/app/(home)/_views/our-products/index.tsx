'use client';

import dynamic from 'next/dynamic';

import { OurProductsSectionHeader } from './_components/section-header';
import { productCardsBottomRow, productCardsTopRow } from './constants';
import { OurProductCard } from './_components/product-card';
import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';
const CardTransitions = dynamic(
  () =>
    import('../../../../components/micro-interactions/card-transitions').then(
      (module) => module.CardTransitions
    ),
  { ssr: false }
);

export const OurProducts = () => {
  return (
    <>
      <CardTransitions />
      <section data-home-products className="bg-background">
        <Wrapper>
          <OurProductsSectionHeader />
          <div className="space-y-7">
            <div className="grid gap-9.25 md:grid-cols-2 xl:grid-cols-3">
              <OurProductCard card={productCardsTopRow[0]} />
              <OurProductCard card={productCardsTopRow[1]} />
              <OurProductCard card={productCardsTopRow[2]} />
            </div>

            <div className="grid gap-9.25 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <OurProductCard card={productCardsBottomRow[0]} />
              </div>

              <div className="lg:col-span-7">
                <OurProductCard card={productCardsBottomRow[1]} isWide />
              </div>
            </div>
          </div>
        </Wrapper>
      </section>
    </>
  );
};
