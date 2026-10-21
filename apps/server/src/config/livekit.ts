import { hoursToMilliseconds, hoursToSeconds } from 'date-fns';
import { TrackSource } from 'livekit-server-sdk';

// Lifetime of the LiveKit AccessToken (room-join JWT) minted in the token
// handler. The grant only needs to be valid long enough to establish the
// connection — LiveKit keeps the participant in the room after the token
// expires, so 1 hour is a generous join window without long-lived credentials.
export const TOKEN_TTL_SECONDS = hoursToSeconds(1);

export const ROOM_GRANT_TTL_MS = hoursToMilliseconds(12);

export const MIC_LOCKED_PUBLISH_SOURCES = [
  TrackSource.CAMERA,
  TrackSource.SCREEN_SHARE,
  TrackSource.SCREEN_SHARE_AUDIO
];
