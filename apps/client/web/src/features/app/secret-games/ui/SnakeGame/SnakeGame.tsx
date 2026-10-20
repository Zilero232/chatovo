import { Button, Dialog, DialogContent, DialogTitle, Text } from '@chatovo/ui-kit';
import { useMediaQuery } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import { useTranslations } from 'use-intl';

import type { SnakeGameProps } from './SnakeGame.types';

import { useSnakeGame } from '../../model/hooks';

import s from './SnakeGame.module.scss';

export const SnakeGame = ({ isOpen, onOpenChange }: SnakeGameProps) => {
  const t = useTranslations('easterEggs.snake');

  const isTouch = useMediaQuery('(hover: none), (pointer: coarse)');

  const { snake, food, score, best, isOver, restart, grid, boardRef } = useSnakeGame(isOpen);

  const cells = Array.from({ length: grid * grid }, (_, index) => {
    const x = index % grid;
    const y = Math.floor(index / grid);

    const isHead = snake[0].x === x && snake[0].y === y;
    const isBody = !isHead && snake.some((cell) => cell.x === x && cell.y === y);
    const isFood = food.x === x && food.y === y;

    return { index, isHead, isBody, isFood };
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={s.content}>
        <DialogTitle className={s.title}>{t('title')}</DialogTitle>

        <div className={s.stats}>
          <Text size='sm' tone='muted'>
            {t('score', { score })}
          </Text>
          <Text size='sm' tone='muted'>
            {t('best', { best })}
          </Text>
        </div>

        <div
          ref={boardRef}
          className={s.board}
          style={{ gridTemplateColumns: `repeat(${grid}, 1fr)` }}
        >
          {cells.map((cell) => (
            <span
              key={cell.index}
              className={clsx(s.cell, {
                [s.head]: cell.isHead,
                [s.body]: cell.isBody,
                [s.food]: cell.isFood
              })}
            />
          ))}
        </div>

        {isOver ? (
          <div className={s.overlay}>
            <Text weight='semibold'>{t('gameOver')}</Text>
            <Button size='sm' onClick={restart}>
              {t('restart')}
            </Button>
          </div>
        ) : (
          <Text align='center' size='xs' tone='muted'>
            {isTouch ? t('hintTouch') : t('hint')}
          </Text>
        )}
      </DialogContent>
    </Dialog>
  );
};
