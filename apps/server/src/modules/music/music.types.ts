import type { MusicLink, MusicPlayback, MusicTrack, RadioStation } from '@chatovo/schemas';

export type RoomMusicState = {
  current: MusicTrack | null;
  playback: MusicPlayback | null;
  queue: MusicTrack[];
  history: MusicTrack[];
};

export type StoredRoomMusic = {
  state: RoomMusicState;
  revision: number;
};

export type MusicTrackMeta = {
  title: string;
  artist: string | null;
  thumbnailUrl: string | null;
};

export type RadioStationEntry = {
  station: RadioStation;
  streamUrl: string;
  homepage: string | null;
  faviconUrl: string | null;
};

export type MusicTrackDraft = Omit<MusicTrack, 'addedBy' | 'artwork' | 'id'> & {
  artworkSource: string | null;
};

export type WriteRoomMusicInput = {
  roomId: string;
  state: RoomMusicState;
};

export type EmbedMusicLink = MusicLink & {
  source: Exclude<MusicLink['source'], 'file'>;
};
