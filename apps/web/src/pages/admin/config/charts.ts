export const CHART_COLORS = {
  coral: 'var(--brand-coral)',
  sun: 'var(--brand-sun)',
  violet: 'var(--brand-violet)',
  mint: 'var(--brand-mint)'
} as const;

export type ChartColor = keyof typeof CHART_COLORS;

export const BREAKDOWN_COLORS: ChartColor[] = ['coral', 'sun', 'violet', 'mint'];

export const CHART_AXIS_TICK = { fill: 'currentColor', fontSize: 12 };

export const CHART_CURSOR_FILL = 'rgb(var(--tint) / 5%)';

export const CHART_CURSOR_STROKE = 'var(--border-strong)';

export const CHART_GRID_STROKE = 'var(--border)';
