'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { cn } from '@workspace/ui/lib/utils';

export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      className={cn(
        'fixed bottom-8 right-6 z-50 flex size-11 items-center justify-center rounded-full',
        'bg-primary text-white shadow-lg',
        'hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        'transition-all duration-300',
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      )}
    >
      <Icon name="ChevronUp" size={20} />
    </button>
  );
};
