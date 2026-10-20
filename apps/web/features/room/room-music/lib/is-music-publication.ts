import type { TrackPublication } from 'livekit-client';

import { Track } from 'livekit-client';

import { MUSIC_TRACK_NAME } from '../config/music';

export const isMusicPublication = (publication: TrackPublication): boolean =>
  publication.source === Track.Source.Unknown && publication.trackName === MUSIC_TRACK_NAME;
