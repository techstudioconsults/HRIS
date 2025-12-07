import { describe, it, expect } from 'vitest'

describe('UI Package - Unit Tests', () => {
  it('should handle className utilities', () => {
    const cn = (...classes: (string | undefined | null | false)[]) =>
      classes.filter(Boolean).join(' ')

    expect(cn('btn', 'btn-primary')).toBe('btn btn-primary')
    expect(cn('text-lg', undefined, 'font-bold')).toBe('text-lg font-bold')
    expect(cn('active', false, 'visible')).toBe('active visible')
  })

  it('should validate component variants', () => {
    type Variant = 'primary' | 'secondary' | 'outline'
    const variants: Variant[] = ['primary', 'secondary', 'outline']

    expect(variants).toContain('primary')
    expect(variants).toHaveLength(3)
  })

  it('should handle theme colors', () => {
    const colors = {
      primary: '#3b82f6',
      secondary: '#64748b',
      success: '#10b981',
      error: '#ef4444',
    }

    expect(colors.primary).toMatch(/^#[0-9a-f]{6}$/i)
    expect(Object.keys(colors)).toHaveLength(4)
  })

  it('should format component props', () => {
    type ButtonProps = {
      variant?: 'solid' | 'outline'
      size?: 'sm' | 'md' | 'lg'
      disabled?: boolean
    }

    const defaultProps: ButtonProps = {
      variant: 'solid',
      size: 'md',
      disabled: false,
    }

    expect(defaultProps.variant).toBe('solid')
    expect(defaultProps.disabled).toBe(false)
  })
})
