import { describe, expect, it } from 'vitest';

import type { WebglEnvironment } from '../../webgl.types';

import { webglTier } from '../webgl-tier';

const DESKTOP: WebglEnvironment = {
  isReducedMotion: false,
  isSaveData: false,
  effectiveType: '4g',
  deviceMemory: 16,
  cores: 12,
  isCoarse: false,
  isNarrow: false,
  hasWebgl: true
};

describe('webglTier', () => {
  it('gives a capable desktop the full scene', () => {
    expect(webglTier(DESKTOP)).toBe('full');
  });

  it.each([
    ['reduced motion', { isReducedMotion: true }],
    ['Save-Data', { isSaveData: true }],
    ['a 3g connection', { effectiveType: '3g' }],
    ['no WebGL', { hasWebgl: false }],
    ['2 GB of memory', { deviceMemory: 2 }],
    ['two cores', { cores: 2 }]
  ])('turns 3D off for %s', (_label, patch) => {
    expect(webglTier({ ...DESKTOP, ...patch })).toBe('off');
  });

  it.each([
    ['4 GB of memory', { deviceMemory: 4 }],
    ['four cores', { cores: 4 }],
    ['a phone-sized touch screen', { isCoarse: true, isNarrow: true }]
  ])('runs the light scene for %s', (_label, patch) => {
    expect(webglTier({ ...DESKTOP, ...patch })).toBe('lite');
  });

  it('treats unknown memory and cores as a capable device', () => {
    expect(webglTier({ ...DESKTOP, deviceMemory: undefined, cores: undefined })).toBe('full');
  });

  it('keeps a touch laptop on the full scene', () => {
    expect(webglTier({ ...DESKTOP, isCoarse: true })).toBe('full');
  });
});
