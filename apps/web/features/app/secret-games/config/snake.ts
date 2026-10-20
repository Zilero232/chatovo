import type { Direction, Point } from '../model/types';

export const SNAKE_GRID = 16;

export const SNAKE_TICK_MS = 130;

export const SNAKE_SWIPE_THRESHOLD = 24;

export const SNAKE_BEST_STORAGE_KEY = 'chatovo:snake-best';

export const SNAKE_INITIAL: Point[] = [
  { x: 8, y: 8 },
  { x: 7, y: 8 },
  { x: 6, y: 8 }
];

export const SNAKE_INITIAL_FOOD: Point = { x: 12, y: 8 };

export const SNAKE_STEP: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

export const SNAKE_OPPOSITE: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left'
};

export const SNAKE_KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  KeyW: 'up',
  KeyS: 'down',
  KeyA: 'left',
  KeyD: 'right'
};

export const SNAKE_FOOD_SEED_MULTIPLIER = 9301;
export const SNAKE_FOOD_SEED_INCREMENT = 49_297;
