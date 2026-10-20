import { clsx } from 'clsx';

import type { BrandMarkProps } from './BrandMark.types';

import { LogoMark } from '../../icons/LogoMark';

import s from './BrandMark.module.scss';

export const BrandMark = ({ className, glow = false, size = 28 }: BrandMarkProps) => (
  <LogoMark
    withPlaque
    className={clsx(s.root, { [s.glow]: glow }, className)}
    data-slot='brand-mark'
    size={size}
  />
);
