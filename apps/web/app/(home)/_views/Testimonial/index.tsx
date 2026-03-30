'use client';

import React from 'react';
import { SuspenseLoading } from '@workspace/ui/lib';
import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';
import { TestimonialSectionHeader } from './_components/section-header';
import { testimonials } from './constants';
import dynamic from 'next/dynamic';
const TestimonialCarousel = dynamic(
  () =>
    import('@workspace/ui/lib').then((module) => module.TestimonialCarousel),
  {
    ssr: false,
    loading: () => <SuspenseLoading />,
  }
);

export const Testimonial = () => {
  return (
    <Wrapper className="gap-8">
      <TestimonialSectionHeader />
      <TestimonialCarousel items={testimonials} />
    </Wrapper>
  );
};
