import type { SoundPlayer } from '@/shared/lib';

import { createSoundPlayer as createBaseSoundPlayer } from '@/shared/lib';

import type { SoundKey } from '../config';

import { SOUND_SRC } from '../config';

export const createSoundPlayer = (): SoundPlayer<SoundKey> =>
  createBaseSoundPlayer<SoundKey>({ sources: SOUND_SRC });
