import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap shadow text-sm cursor-pointer font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-default text-default-foreground shadow-none',
        primary:
          'bg-primary text-primary-foreground hover:bg-primary-75 hover:text-primary',
        primaryOutline:
          'text-primary border border-primary hover:bg-primary-75 hover:border-primary-75 hover:text-primary shadow-none',
        accent: 'bg-accent text-accent-foreground',
        accentOutline:
          'text-accent border border-accent hover:bg-accent/10 shadow-none',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive-hover',
        destructiveOutline:
          'text-destructive border border-destructive hover:bg-destructive/10 shadow-none',
        subtle: 'bg-subtle text-subtle-foreground hover:bg-subtle-hover',
        loading:
          'bg-loading text-loading-foreground hover:bg-loading-hover opacity-50 hover:opacity-100 transition-opacity duration-500 ease-out',
        outline:
          'text-gray-500 border border-border hover:bg-primary-75 hover:text-primary shadow-none',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'hover:bg-primary-75 hover:text-primary text-primary shadow-none',
        link: 'text-link underline-offset-4 hover:underline shadow-none',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8  px-3 text-xs',
        lg: 'h-10  px-8',
        xl: 'h-12  px-8',
        '2xl': 'h-14  px-8',
        link: 'h-9 px-0 py-2',
        icon: 'px-2 py-2',
        circle: 'px-3 py-3 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProperties
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProperties>(
  ({ className, variant, size, asChild = false, ...properties }, reference) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={reference}
        {...properties}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
