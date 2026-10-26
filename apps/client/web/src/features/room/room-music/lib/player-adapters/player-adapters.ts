import type { SoundcloudWidget } from '../soundcloud-widget.types';
import type { YoutubePlayer } from '../youtube-api/index';
import type {
  AudioElementAdapterInput,
  MediaElementAdapterInput,
  MusicPlayerAdapter,
  VimeoAdapterInput
} from './player-adapters.types';

const toPercent = (volume: number): number => Math.round(volume * 100);

const toKnownDuration = (durationMs: number): number | null => (durationMs > 0 ? durationMs : null);

const isAutoplayRefusal = (error: unknown): boolean =>
  (error instanceof DOMException || error instanceof Error) && error.name === 'NotAllowedError';

const playOrReportBlocked = (playing: Promise<unknown>, onBlocked: () => void) => {
  playing.catch((error: unknown) => {
    if (isAutoplayRefusal(error)) {
      onBlocked();
    }
  });
};

export const toYoutubeAdapter = (player: YoutubePlayer): MusicPlayerAdapter => ({
  play: () => player.playVideo(),
  pause: () => player.pauseVideo(),
  seekTo: (positionMs) => player.seekTo(positionMs / 1000, true),
  setVolume: (volume) => player.setVolume(toPercent(volume)),
  readPositionMs: async () => player.getCurrentTime() * 1000,
  readDurationMs: async () => toKnownDuration(player.getDuration() * 1000)
});

export const toSoundcloudAdapter = (widget: SoundcloudWidget): MusicPlayerAdapter => ({
  play: () => widget.play(),
  pause: () => widget.pause(),
  seekTo: (positionMs) => widget.seekTo(positionMs),
  setVolume: (volume) => widget.setVolume(toPercent(volume)),
  readPositionMs: () => new Promise((resolve) => widget.getPosition(resolve)),
  readDurationMs: () =>
    new Promise((resolve) =>
      widget.getDuration((durationMs) => resolve(toKnownDuration(durationMs)))
    )
});

export const toVimeoAdapter = ({ player, onBlocked }: VimeoAdapterInput): MusicPlayerAdapter => ({
  play: () => playOrReportBlocked(player.play(), onBlocked),
  pause: () => void player.pause().catch(() => {}),
  seekTo: (positionMs) => void player.setCurrentTime(positionMs / 1000).catch(() => {}),
  setVolume: (volume) => void player.setVolume(volume).catch(() => {}),
  readPositionMs: async () => (await player.getCurrentTime()) * 1000,
  readDurationMs: async () => toKnownDuration((await player.getDuration()) * 1000)
});

export const toMediaElementAdapter = ({
  media,
  onBlocked
}: MediaElementAdapterInput): MusicPlayerAdapter => ({
  play: () => playOrReportBlocked(media.play(), onBlocked),
  pause: () => media.pause(),
  seekTo: (positionMs) => {
    media.currentTime = positionMs / 1000;
  },
  setVolume: (volume) => {
    media.volume = volume;
  },
  readPositionMs: async () => media.currentTime * 1000,
  readDurationMs: async () =>
    Number.isFinite(media.duration) ? toKnownDuration(media.duration * 1000) : null
});

export const toLiveAudioAdapter = ({
  audio,
  onBlocked
}: AudioElementAdapterInput): MusicPlayerAdapter => ({
  play: () => {
    if (audio.currentTime > 0) {
      audio.load();
    }

    playOrReportBlocked(audio.play(), onBlocked);
  },
  pause: () => audio.pause(),
  seekTo: () => {},
  setVolume: (volume) => {
    audio.volume = volume;
  },
  readPositionMs: async () => 0,
  readDurationMs: async () => null
});
