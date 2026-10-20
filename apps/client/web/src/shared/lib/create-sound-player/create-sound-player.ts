import type { CreateSoundPlayerInput, SoundPlayer } from './create-sound-player.types';

const DEFAULT_VOLUME = 0.5;

/**
 * Caches one `HTMLAudioElement` per key and replays it from the start.
 * `play` swallows autoplay rejections and returns the element, so callers can
 * attach their own listeners; `dispose` releases every cached element.
 */
export const createSoundPlayer = <TKey extends string>({
  sources,
  defaultVolume = DEFAULT_VOLUME
}: CreateSoundPlayerInput<TKey>): SoundPlayer<TKey> => {
  const cache = new Map<TKey, HTMLAudioElement>();

  const get = (key: TKey) => {
    const cached = cache.get(key);

    if (cached) {
      return cached;
    }

    const audio = new Audio(sources[key]);

    audio.preload = 'auto';
    cache.set(key, audio);

    return audio;
  };

  return {
    get,
    play: (key, volume = defaultVolume) => {
      const audio = get(key);

      audio.volume = volume;
      audio.currentTime = 0;

      audio.play().catch(() => {});

      return audio;
    },
    dispose: () => {
      for (const audio of cache.values()) {
        audio.pause();
        audio.src = '';
      }

      cache.clear();
    }
  };
};
