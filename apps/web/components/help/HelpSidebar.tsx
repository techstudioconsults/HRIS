'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@workspace/ui/lib/utils';
import { LucideChevronDown, LucideChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { HELP_CENTER_DATA } from '../../constants/help-center';

export const HelpSidebar = () => {
  const pathname = usePathname();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (slug: string) => {
    setExpandedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  };

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
    <aside className="w-full md:w-[300px] flex-shrink-0">
      <nav className="flex flex-col gap-2 sticky top-32">
        {HELP_CENTER_DATA.map((category) => {
          const isExpanded = expandedCategories.includes(category.slug);
          return (
            <div key={category.slug} className="flex flex-col gap-1">
              <button
                onClick={() => toggleCategory(category.slug)}
                className="flex items-center justify-between w-full py-2 px-2 text-left font-medium text-xl text-[#1E293B] hover:bg-gray-50 rounded-md group"
              >
                <span>{category.title}</span>
                {category.articles.length > 0 &&
                  (isExpanded ? (
                    <LucideChevronUp size={18} className="text-blue-400" />
                  ) : (
                    <LucideChevronDown
                      size={18}
                      className="text-gray-400 group-hover:text-blue-400"
                    />
                  ))}
              </button>

              {isExpanded && category.articles.length > 0 && (
                <div className="flex flex-col gap-1 ">
                  {category.articles.map((article) => {
                    const href = `/help-center/${category.slug}/${article.slug}`;
                    const isActive = pathname === href;
                    return (
                      <Link
                        key={article.slug}
                        href={isActive ? '#' : href}
                        className={cn(
                          'py-2 px-3 rounded-md text-[15px] font-medium transition-all duration-200',
                          isActive
                            ? 'bg-blue-50 text-[#0066F3]'
                            : 'text-[#64748B] hover:text-[#0066F3] hover:bg-blue-50/50'
                        )}
                      >
                        {article.title}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};
