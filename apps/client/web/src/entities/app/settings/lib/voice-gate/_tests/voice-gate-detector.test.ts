import { describe, expect, it } from 'vitest';

import { VOICE_GATE_TICK_MS, VoiceGateDetector } from '../voice-gate-detector';

const AUTO = { autoSensitivity: true, threshold: 0 };

const feed = (detector: VoiceGateDetector, level: number, ticks: number, startAt: number) => {
  let now = startAt;
  let isOpen = false;

  for (let tick = 0; tick < ticks; tick += 1) {
    isOpen = detector.step(level, AUTO, now);
    now += VOICE_GATE_TICK_MS;
  }

  return { isOpen, now };
};

describe('VoiceGateDetector auto sensitivity', () => {
  it('stays open while speech continues over a settled noise floor', () => {
    const detector = new VoiceGateDetector();

    const silence = feed(detector, 0.01, 200, 0);
    const speech = feed(detector, 0.3, 500, silence.now);

    expect(speech.isOpen).toBe(true);
  });

  it('closes again once the speech stops', () => {
    const detector = new VoiceGateDetector();

    const silence = feed(detector, 0.01, 200, 0);
    const speech = feed(detector, 0.3, 300, silence.now);
    const after = feed(detector, 0.01, 100, speech.now);

    expect(after.isOpen).toBe(false);
  });

  it('opens on speech that follows a loud noise burst', () => {
    const detector = new VoiceGateDetector();

    const noise = feed(detector, 0.6, 300, 0);
    const silence = feed(detector, 0.01, 100, noise.now);
    const speech = feed(detector, 0.25, 50, silence.now);

    expect(speech.isOpen).toBe(true);
  });
});
