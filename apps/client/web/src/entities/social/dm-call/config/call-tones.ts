export type CallToneStep = {
  durationMs: number;
  frequencies: number[];
  gapMs: number;
};

export const CALL_TONES = {
  ended: [
    { frequencies: [660], durationMs: 160, gapMs: 60 },
    { frequencies: [440], durationMs: 260, gapMs: 0 }
  ],
  busy: [
    { frequencies: [480, 620], durationMs: 250, gapMs: 250 },
    { frequencies: [480, 620], durationMs: 250, gapMs: 250 },
    { frequencies: [480, 620], durationMs: 250, gapMs: 0 }
  ],
  waiting: [
    { frequencies: [440], durationMs: 120, gapMs: 120 },
    { frequencies: [440], durationMs: 120, gapMs: 0 }
  ]
} satisfies Record<string, CallToneStep[]>;

export type CallToneKind = keyof typeof CALL_TONES;

export const CALL_TONE_PEAK_GAIN = 0.18;
