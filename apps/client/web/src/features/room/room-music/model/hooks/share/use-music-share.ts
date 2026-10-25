import { useLocalParticipant } from '@livekit/components-react';
import { useUnmount } from '@siberiacancode/reactuse';
import { Track } from 'livekit-client';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { SHARED_AUDIO_PUBLISH } from '@/shared/lib';

import type { FileMusicSource } from '../../../lib/index';
import type { MusicShareState } from '../../types';

import { MUSIC_TRACK_NAME } from '../../../config/music';
import { captureTabAudio, createFileMusicSource } from '../../../lib/index';

export const useMusicShare = () => {
  const t = useTranslations('room.music.share');

  const { localParticipant } = useLocalParticipant();

  const [state, setState] = useState<MusicShareState>({ mode: 'idle' });

  const trackRef = useRef<MediaStreamTrack | null>(null);
  const sourceRef = useRef<FileMusicSource | null>(null);
  const playlistRef = useRef<{ files: File[]; index: number }>({ files: [], index: 0 });

  const release = async () => {
    const track = trackRef.current;
    const source = sourceRef.current;

    trackRef.current = null;
    sourceRef.current = null;

    await Promise.all([
      track && localParticipant.unpublishTrack(track).catch(() => undefined),
      source?.dispose()
    ]);

    track?.stop();
  };

  const stop = async () => {
    await release();
    setState({ mode: 'idle' });
  };

  const publish = async (track: MediaStreamTrack) => {
    trackRef.current = track;

    await localParticipant.publishTrack(track, {
      name: MUSIC_TRACK_NAME,
      source: Track.Source.Unknown,
      ...SHARED_AUDIO_PUBLISH
    });
  };

  const playAt = async (index: number) => {
    const { files } = playlistRef.current;
    const file = files[index];
    const source = sourceRef.current;

    if (!file || !source) {
      await stop();

      return;
    }

    playlistRef.current = { files, index };
    setState({ mode: 'files', files, index, isPaused: false });

    try {
      await source.load(file);
    } catch {
      toast.error(t('fileFailed', { name: file.name }));
      await playAt(index + 1);
    }
  };

  const startWith = async (createTrack: () => Promise<MediaStreamTrack | null>) => {
    const track = await createTrack().catch(() => null);

    if (!track) {
      return false;
    }

    await release();

    try {
      await publish(track);

      return true;
    } catch {
      toast.error(t('publishFailed'));
      await release();

      return false;
    }
  };

  const shareTab = async () => {
    const started = await startWith(async () => {
      const track = await captureTabAudio();

      if (!track) {
        toast.error(t('noAudio'));

        return null;
      }

      track.addEventListener('ended', () => void stop(), { once: true });

      return track;
    });

    if (started) {
      setState({ mode: 'tab' });
    }

    return started;
  };

  const shareFiles = async (files: File[]) => {
    if (files.length === 0) {
      return;
    }

    const source = createFileMusicSource();
    const started = await startWith(async () => source.track);

    if (!started) {
      await source.dispose();

      return;
    }

    sourceRef.current = source;
    source.element.addEventListener('ended', () => void playAt(playlistRef.current.index + 1));
    playlistRef.current = { files, index: 0 };
    await playAt(0);
  };

  const togglePause = () => {
    const element = sourceRef.current?.element;

    if (!element || state.mode !== 'files') {
      return;
    }

    if (element.paused) {
      void element.play();
    } else {
      element.pause();
    }

    setState({ ...state, isPaused: element.paused });
  };

  useUnmount(() => {
    void release();
  });

  return {
    state,
    shareTab,
    shareFiles,
    togglePause,
    next: () => playAt(playlistRef.current.index + 1),
    stop,
    setMonitorVolume: (volume: number) => sourceRef.current?.setMonitorVolume(volume)
  };
};
