import type { Track } from 'livekit-client';

export type VolumeSource = Track.Source.Microphone | Track.Source.ScreenShareAudio;

export type VolumeMap = Record<string, number>;

export type MuteMap = Record<string, true>;
