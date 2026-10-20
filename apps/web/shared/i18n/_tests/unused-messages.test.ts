import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { en } from '../locales/en';

const CLIENT_ROOT = join(import.meta.dirname, '..', '..', '..');

const SKIPPED_DIRECTORIES = new Set(['.next', 'node_modules', 'out', 'locales', '.turbo']);

const collectSources = (directory: string): string[] => {
  const entries = readdirSync(directory, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return SKIPPED_DIRECTORIES.has(entry.name) ? [] : collectSources(path);
    }

    return /\.tsx?$/.test(entry.name) ? [readFileSync(path, 'utf8')] : [];
  });
};

const sourceText = collectSources(CLIENT_ROOT).join('\n');

const groupPaths = (value: unknown, prefix = ''): string[] => {
  if (typeof value !== 'object' || value === null) {
    return [];
  }

  const children = Object.entries(value).flatMap(([key, child]) =>
    groupPaths(child, prefix ? `${prefix}.${key}` : key)
  );

  return prefix ? [prefix, ...children] : children;
};

const isReferenced = (path: string) => {
  const segments = path.split('.');

  return segments.some((_, index) => sourceText.includes(segments.slice(index).join('.')));
};

describe('message groups', () => {
  it('are all reachable from the source, so whole dead branches do not pile up', () => {
    const orphaned = groupPaths(en).filter((path) => !isReferenced(path));

    expect(orphaned).toEqual([]);
  });
});
