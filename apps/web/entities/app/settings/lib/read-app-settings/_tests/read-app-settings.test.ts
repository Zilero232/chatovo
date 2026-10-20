import { describe, expect, it } from 'vitest';

import { DEFAULT_APP_SETTINGS } from '../../../config/config';
import { withAppSettingsDefaults } from '../read-app-settings';

describe('withAppSettingsDefaults', () => {
  it('returns the defaults when nothing was ever stored', () => {
    expect(withAppSettingsDefaults(null)).toEqual(DEFAULT_APP_SETTINGS);
    expect(withAppSettingsDefaults(undefined)).toEqual(DEFAULT_APP_SETTINGS);
  });

  it('keeps a stored value instead of the default', () => {
    const settings = withAppSettingsDefaults({
      system: { ...DEFAULT_APP_SETTINGS.system, invisibleMode: true }
    });

    expect(settings.system.invisibleMode).toBe(true);
  });

  it('fills a branch that a settings upgrade added after the value was saved', () => {
    const settings = withAppSettingsDefaults({
      audio: { activationMode: 'pushToTalk' }
    } as never);

    expect(settings.audio.activationMode).toBe('pushToTalk');
    expect(settings.video).toEqual(DEFAULT_APP_SETTINGS.video);
    expect(settings.shortcuts).toEqual(DEFAULT_APP_SETTINGS.shortcuts);
  });

  it('does not mutate the defaults it merges into', () => {
    withAppSettingsDefaults({ system: { ...DEFAULT_APP_SETTINGS.system, invisibleMode: true } });

    expect(DEFAULT_APP_SETTINGS.system.invisibleMode).toBe(false);
  });
});
