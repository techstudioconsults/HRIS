import React from 'react';
import { TestimonialCarousel } from '@workspace/ui/lib';
import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';
import { TestimonialSectionHeader } from './_components/section-header';
import { testimonials } from './constants';

export const Testimonial = () => {
  return (
    <Wrapper className="gap-8">
      <TestimonialSectionHeader />
      <TestimonialCarousel items={testimonials} />
    </Wrapper>
  );
};
