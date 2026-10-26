'use client';

import { Slider as BaseSlider } from '@base-ui/react/slider';
import { clsx } from 'clsx';

import type { SliderProps } from './Slider.types';

import s from './Slider.module.scss';

const Slider = ({
  className,
  max,
  min,
  thumbLabel,
  tone = 'accent',
  getAriaValueText,
  onValueChange,
  ...props
}: SliderProps) => (
  <BaseSlider.Root
    className={clsx(s.root, className)}
    data-slot='slider'
    data-tone={tone}
    max={max}
    min={min}
    onValueChange={onValueChange}
    {...props}
  >
    <BaseSlider.Control className={s.control} data-slot='slider-control'>
      <BaseSlider.Track className={s.track} data-slot='slider-track'>
        <BaseSlider.Indicator className={s.indicator} data-slot='slider-range' />
        <BaseSlider.Thumb
          aria-label={thumbLabel}
          className={s.thumb}
          data-slot='slider-thumb'
          getAriaValueText={getAriaValueText}
        />
      </BaseSlider.Track>
    </BaseSlider.Control>
  </BaseSlider.Root>
);

export { Slider };
