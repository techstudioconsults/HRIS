'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@workspace/ui/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@workspace/ui/components/accordion';
import { useState, useEffect } from 'react';
import { HELP_CENTER_DATA } from '../../constants/help-center';

export const HelpSidebar = () => {
  const pathname = usePathname();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  useEffect(() => {
    const activeCategory = HELP_CENTER_DATA.find((category) =>
      category.articles.some(
        (article) =>
          pathname === `/help-center/${category.slug}/${article.slug}`
      )
    );
    if (activeCategory && !expandedCategories.includes(activeCategory.slug)) {
      setExpandedCategories((prev) => [
        ...new Set([...prev, activeCategory.slug]),
      ]);
    }
  }, [pathname]);

  return (
    <aside className="w-full lg:col-span-4 lg:self-start">
      <nav
        aria-label="Help center navigation"
        className="w-full rounded-2xl border-black/5 bg-white/90 lg:p-3 backdrop-blur-sm lg:sticky
         lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto xl:top-32"
      >
        {/*<div className="mb-3 px-2">*/}
        {/*  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/70">*/}
        {/*    Browse help topics*/}
        {/*  </p>*/}
        {/*  <p className="mt-1 text-sm text-[#64748B]">*/}
        {/*    Keep this menu open while you read and jump between guides faster.*/}
        {/*  </p>*/}
        {/*</div>*/}
        <Accordion
          type="multiple"
          value={expandedCategories}
          onValueChange={setExpandedCategories}
          className="flex flex-col gap-1"
        >
          {HELP_CENTER_DATA.map((category) => (
            <AccordionItem
              key={category.slug}
              value={category.slug}
              className="overflow-hidden rounded-xl border-0 px-3 transition-colors"
            >
              <AccordionTrigger className="py-3 text-left text-[14px] font-semibold text-zinc-800 no-underline hover:text-primary hover:no-underline sm:text-base [&>svg]:size-5 [&>svg]:shrink-0 [&>svg]:rounded-sm [&>svg]:bg-primary/10 [&>svg]:p-px [&>svg]:text-primary">
                {category.title}
              </AccordionTrigger>

              {category.articles.length > 0 && (
                <AccordionContent className="pb-3 text-sm leading-6 text-zinc-600">
                  <div className="flex flex-col gap-1 pt-1">
                    {category.articles.map((article) => {
                      const href = `/help-center/${category.slug}/${article.slug}`;
                      const isActive = pathname === href;
                      return (
                        <Link
                          key={article.slug}
                          href={isActive ? '#' : href}
                          aria-current={isActive ? 'page' : undefined}
                          className={cn(
                            'rounded-lg px-3 py-2 lg:text-[15px] font-medium transition-all ' +
                              'duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                            isActive
                              ? 'bg-blue-50 text-primary'
                              : 'text-[#64748B] hover:bg-blue-50/60 hover:text-primary'
                          )}
                        >
                          {article.title}
                        </Link>
                      );
                    })}
                  </div>
                </AccordionContent>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </nav>
    </aside>
  );
};
