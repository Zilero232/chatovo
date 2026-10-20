import { describe, expect, it } from 'vitest';

import { SNAKE_GRID } from '../../../config';
import { nextFood } from '../next-food';

const cellsOf = (count: number) =>
  Array.from({ length: count }, (_, i) => ({ x: i % SNAKE_GRID, y: Math.floor(i / SNAKE_GRID) }));

describe('nextFood', () => {
  it('places the food inside the grid', () => {
    const food = nextFood({ snake: [{ x: 0, y: 0 }], seed: 7 });

    expect(food.x).toBeGreaterThanOrEqual(0);
    expect(food.x).toBeLessThan(SNAKE_GRID);
    expect(food.y).toBeGreaterThanOrEqual(0);
    expect(food.y).toBeLessThan(SNAKE_GRID);
  });

  it('never drops the food onto the snake', () => {
    const snake = cellsOf(40);
    const food = nextFood({ snake, seed: 3 });

    expect(snake).not.toContainEqual(food);
  });

  it('is deterministic for the same seed, so a replayed tick lands identically', () => {
    const snake = [{ x: 1, y: 1 }];

    expect(nextFood({ snake, seed: 11 })).toEqual(nextFood({ snake, seed: 11 }));
  });

  it('falls back to the origin when the snake fills the whole grid', () => {
    expect(nextFood({ snake: cellsOf(SNAKE_GRID * SNAKE_GRID), seed: 1 })).toEqual({ x: 0, y: 0 });
  });
});
