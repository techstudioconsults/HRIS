'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@workspace/ui/components/accordion';
import { cn } from '@workspace/ui/lib/utils';

export type FaqAccordionItem = {
  id: string;
  question: string;
  answer: string;
};

interface FaqAccordionProps {
  items: FaqAccordionItem[];
  defaultValue?: string;
  className?: string;
}

export const FaqAccordion = ({
  items,
  defaultValue,
  className,
}: FaqAccordionProps) => {
  if (!items.length) return null;

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultValue ?? items[0]?.id}
      className={cn('w-full space-y-3', className)}
    >
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          value={item.id}
          className="rounded-lg border-0 bg-primary/10 px-4 sm:px-5 data-[state=open]:bg-[#EEF1F5]"
        >
          <AccordionTrigger
            className="py-3.5 text-left text-sm font-medium
          text-zinc-800 no-underline hover:no-underline sm:py-4 sm:text-base
           [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:rounded-[4px]
            [&>svg]:bg-primary/10 [&>svg]:p-px [&>svg]:text-primary"
          >
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="pb-3.5 text-sm leading-6 text-zinc-600 sm:pb-4">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
