'use client';

import { motion } from 'motion/react';

import type { RevealOnScrollProps } from './RevealOnScroll.types';

import {
  REVEAL_IN_VIEW,
  REVEAL_INITIAL,
  REVEAL_TRANSITION,
  REVEAL_VIEWPORT
} from './RevealOnScroll.motion';

export const RevealOnScroll = ({
  children,
  className,
  delay = 0,
  as = 'div'
}: RevealOnScrollProps) => {
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={REVEAL_INITIAL}
      transition={{ ...REVEAL_TRANSITION, delay }}
      viewport={REVEAL_VIEWPORT}
      whileInView={REVEAL_IN_VIEW}
    >
      {children}
    </Component>
  );
};
