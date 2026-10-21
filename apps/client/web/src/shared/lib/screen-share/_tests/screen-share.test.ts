import { afterEach, describe, expect, it, vi } from 'vitest';

import { createCaptureController } from '../screen-share';

describe('createCaptureController', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns undefined where the browser has no CaptureController', () => {
    vi.stubGlobal('CaptureController', undefined);

    expect(createCaptureController()).toBeUndefined();
  });

  it('asks the browser to keep focus on Chatovo once a surface is picked', () => {
    const setFocusBehavior = vi.fn();

    vi.stubGlobal(
      'CaptureController',
      class {
        setFocusBehavior = setFocusBehavior;
      }
    );

    createCaptureController();

    expect(setFocusBehavior).toHaveBeenCalledWith('no-focus-change');
  });
});
