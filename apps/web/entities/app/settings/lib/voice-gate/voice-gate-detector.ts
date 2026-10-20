import { clamp } from 'remeda';

export type VoiceGateParams = {
  autoSensitivity: boolean;
  threshold: number;
};

export const VOICE_GATE_MANUAL_RANGE = 0.5;

export const VOICE_GATE_TICK_MS = 20;

const HANGOVER_MS = 280;
const NOISE_FLOOR_RISE = 0.004;
const NOISE_FLOOR_FALL = 0.05;
const NOISE_FLOOR_MAX = 0.12;
const AUTO_MARGIN = 0.02;

export class VoiceGateDetector {
  private openUntil = 0;
  private noiseFloor = 0;

  reset() {
    this.openUntil = 0;
    this.noiseFloor = 0;
  }

  isOpen(now = performance.now()) {
    return now < this.openUntil;
  }

  step(level: number, params: VoiceGateParams, now = performance.now()) {
    const wasOpen = now < this.openUntil;

    if (!wasOpen || level < this.noiseFloor) {
      const rate = level < this.noiseFloor ? NOISE_FLOOR_FALL : NOISE_FLOOR_RISE;

      this.noiseFloor = clamp(this.noiseFloor + (level - this.noiseFloor) * rate, {
        min: 0,
        max: NOISE_FLOOR_MAX
      });
    }

    const threshold = params.autoSensitivity
      ? clamp(this.noiseFloor + AUTO_MARGIN, { min: 0, max: 1 })
      : clamp(params.threshold, { min: 0, max: 1 }) * VOICE_GATE_MANUAL_RANGE;

    if (level >= threshold) {
      this.openUntil = now + HANGOVER_MS;
    }

    return now < this.openUntil;
  }
}
