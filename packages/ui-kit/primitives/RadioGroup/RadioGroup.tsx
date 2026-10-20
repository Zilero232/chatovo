'use client';

import { Radio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { clsx } from 'clsx';

import type { RadioGroupItemProps, RadioGroupProps } from './RadioGroup.types';

import s from './RadioGroup.module.scss';

const RadioGroup = ({ className, onValueChange, ...props }: RadioGroupProps) => (
  <BaseRadioGroup
    className={clsx(s.root, className)}
    data-slot='radio-group'
    onValueChange={onValueChange}
    {...props}
  />
);

const RadioGroupItem = ({ className, ...props }: RadioGroupItemProps) => (
  <Radio.Root className={clsx(s.item, className)} data-slot='radio-group-item' {...props}>
    <Radio.Indicator className={s.indicator}>
      <span className={s.dot} />
    </Radio.Indicator>
  </Radio.Root>
);

export { RadioGroup, RadioGroupItem };
