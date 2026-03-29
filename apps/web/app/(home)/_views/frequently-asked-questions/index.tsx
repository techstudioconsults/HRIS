import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';
import { Emphasis } from '../../_components/Emphasis';
import { FaqAccordion, MainButton } from '@workspace/ui/lib';
import React from 'react';
import Tag from '../../_components/tag';
import { faqItems } from './constants';

export const FAQs = () => {
  return (
    <Wrapper>
      <div className="flex justify-center flex-col-reverse md:flex-row items-center gap-5 lg:gap-10">
        <div className="flex-1 space-y-5">
          <Tag content="FAQs" />
          <header className={'space-y-4'}>
            <h2
              className=" text-3xl font-semibold tracking-[-0.02em] text-zinc-800 md:text-4xl xl:text-[54px]
       lg:leading-[1.2]"
            >
              Frequently Asked <Emphasis>Questions</Emphasis>
            </h2>
            <p className="text-sm md:text-[15px] text-balance leading-normal text-zinc-500 lg:text-lg">
              Learn more about Techstudio HR. If you can’t find what you’re
              looking for, our support team is always here to help
            </p>
          </header>
          <div
            className="mx-auto flex w-full max-w-md flex-col items-center
          gap-3 sm:max-w-none sm:flex-row sm:gap-4 lg:gap-5"
          >
            <MainButton
              variant={'primaryOutline'}
              className="w-full bg-background sm:w-auto"
            >
              Contact Support
            </MainButton>
          </div>
        </div>
        <div className="flex-1">
          <FaqAccordion items={faqItems} />
        </div>
      </div>
    </Wrapper>
  );
};
