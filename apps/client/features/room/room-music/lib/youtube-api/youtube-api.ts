import type { YoutubeApi, YoutubeWindow } from './youtube-api.types';

import { YOUTUBE } from '../../config/music';

let pending: Promise<YoutubeApi> | null = null;

const readApi = (scope: YoutubeWindow): YoutubeApi | null => {
  const Player = scope.YT?.Player;

  return Player ? { Player } : null;
};

const injectApi = () =>
  new Promise<YoutubeApi>((resolve, reject) => {
    const scope = window as YoutubeWindow;
    const loaded = readApi(scope);

    if (loaded) {
      resolve(loaded);

      return;
    }

    const previousReady = scope.onYouTubeIframeAPIReady;
    const script = document.createElement('script');

    scope.onYouTubeIframeAPIReady = () => {
      previousReady?.();

      const api = readApi(scope);

      if (api) {
        resolve(api);
      }
    };

    script.src = YOUTUBE.apiSrc;
    script.async = true;
    script.onerror = () => {
      script.remove();
      reject(new Error('YouTube IFrame API failed to load'));
    };

    document.head.append(script);
  });

export const loadYoutubeApi = (): Promise<YoutubeApi> => {
  pending ??= injectApi().catch((error: unknown) => {
    pending = null;

    throw error;
  });

  return pending;
};
