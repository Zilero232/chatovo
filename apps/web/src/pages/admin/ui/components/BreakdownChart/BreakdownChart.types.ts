export type BreakdownSlice = {
  label: string;
  value: number;
};

export type BreakdownChartProps = {
  title: string;
  hint: string;
  slices: BreakdownSlice[];
};
