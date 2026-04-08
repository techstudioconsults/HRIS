'use client';

import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { FC } from 'react';

import { cn } from '@workspace/ui/lib/utils';

export const Footer: FC = () => {
  return (
    <footer
      className={cn(
        `cc-border-u safe-area-bottom safe-area-x fixed bottom-0 z-10 w-full pl-4`
      )}
      role="footer"
    >
      <section className="flex w-full items-center justify-between">
        <div className={`flex items-center gap-4`}>
          <p>Find me in:</p>
          <div>
            <MainButton
              icon={<Icon name="Home" size={18} />}
              isIconOnly
              size={'icon'}
              className={`h-12 w-12`}
            />
            <MainButton
              icon={<Icon name="Home" size={18} />}
              isIconOnly
              size={'icon'}
              className={`h-12 w-12`}
            />
            <MainButton
              icon={<Icon name="Home" size={18} />}
              isIconOnly
              size={'icon'}
              className={`h-12 w-12`}
            />
          </div>
        </div>
        <div className={`hidden lg:block`}>
          <MainButton variant={`ghost`}>
            @Kinxlo <Icon name="Command" size={16} />
          </MainButton>
        </div>
      </section>
    </footer>
  );
};
