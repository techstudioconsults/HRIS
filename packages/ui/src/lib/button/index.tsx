'use client';

import { LucideLoader, LucidePlus } from 'lucide-react';
import Link from 'next/link';
import {
  cloneElement,
  forwardRef,
  MouseEventHandler,
  ReactElement,
  ReactNode,
  useState,
} from 'react';
import { cn } from '../utils';
import { Button } from '@workspace/ui/components/button';

type Variant =
  | 'default'
  | 'primary'
  | 'primaryOutline'
  | 'destructive'
  | 'destructiveOutline'
  | 'subtle'
  | 'loading'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
  | 'accentOutline';
type Size = 'default' | 'sm' | 'lg' | 'xl' | '2xl' | 'link' | 'icon' | 'circle';

interface ButtonProperties extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: 'submit' | 'button' | 'reset';
  /** Specifies the button style variant */
  variant?: Variant;
  /** Specifies the size of the button */
  size?: Size;
  /** Icon to be displayed inside the button */
  icon?: ReactNode | ReactElement;
  /** Text or elements to be displayed inside the button */
  children?: ReactNode;
  /** Indicates if the button is in a loading state */
  isLoading?: boolean;
  /** Indicates if the button is icon only */
  isIconOnly?: boolean;
  /** Indicates if the left icon is visible */
  isLeftIconVisible?: boolean;
  /** Indicates if the right icon is visible */
  isRightIconVisible?: boolean;
  /** Disables the button if true */
  isDisabled?: boolean;
  /** Accessibility label for the button */
  ariaLabel?: string;
  /** Href to link button to a URL or route */
  href?: string;
  /** Class for custom styling */
  className?: string;
  /** Click event handler for the button */
  onClick?: MouseEventHandler<HTMLButtonElement>;

  isExternal?: boolean | false;
}

/**
 * CustomButton component to render a button with various styles and states.
 *
 * @param {ButtonProps} props - Properties to configure the button.
 * @returns {JSX.Element} The rendered button component.
 */
const MainButton = forwardRef<HTMLButtonElement, ButtonProperties>(
  (
    {
      type = 'button',
      variant,
      size = 'lg',
      children,
      isLoading = false,
      isLeftIconVisible = false,
      isRightIconVisible = false,
      icon,
      isDisabled = false,
      isIconOnly = false,
      ariaLabel,
      href,
      className,
      onClick,
      isExternal,
      ...properties
    },
    reference
  ) => {
    const [, setIsPressed] = useState(false);

    const modifiedIcon = icon ? (
      cloneElement(
        icon as ReactElement,
        {
          className: 'w-[1rem] h-[1rem] shadow-none',
          'data-testid': 'icon',
        } as React.HTMLAttributes<HTMLElement>
      )
    ) : (
      <LucidePlus className="h-[1rem] w-[1rem]" data-testid="icon" />
    );

    const buttonContent = (
      <>
        {isLeftIconVisible && !isLoading && modifiedIcon}
        {isLoading && (
          <LucideLoader
            className="h-[1rem] w-[1rem] animate-spin"
            data-testid="loading-spinner"
          />
        )}
        {isIconOnly && !isLoading && modifiedIcon}
        {!isIconOnly && children}
        {!isIconOnly && !children && isLoading && 'Loading'}
        {isRightIconVisible && !isLoading && modifiedIcon}
      </>
    );

    const buttonClasses = cn(
      'transition-all duration-300 ease-in-out rounded-md',
      isDisabled && '',
      className
    );

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!isDisabled) {
        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 200);
      }
      onClick?.(event);
    };

    if (href) {
      const external = /^https?:\/\//.test(href) || isExternal;

      if (external) {
        return (
          <a
            href={cn(
              process.env.NODE_ENV === `production`
                ? `https://dashboard.techstudiohr.com${href}`
                : `http://localhost:3000${href}`
            )}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ariaLabel}
          >
            <Button
              type={type}
              variant={variant}
              size={size}
              disabled={isDisabled}
              aria-label={ariaLabel}
              className={buttonClasses}
              onClick={handleClick}
              role="button"
              ref={reference}
            >
              {buttonContent}
            </Button>
          </a>
        );
      }

      return (
        <Link href={isDisabled ? '' : href} passHref aria-label={ariaLabel}>
          <Button
            variant={variant}
            size={size}
            disabled={isDisabled}
            aria-label={ariaLabel}
            className={buttonClasses}
            onClick={handleClick}
            role="button"
            ref={reference}
          >
            {buttonContent}
          </Button>
        </Link>
      );
    }

    return (
      <Button
        type={type}
        variant={variant}
        size={size}
        disabled={isDisabled}
        aria-label={ariaLabel}
        className={buttonClasses}
        onClick={handleClick}
        role="button"
        ref={reference}
        {...properties}
      >
        {buttonContent}
      </Button>
    );
  }
);
MainButton.displayName = 'MainButton'; // This is useful for debugging in React DevTools

export { MainButton };
