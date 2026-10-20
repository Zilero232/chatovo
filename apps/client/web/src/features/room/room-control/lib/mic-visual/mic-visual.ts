import { match } from 'ts-pattern';

import type { MicVisual, ResolveMicVisualInput } from './mic-visual.types';

export const resolveMicVisual = ({
  pttState,
  isMicrophoneEnabled
}: ResolveMicVisualInput): MicVisual =>
  match({ pttState, isMicrophoneEnabled })
    .with(
      { isMicrophoneEnabled: false },
      () => ({ tone: 'danger', labelKey: 'unmute', isMuted: true }) as const
    )
    .with(
      { pttState: 'active' },
      () => ({ tone: 'active', labelKey: 'pttHint', isMuted: false }) as const
    )
    .with(
      { pttState: 'idle' },
      () => ({ tone: 'off', labelKey: 'pttHint', isMuted: false }) as const
    )
    .otherwise(() => ({ tone: 'on', labelKey: 'mute', isMuted: false }) as const);
