import type { FileMusicSource } from './create-file-music-source.types';

export const createFileMusicSource = (): FileMusicSource => {
  const context = new AudioContext();
  const element = new Audio();
  const source = context.createMediaElementSource(element);
  const destination = context.createMediaStreamDestination();
  const monitor = context.createGain();
  const [track] = destination.stream.getAudioTracks();

  if (!track) {
    void context.close();

    throw new Error('MediaStreamDestination produced no audio track');
  }

  source.connect(destination);
  source.connect(monitor);
  monitor.connect(context.destination);

  let objectUrl: string | null = null;

  const releaseUrl = () => {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }
  };

  return {
    track,
    element,
    load: async (file) => {
      releaseUrl();
      objectUrl = URL.createObjectURL(file);
      element.src = objectUrl;

      await context.resume();
      await element.play();
    },
    setMonitorVolume: (volume) => {
      monitor.gain.value = volume;
    },
    dispose: async () => {
      element.pause();
      element.removeAttribute('src');
      releaseUrl();
      track.stop();

      await context.close();
    }
  };
};
