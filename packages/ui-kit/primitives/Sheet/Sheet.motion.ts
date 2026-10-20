import type { Transition, Variants } from 'motion/react';

import type { SheetSide } from './Sheet.types';

import s from './Sheet.module.scss';

export const sideClass: Record<SheetSide, string> = {
  right: s.sideRight,
  left: s.sideLeft,
  top: s.sideTop,
  bottom: s.sideBottom
};

const offscreen: Record<SheetSide, string> = {
  right: 'translateX(100%)',
  left: 'translateX(-100%)',
  top: 'translateY(-100%)',
  bottom: 'translateY(100%)'
};

const onscreen: Record<SheetSide, string> = {
  right: 'translateX(0%)',
  left: 'translateX(0%)',
  top: 'translateY(0%)',
  bottom: 'translateY(0%)'
};

export const sheetVariants = (side: SheetSide): Variants => ({
  hidden: { transform: offscreen[side] },
  visible: { transform: onscreen[side] }
});

export const SHEET_TRANSITION: Transition = { duration: 0.2, ease: [0.32, 0.72, 0, 1] };

export const OVERLAY_TRANSITION: Transition = { duration: 0.2, ease: 'easeOut' };
