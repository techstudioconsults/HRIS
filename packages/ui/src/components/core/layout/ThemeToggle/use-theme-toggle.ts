'use client'


import { useTheme } from 'next-themes'
import * as React from 'react'

export function useModeToggle() {
  const { setTheme, resolvedTheme } = useTheme()

  const toggleTheme = React.useCallback(() => {
    console.log('Toggling theme from', resolvedTheme)
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  return {
    toggleTheme,
    mode: resolvedTheme,
  }
}
