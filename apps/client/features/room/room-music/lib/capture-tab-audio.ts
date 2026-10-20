import { DISPLAY_AUDIO_CAPTURE } from '@/shared/lib';

export const captureTabAudio = async (): Promise<MediaStreamTrack | null> => {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: DISPLAY_AUDIO_CAPTURE,
    selfBrowserSurface: 'exclude',
    systemAudio: 'include'
  } as DisplayMediaStreamOptions);

  stream.getVideoTracks().forEach((track) => track.stop());

  const [audio] = stream.getAudioTracks();

  return audio ?? null;
};
