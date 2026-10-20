import { Text } from '@chatovo/ui-kit';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import type { BreakdownChartProps } from './BreakdownChart.types';

import {
  BREAKDOWN_COLORS,
  CHART_AXIS_TICK,
  CHART_COLORS,
  CHART_CURSOR_FILL,
  CHART_GRID_STROKE
} from '../../../config';
import { ChartTooltip } from '../ChartTooltip/ChartTooltip';

import s from './BreakdownChart.module.scss';

export const BreakdownChart = ({ title, hint, slices }: BreakdownChartProps) => (
  <section className={s.root}>
    <header className={s.head}>
      <Text size='sm' weight='semibold'>
        {title}
      </Text>
      <Text size='xs' tone='muted'>
        {hint}
      </Text>
    </header>

    <div className={s.chart}>
      <ResponsiveContainer height='100%' width='100%'>
        <BarChart data={slices} layout='vertical' margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid horizontal={false} stroke={CHART_GRID_STROKE} strokeDasharray='3 3' />
          <XAxis
            allowDecimals={false}
            axisLine={false}
            tick={CHART_AXIS_TICK}
            tickLine={false}
            type='number'
          />
          <YAxis
            axisLine={false}
            dataKey='label'
            tick={CHART_AXIS_TICK}
            tickLine={false}
            type='category'
            width={116}
          />
          <Tooltip content={<ChartTooltip label={title} />} cursor={{ fill: CHART_CURSOR_FILL }} />
          <Bar dataKey='value' radius={[0, 8, 8, 0]}>
            {slices.map((slice, index) => (
              <Cell
                key={slice.label}
                fill={CHART_COLORS[BREAKDOWN_COLORS[index % BREAKDOWN_COLORS.length]]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </section>
);
