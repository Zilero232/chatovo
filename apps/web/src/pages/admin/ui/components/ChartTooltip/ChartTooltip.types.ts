export type ChartTooltipProps = {
  label: string;
  active?: boolean;
  payload?: { value?: number; payload?: { date?: string } }[];
};
