'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

import type { FirstFrameProps } from './FirstFrame.types';

export const FirstFrame = ({ onFrame }: FirstFrameProps) => {
  const hasFiredRef = useRef(false);

  useFrame(() => {
    if (!hasFiredRef.current) {
      hasFiredRef.current = true;
      onFrame();
    }
  });

  return null;
};
