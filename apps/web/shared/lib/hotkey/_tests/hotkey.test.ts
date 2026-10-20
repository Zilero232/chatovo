import { describe, expect, it } from 'vitest';

import { hasModifier, isPureModifier, prettyHotkey } from '../hotkey';

describe('isPureModifier', () => {
  it('detects modifier-only keys', () => {
    for (const key of ['Control', 'Shift', 'Alt', 'AltGraph', 'Meta', 'OS']) {
      expect(isPureModifier(key)).toBe(true);
    }
  });

  it('rejects regular keys', () => {
    expect(isPureModifier('a')).toBe(false);
    expect(isPureModifier('F5')).toBe(false);
    expect(isPureModifier('')).toBe(false);
  });
});

describe('hasModifier', () => {
  it('accepts a combo that carries a modifier', () => {
    expect(hasModifier('Ctrl+M')).toBe(true);
    expect(hasModifier('Shift+Alt+K')).toBe(true);
    expect(hasModifier('Meta+Space')).toBe(true);
  });

  it('rejects a bare key', () => {
    expect(hasModifier('M')).toBe(false);
    expect(hasModifier('F5')).toBe(false);
  });
});

describe('prettyHotkey', () => {
  it('spaces out the joiner for display', () => {
    expect(prettyHotkey('Ctrl+Shift+M')).toBe('Ctrl + Shift + M');
  });

  it('leaves a single key untouched', () => {
    expect(prettyHotkey('F5')).toBe('F5');
  });
});
