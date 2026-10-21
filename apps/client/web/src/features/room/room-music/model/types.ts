import type { MusicTrack } from '@chatovo/schemas';

import type { RoomMusicView } from '@/entities/room/music';

import type { RADIO_GENRES } from '../config/music';

export type MusicShareState =
  | { mode: 'files'; files: File[]; index: number; isPaused: boolean }
  | { mode: 'idle' }
  | { mode: 'tab' };

export type MusicTrackPlayback = {
  music: RoomMusicView;
  track: MusicTrack;
};

export type TrackDuration = {
  trackId: string;
  durationMs: number;
};

export type RadioGenre = (typeof RADIO_GENRES)[number];

export type MusicLibraryTab = 'mine' | 'queue' | 'radio';

export type SeekInput = {
  positionMs: number;
  reason: string;
};
