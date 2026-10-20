import { sumBy } from 'remeda';

export const sumTrendPoints = (points: { count: number }[]): number =>
  sumBy(points, (point) => point.count);
