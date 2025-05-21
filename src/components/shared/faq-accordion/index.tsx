/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect, useState, useTransition } from "react";

export const FaqAccordion = ({ service }: { service: any }) => {
  const [isPending, startTransition] = useTransition();
  const [FAQ, setFAQ] = useState<any[]>([]);

  useEffect(() => {
    const fetchProductData = async () => {
      startTransition(async () => {
        const response = await service.getFAQ();
        if (response) {
          setFAQ(response.data);
        }
      });
    };

    fetchProductData();
  }, [service]);

  if (isPending) {
    return null;
  }

  if (!FAQ || FAQ.length === 0) {
    return null;
  }

  return (
    <Accordion type="single" collapsible className="w-full max-w-3xl">
      {FAQ.map((item) => (
        <AccordionItem className="border-bottom" key={item.id} value={item.id}>
          <AccordionTrigger className="text-left text-xs lg:text-lg">{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
