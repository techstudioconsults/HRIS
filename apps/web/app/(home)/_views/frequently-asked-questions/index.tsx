'use client';

import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';
import { Emphasis } from '../../_components/Emphasis';
import { MainButton, SuspenseLoading } from '@workspace/ui/lib';
import React from 'react';
import Tag from '../../_components/tag';
import { faqItems } from './constants';
import dynamic from 'next/dynamic';

const FaqAccordion = dynamic(
  () => import('@workspace/ui/lib').then((module) => module.FaqAccordion),
  {
    ssr: false,
    loading: () => <SuspenseLoading />,
  }
);

export const FAQs = () => {
  return (
    <Wrapper>
      <div className="flex flex-col items-start gap-8 lg:flex-row lg:gap-14 xl:gap-20">
        <div className="w-full flex-1 space-y-5">
          <Tag content="FAQs" />
          <header>
            <h2
              data-header-text
              className="text-3xl font-semibold tracking-[-0.02em] text-zinc-800 sm:text-4xl lg:text-[40px] lg:leading-[1.2] xl:text-[48px]"
            >
              <span data-h1 className="inline-block">
                Frequently Asked
              </span>{' '}
            </h2>
            <h2
              data-header-text
              className="text-3xl font-semibold tracking-[-0.02em] text-zinc-800 sm:text-4xl lg:text-[40px] lg:leading-[1.2] xl:text-[48px]"
            >
              <span data-h1 className="inline-block">
                <Emphasis>Questions</Emphasis>
              </span>
            </h2>
          </header>
          <p className="text-sm leading-relaxed text-balance text-zinc-500 sm:text-base lg:text-[15px] xl:text-lg">
            Learn more about Techstudio HR. If you can&apos;t find what
            you&apos;re looking for, our support team is always here to help.
          </p>
          <MainButton
            variant="primaryOutline"
            className="w-full bg-background sm:w-auto"
          >
            Contact Support
          </MainButton>
        </div>
        <div className="w-full flex-1">
          <FaqAccordion items={faqItems} />
        </div>
      </div>
    </Wrapper>
  );
};
