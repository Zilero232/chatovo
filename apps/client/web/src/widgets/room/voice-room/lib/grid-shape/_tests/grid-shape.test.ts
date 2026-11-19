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
    [10, { cols: 3, rows: 3 }],
    [40, { cols: 3, rows: 3 }]
  ])('lays %i tiles out in at most three columns on a wide stage', (count, shape) => {
    expect(getStageGridShape(count).wide).toEqual(shape);
  });

  it.each([
    [1, { cols: 1, rows: 1 }],
    [2, { cols: 1, rows: 2 }],
    [3, { cols: 2, rows: 2 }],
    [7, { cols: 2, rows: 3 }]
  ])('stacks %i tiles on a narrow stage', (count, shape) => {
    expect(getStageGridShape(count).narrow).toEqual(shape);
  });

  it('sizes rows for three at most and lets the stage scroll past them', () => {
    expect(getStageGridShape(12).wide.rows).toBe(3);
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
