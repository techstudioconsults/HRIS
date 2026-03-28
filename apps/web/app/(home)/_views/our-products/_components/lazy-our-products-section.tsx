'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { OurProductsPlaceholder } from '../../../_components/our-products-placeholder';

const LazyOurProducts = dynamic(
  () => import('../index').then((module) => module.OurProducts),
  {
    ssr: false,
    loading: () => <OurProductsPlaceholder />,
  }
);

export const OurProducts = () => {
  return (
    <Suspense>
      <LazyOurProducts />
    </Suspense>
  );
};
