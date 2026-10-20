import { differenceInMonths, parseISO } from 'date-fns';

import type { ChangelogRelease } from '../../config';

export type ChangelogSummary = {
  current: string;
  months: number;
  releases: number;
};

export const summarizeReleases = (releases: ChangelogRelease[]): ChangelogSummary => {
  const newest = releases.at(0);
  const oldest = releases.at(-1);

  if (!newest || !oldest) {
    return { current: '0.0.0', months: 0, releases: 0 };
  }

  return {
    current: newest.version,
    months: Math.max(1, differenceInMonths(parseISO(newest.date), parseISO(oldest.date))),
    releases: releases.length
  };
};
