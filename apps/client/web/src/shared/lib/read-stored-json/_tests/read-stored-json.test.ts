import { beforeEach, describe, expect, it } from 'vitest';

import { readStoredJson } from '../read-stored-json';

const KEY = 'chatovo:test';

describe('readStoredJson', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('parses a stored value', () => {
    window.localStorage.setItem(KEY, JSON.stringify({ volume: 0.4 }));

    expect(readStoredJson(KEY, { volume: 1 })).toEqual({ volume: 0.4 });
  });

  it('returns the fallback when the key is absent', () => {
    expect(readStoredJson(KEY, { volume: 1 })).toEqual({ volume: 1 });
  });

  it('returns the fallback on malformed json instead of throwing', () => {
    window.localStorage.setItem(KEY, '{ not json');

    expect(readStoredJson(KEY, { volume: 1 })).toEqual({ volume: 1 });
  });

  it('returns the fallback when the stored value is null', () => {
    window.localStorage.setItem(KEY, 'null');

    expect(readStoredJson(KEY, { volume: 1 })).toEqual({ volume: 1 });
  });

  it('preserves falsy values that are not nullish', () => {
    window.localStorage.setItem(KEY, JSON.stringify(0));

    expect(readStoredJson<number>(KEY, 5)).toBe(0);
  });
});
