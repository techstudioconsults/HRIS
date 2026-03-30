import { FC, HtmlHTMLAttributes, ReactNode } from 'react';
import { cn } from '@workspace/ui/lib/utils';

interface WrapperProperties extends HtmlHTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  children?: ReactNode;
}

export const Wrapper: FC<WrapperProperties> = ({
  width = `max-w-[1280px]`,
  height = `h-full`,
  children,
  className,
  ...rest
}) => {
  return (
    <section
      {...rest}
      className={cn(
        `mx-auto w-full ${width} ${height}`,
        'my-[clamp(1rem,40vw,4rem)] flex flex-col gap-[clamp(1rem,4vw,3rem)] ' +
          'px-4 py-0 md:px-6 lg:my-[clamp(1rem,6vw,6rem)] xl:px-0',
        className
      )}
    >
      {children}
    </section>
  );
};
