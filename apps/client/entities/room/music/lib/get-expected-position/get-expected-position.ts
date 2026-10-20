import { getMusicPositionMs } from '@chatovo/schemas';

import type { GetExpectedPositionInput } from './get-expected-position.types';

export const getExpectedPositionMs = ({ music, now }: GetExpectedPositionInput): number => {
  const { playback, clockOffsetMs } = music;

  return playback ? getMusicPositionMs({ playback, now: now + clockOffsetMs }) : 0;
};
