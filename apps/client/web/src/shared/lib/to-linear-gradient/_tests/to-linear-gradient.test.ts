import { describe, expect, it } from 'vitest';

import { toLinearGradient } from '../to-linear-gradient';

describe('toLinearGradient', () => {
  it('joins the colours at the default angle', () => {
    expect(toLinearGradient({ colors: ['#000', '#fff'] })).toBe(
      'linear-gradient(135deg, #000, #fff)'
    );
  });

  it('closes the loop with the first colour when repeating', () => {
    expect(toLinearGradient({ colors: ['#000', '#fff'], angle: 90, repeat: true })).toBe(
      'linear-gradient(90deg, #000, #fff, #000)'
    );
  });

  it('doubles a single colour so the gradient stays valid', () => {
    expect(toLinearGradient({ colors: ['#123'] })).toBe('linear-gradient(135deg, #123, #123)');
  });
});
