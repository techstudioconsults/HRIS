/**
 * Chart color palette — values mirror the CSS token definitions in variables.css.
 * Use these constants anywhere a chart library requires a raw color string
 * (e.g. Recharts SVG attributes that don't accept CSS custom properties).
 *
 * For components using shadcn/ui ChartConfig, prefer `var(--chart-N)` directly.
 */
export const CHART_COLORS = {
  /** --chart-1  blue */
  blue: 'oklch(62% 0.18 256)',
  /** --chart-2  purple */
  purple: 'oklch(52% 0.24 282)',
  /** --chart-3  mint green */
  green: 'oklch(82% 0.1 152)',
  /** --chart-4  warm amber */
  amber: 'oklch(88% 0.1 75)',
  /** --sidebar-bg  dark navy */
  navy: 'oklch(28% 0.12 265)',
  /** --gray-75  grid lines */
  grid: 'oklch(87.5% 0.015 260)',
  /** --white */
  white: 'oklch(100% 0 0)',
} as const;
