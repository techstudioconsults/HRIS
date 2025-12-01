import { cn } from '@workspace/ui/lib/utils'
import { FC, HtmlHTMLAttributes, ReactNode } from 'react'

interface WrapperProperties extends HtmlHTMLAttributes<HTMLDivElement> {
  width?: string
  height?: string
  children?: ReactNode
}

export const Wrapper: FC<WrapperProperties> = ({
  width = 'w-full',
  height,
  children,
  className,
  ...rest
}) => {
  return (
    <section
      {...rest}
      className={cn(`mx-auto ${width} ${height} px-4`, className)}
    >
      {children}
    </section>
  )
}
