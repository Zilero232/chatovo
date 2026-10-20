import type { RemoteParticipant } from 'livekit-client';

import { RemoteAudioTrack, Track } from 'livekit-client';

import { AUDIO_LEVEL_ANALYSER, readAudioLevel } from '@/shared/lib';

import type { CreateSpeechProbeInput, SpeechProbe } from './speech-probe.types';

import { DUCKING } from '../../config/music';

export const readLiveMicTrack = (participant: RemoteParticipant): RemoteAudioTrack | null => {
  const publication = participant.getTrackPublication(Track.Source.Microphone);

  if (!publication || publication.isMuted) {
    return null;
  }

  const { track } = publication;

  return track instanceof RemoteAudioTrack ? track : null;
};

export const createSpeechProbe = ({ context, track }: CreateSpeechProbeInput): SpeechProbe => {
  const source = context.createMediaStreamSource(new MediaStream([track.mediaStreamTrack]));
  const analyser = context.createAnalyser();

  analyser.fftSize = AUDIO_LEVEL_ANALYSER.fftSize;
  analyser.smoothingTimeConstant = AUDIO_LEVEL_ANALYSER.smoothingTimeConstant;
  source.connect(analyser);

  return {
    analyser,
    bins: new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount)),
    dispose: () => source.disconnect()
  };
};

export const isProbeSpeaking = ({ analyser, bins }: SpeechProbe): boolean =>
  readAudioLevel({ analyser, bins }) > DUCKING.speechLevel;
