import type { ChartColor } from '../../../config';

export type TrendPoint = {
  date: string;
  count: number;
};

export type TrendChartProps = {
  title: string;
  hint: string;
  points: TrendPoint[];
  color?: ChartColor;
};
