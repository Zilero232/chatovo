import type { CSSProperties } from 'react';

import { clsx } from 'clsx';

import { toLinearGradient } from '@/shared/lib';

import type { CosmeticTileProps } from './CosmeticTile.types';

import s from './CosmeticTile.module.scss';

export const CosmeticTile = ({ item, className }: CosmeticTileProps) => {
  const { colors, animated } = item;

  const style = {
    '--tile-gradient': toLinearGradient({ colors, repeat: animated })
  } as CSSProperties;

  return (
    <span
      aria-hidden
      className={clsx(s.root, { [s.animated]: animated }, className)}
      style={style}
    />
  );
};
