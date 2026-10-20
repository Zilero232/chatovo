import { describe, expect, it } from 'vitest';

import { HERO_SCENE_MOTION } from '../../config';
import { nextBlinkDelay } from '../next-blink-delay';

const [MIN, MAX] = HERO_SCENE_MOTION.blinkEveryMs;

describe('nextBlinkDelay', () => {
  it('waits the shortest gap for a zero roll', () => {
    expect(nextBlinkDelay(0)).toBe(MIN);
  });

  it('waits the longest gap for a full roll', () => {
    expect(nextBlinkDelay(1)).toBe(MAX);
  });

  it('lands in between for a middle roll', () => {
    expect(nextBlinkDelay(0.5)).toBe((MIN + MAX) / 2);
  });
});
