'use client';

import { useLocalStorage, useSwipe } from '@siberiacancode/reactuse';
import { useEffect, useRef, useState } from 'react';

import type { Direction, Point } from '../types';

import {
  SNAKE_BEST_STORAGE_KEY,
  SNAKE_GRID,
  SNAKE_INITIAL,
  SNAKE_INITIAL_FOOD,
  SNAKE_KEY_TO_DIRECTION,
  SNAKE_OPPOSITE,
  SNAKE_STEP,
  SNAKE_SWIPE_THRESHOLD,
  SNAKE_TICK_MS
} from '../../config';
import { nextFood } from '../../lib';

export const useSnakeGame = (isRunning: boolean) => {
  const { value: best, set: setBest } = useLocalStorage(SNAKE_BEST_STORAGE_KEY, 0);

  const [snake, setSnake] = useState(SNAKE_INITIAL);
  const [food, setFood] = useState<Point>(SNAKE_INITIAL_FOOD);
  const [isOver, setIsOver] = useState(false);
  const [score, setScore] = useState(0);

  const directionRef = useRef<Direction>('right');
  const queuedRef = useRef<Direction | null>(null);
  const tickRef = useRef(0);

  const turn = (next: Direction) => {
    if (next === SNAKE_OPPOSITE[directionRef.current]) {
      return;
    }

    queuedRef.current = next;
  };

  const swipe = useSwipe<HTMLDivElement>({
    threshold: SNAKE_SWIPE_THRESHOLD,
    onEnd: ({ direction }) => {
      if (direction !== 'none') {
        turn(direction);
      }
    }
  });

  const restart = () => {
    directionRef.current = 'right';
    queuedRef.current = null;
    tickRef.current = 0;

    setSnake(SNAKE_INITIAL);
    setFood(SNAKE_INITIAL_FOOD);
    setScore(0);
    setIsOver(false);
  };

  useEffect(() => {
    if (!isRunning || isOver) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const next = SNAKE_KEY_TO_DIRECTION[event.code];

      if (!next) {
        return;
      }

      event.preventDefault();
      turn(next);
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isRunning, isOver]);

  useEffect(() => {
    if (!isRunning || isOver) {
      return;
    }

    const timer = window.setInterval(() => {
      setSnake((current) => {
        if (queuedRef.current) {
          directionRef.current = queuedRef.current;
          queuedRef.current = null;
        }

        const step = SNAKE_STEP[directionRef.current];
        const head = {
          x: (current[0].x + step.x + SNAKE_GRID) % SNAKE_GRID,
          y: (current[0].y + step.y + SNAKE_GRID) % SNAKE_GRID
        };

        const hitSelf = current.some((cell) => cell.x === head.x && cell.y === head.y);

        if (hitSelf) {
          setIsOver(true);

          return current;
        }

        const ate = head.x === food.x && head.y === food.y;
        const grown = [head, ...current];

        if (ate) {
          tickRef.current += 1;
          setScore((value) => value + 1);
          setFood(nextFood({ snake: grown, seed: tickRef.current }));

          return grown;
        }

        return grown.slice(0, -1);
      });
    }, SNAKE_TICK_MS);

    return () => window.clearInterval(timer);
  }, [isRunning, isOver, food]);

  useEffect(() => {
    if (isOver && score > (best ?? 0)) {
      setBest(score);
    }
    // eslint-disable-next-line react/exhaustive-deps -- writing the record must not re-run when the stored value changes
  }, [isOver, score]);

  return {
    snake,
    food,
    score,
    best: best ?? 0,
    isOver,
    restart,
    grid: SNAKE_GRID,
    boardRef: swipe.ref
  };
};
