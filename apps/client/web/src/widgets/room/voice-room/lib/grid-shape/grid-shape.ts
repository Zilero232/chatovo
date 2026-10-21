import type { CSSProperties } from 'react';

import type { GridShape, StageGridShape } from './grid-shape.types';

const MAX_WIDE_COLS = 5;

const fill = (count: number, cols: number): GridShape => ({
  cols,
  rows: Math.max(1, Math.ceil(count / cols))
});

const wideCols = (count: number) =>
  Math.min(MAX_WIDE_COLS, Math.max(1, Math.ceil(Math.sqrt(count))));

export const getStageGridShape = (count: number): StageGridShape => ({
  wide: fill(count, wideCols(count)),
  narrow: fill(count, count <= 2 ? 1 : 2)
});

export const getStageGridStyle = (count: number): CSSProperties => {
  const { wide, narrow } = getStageGridShape(count);

  return {
    '--cols': wide.cols,
    '--rows': wide.rows,
    '--cols-narrow': narrow.cols,
    '--rows-narrow': narrow.rows
  } as CSSProperties;
};
