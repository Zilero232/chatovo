import type { Point } from '../../model/types';
import type { NextFoodInput } from './next-food.types';

import { SNAKE_FOOD_SEED_INCREMENT, SNAKE_FOOD_SEED_MULTIPLIER, SNAKE_GRID } from '../../config';

const cellKey = (cell: Point) => `${cell.x}:${cell.y}`;

export const nextFood = ({ snake, seed }: NextFoodInput): Point => {
  const taken = new Set(snake.map(cellKey));
  const cells = SNAKE_GRID * SNAKE_GRID;

  for (let attempt = 0; attempt < cells; attempt += 1) {
    const spot = (seed * SNAKE_FOOD_SEED_MULTIPLIER + attempt * SNAKE_FOOD_SEED_INCREMENT) % cells;
    const candidate = { x: spot % SNAKE_GRID, y: Math.floor(spot / SNAKE_GRID) };

    if (!taken.has(cellKey(candidate))) {
      return candidate;
    }
  }

  return { x: 0, y: 0 };
};
