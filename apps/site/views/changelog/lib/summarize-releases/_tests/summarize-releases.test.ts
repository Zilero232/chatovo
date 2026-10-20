import { describe, expect, it } from 'vitest';

import type { ChangelogRelease } from '../../../config';

import { CHANGELOG_RELEASES } from '../../../config';
import { summarizeReleases } from '../summarize-releases';

const releaseOf = (version: string, date: string): ChangelogRelease => ({
  version,
  date,
  tone: 'minor',
  highlights: [],
  entries: []
});

describe('summarizeReleases', () => {
  it('counts the releases it is given', () => {
    const summary = summarizeReleases([
      releaseOf('1.1.0', '2026-03-01'),
      releaseOf('1.0.0', '2026-01-01')
    ]);

    expect(summary.releases).toBe(2);
  });

  it('reports the newest version as current', () => {
    const summary = summarizeReleases([
      releaseOf('2.0.0', '2026-06-01'),
      releaseOf('1.0.0', '2026-01-01')
    ]);

    expect(summary.current).toBe('2.0.0');
  });

  it('spans the months between the oldest and newest release', () => {
    const summary = summarizeReleases([
      releaseOf('1.1.0', '2026-07-01'),
      releaseOf('1.0.0', '2026-01-01')
    ]);

    expect(summary.months).toBe(6);
  });

  it('never reports less than a month for same-day releases', () => {
    const summary = summarizeReleases([
      releaseOf('1.0.1', '2026-01-01'),
      releaseOf('1.0.0', '2026-01-01')
    ]);

    expect(summary.months).toBe(1);
  });

  it('falls back to zeroes on an empty list', () => {
    expect(summarizeReleases([])).toEqual({ current: '0.0.0', months: 0, releases: 0 });
  });

  it('summarizes the shipped changelog data', () => {
    const summary = summarizeReleases(CHANGELOG_RELEASES);

    expect(summary.releases).toBe(CHANGELOG_RELEASES.length);
    expect(summary.current).toBe(CHANGELOG_RELEASES[0].version);
    expect(summary.months).toBeGreaterThan(0);
  });
});

describe('CHANGELOG_RELEASES', () => {
  it('is ordered newest first', () => {
    const dates = CHANGELOG_RELEASES.map((release) => Date.parse(release.date));

    expect(dates).toEqual([...dates].sort((a, b) => b - a));
  });

  it('has no duplicate versions', () => {
    const versions = CHANGELOG_RELEASES.map((release) => release.version);

    expect(new Set(versions).size).toBe(versions.length);
  });

  it('gives every release at least one entry', () => {
    for (const release of CHANGELOG_RELEASES) {
      expect(release.entries.length).toBeGreaterThan(0);
    }
  });
});
