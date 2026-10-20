import type { Slider } from '@base-ui/react/slider';
import type { ComponentProps } from 'react';

export type SliderProps = Omit<
  ComponentProps<typeof Slider.Root>,
  'className' | 'onValueChange'
> & {
  className?: string;
  thumbLabel?: string;
  getAriaValueText?: (formattedValue: string, value: number, index: number) => string;
  onValueChange?: (value: number | readonly number[]) => void;
};
