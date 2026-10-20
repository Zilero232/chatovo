'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import { formatDay } from '@/shared/lib';
import { Text } from '@/ui-kit';

import type { TrendChartProps } from './TrendChart.types';

import {
  CHART_AXIS_TICK,
  CHART_COLORS,
  CHART_CURSOR_STROKE,
  CHART_GRID_STROKE
} from '../../../config';
import { sumTrendPoints } from '../../../lib';
import { ChartTooltip } from '../ChartTooltip/ChartTooltip';

import s from './TrendChart.module.scss';

export const TrendChart = ({ title, hint, points, color = 'coral' }: TrendChartProps) => {
  const stroke = CHART_COLORS[color];

  return (
    <section className={s.root}>
      <header className={s.head}>
        <div className={s.headText}>
          <Text size='sm' weight='semibold'>
            {title}
          </Text>
          <Text size='xs' tone='muted'>
            {hint}
          </Text>
        </div>

        <span className={s.total}>{sumTrendPoints(points).toLocaleString()}</span>
      </header>

      <div className={s.chart}>
        <ResponsiveContainer height='100%' width='100%'>
          <AreaChart data={points} margin={{ top: 4, right: 4, bottom: 0, left: -22 }}>
            <CartesianGrid stroke={CHART_GRID_STROKE} strokeDasharray='3 3' vertical={false} />
            <XAxis
              axisLine={false}
              dataKey='date'
              minTickGap={24}
              tick={CHART_AXIS_TICK}
              tickFormatter={formatDay}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tick={CHART_AXIS_TICK}
              tickLine={false}
              width={44}
            />
            <Tooltip
              content={<ChartTooltip label={title} />}
              cursor={{ stroke: CHART_CURSOR_STROKE }}
            />
            <Area
              dataKey='count'
              fill={stroke}
              fillOpacity={0.16}
              stroke={stroke}
              strokeWidth={2}
              type='monotone'
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
