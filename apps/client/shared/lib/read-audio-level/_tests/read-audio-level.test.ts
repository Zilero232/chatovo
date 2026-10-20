import { describe, expect, it } from 'vitest';

import { readAudioLevel } from '../read-audio-level';

const analyserReturning = (value: number) =>
  ({
    getByteFrequencyData: (bins: Uint8Array) => bins.fill(value)
  }) as unknown as AnalyserNode;

const bins = () => new Uint8Array(new ArrayBuffer(16));

describe('readAudioLevel', () => {
  it('reads silence as zero', () => {
    expect(readAudioLevel({ analyser: analyserReturning(0), bins: bins() })).toBe(0);
  });

  it('drops a level under the noise floor to zero', () => {
    expect(readAudioLevel({ analyser: analyserReturning(10), bins: bins() })).toBe(0);
  });

  it('caps a loud signal at one', () => {
    expect(readAudioLevel({ analyser: analyserReturning(255), bins: bins() })).toBe(1);
  });

  it('grows with the signal between the floor and the cap', () => {
    const quiet = readAudioLevel({ analyser: analyserReturning(40), bins: bins() });
    const louder = readAudioLevel({ analyser: analyserReturning(80), bins: bins() });

    expect(quiet).toBeGreaterThan(0);
    expect(louder).toBeGreaterThan(quiet);
  });
});
