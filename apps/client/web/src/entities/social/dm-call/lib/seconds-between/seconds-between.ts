import type { SecondsBetweenInput } from './seconds-between.types';

export const secondsBetween = ({ from, to }: SecondsBetweenInput): number | null => {
  if (from === null) {
    return null;
  }

  const start = typeof from === 'number' ? from : Date.parse(from);
  const end = typeof to === 'number' ? to : Date.parse(to);

  if (Number.isNaN(start) || Number.isNaN(end)) {
    return null;
  }

  return Math.max(0, Math.floor((end - start) / 1000));
};
