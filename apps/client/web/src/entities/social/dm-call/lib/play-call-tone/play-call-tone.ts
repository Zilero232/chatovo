import type { PlayCallToneInput } from './play-call-tone.types';

import { CALL_TONE_PEAK_GAIN, CALL_TONES } from '../../config';

const RAMP_SECONDS = 0.015;

export const playCallTone = ({ kind, volume }: PlayCallToneInput): void => {
  if (typeof AudioContext === 'undefined' || volume <= 0) {
    return;
  }

  const context = new AudioContext();
  const peak = CALL_TONE_PEAK_GAIN * Math.min(1, volume);

  let at = context.currentTime;

  for (const { frequencies, durationMs, gapMs } of CALL_TONES[kind]) {
    const end = at + durationMs / 1000;

    for (const frequency of frequencies) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(peak / frequencies.length, at + RAMP_SECONDS);
      gain.gain.setValueAtTime(peak / frequencies.length, end - RAMP_SECONDS);
      gain.gain.linearRampToValueAtTime(0, end);

      oscillator.connect(gain).connect(context.destination);
      oscillator.start(at);
      oscillator.stop(end);
    }

    at = end + gapMs / 1000;
  }

  const totalMs = (at - context.currentTime) * 1000 + 100;

  setTimeout(() => {
    void context.close();
  }, totalMs);
};
