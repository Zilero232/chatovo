import { describe, expect, it } from 'vitest';

import { getStageGridShape, getStageGridStyle } from '../grid-shape';

describe('getStageGridShape', () => {
  it.each([
    [1, { cols: 1, rows: 1 }],
    [2, { cols: 2, rows: 1 }],
    [3, { cols: 2, rows: 2 }],
    [4, { cols: 2, rows: 2 }],
    [5, { cols: 3, rows: 2 }],
    [9, { cols: 3, rows: 3 }],
    [10, { cols: 4, rows: 3 }],
    [40, { cols: 5, rows: 8 }]
  ])('lays %i tiles out in a near-square grid on a wide stage', (count, shape) => {
    expect(getStageGridShape(count).wide).toEqual(shape);
  });

  it.each([
    [1, { cols: 1, rows: 1 }],
    [2, { cols: 1, rows: 2 }],
    [3, { cols: 2, rows: 2 }],
    [7, { cols: 2, rows: 4 }]
  ])('stacks %i tiles on a narrow stage', (count, shape) => {
    expect(getStageGridShape(count).narrow).toEqual(shape);
  });

  it('keeps one row for an empty stage', () => {
    expect(getStageGridShape(0)).toEqual({
      wide: { cols: 1, rows: 1 },
      narrow: { cols: 1, rows: 1 }
    });
  });

  it('hands both shapes to CSS as custom properties', () => {
    expect(getStageGridStyle(5)).toEqual({
      '--cols': 3,
      '--rows': 2,
      '--cols-narrow': 2,
      '--rows-narrow': 3
    });
  });
});
