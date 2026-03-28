'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { OurProductsPlaceholder } from './our-products-placeholder';

const OurProducts = dynamic(
  () => import('../_views/our-products').then((module) => module.OurProducts),
  {
    ssr: false,
    loading: () => <OurProductsPlaceholder />,
  }
);

export const LazyOurProducts = () => {
  return (
    <Suspense fallback={<OurProductsPlaceholder />}>
      <OurProducts />
    </Suspense>
  );
};
