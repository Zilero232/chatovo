import { raceWithTimeout } from '@/shared/lib';

import type { MountYoutubePlayerInput, YoutubePlayer } from './youtube-api.types';

import { YOUTUBE } from '../../config/music';
import { loadYoutubeApi } from './youtube-api';

export const mountYoutubePlayer = async ({
  host,
  videoId,
  events
}: MountYoutubePlayerInput): Promise<YoutubePlayer | null> => {
  const result = await raceWithTimeout({
    promise: loadYoutubeApi(),
    timeoutMs: YOUTUBE.loadTimeoutMs
  });

  if (!result.ok) {
    return null;
  }

  return new result.value.Player(host, {
    host: YOUTUBE.host,
    videoId,
    width: '100%',
    height: '100%',
    playerVars: { ...YOUTUBE.playerVars },
    events
  });
};
