'use client';

import { clsx } from 'clsx';

import type { LabelProps } from './Label.types';

import s from './Label.module.scss';

const Label = ({ className, ...props }: LabelProps) => (
  // eslint-disable-next-line siberiacancode-jsx-a11y/label-has-associated-control -- htmlFor is supplied by consumers through props
  <label className={clsx(s.root, className)} data-slot='label' {...props} />
);

export { Label };
