import { ContextMenuItem, ContextMenuSeparator, Slider } from '@chatovo/ui-kit';
import { useParticipantTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { MonitorSpeaker, Volume1, Volume2, VolumeX } from 'lucide-react';
import { isNonNullish } from 'remeda';
import { useTranslations } from 'use-intl';

import { formatPercent } from '@/shared/lib';

import type { ParticipantVolumeControlsProps } from './ParticipantVolumeControls.types';

import { useParticipantVolume } from '../../../model/hooks';

import s from './ParticipantVolumeControls.module.scss';

export const ParticipantVolumeControls = ({
  participant,
  displayName
}: ParticipantVolumeControlsProps) => {
  const t = useTranslations('participant');

  const { isMuted, volume, isControllable, setVolume, toggleMute } =
    useParticipantVolume(participant);

  const screenAudio = useParticipantVolume(participant, Track.Source.ScreenShareAudio);

  const [screenAudioTrack] = useParticipantTracks(
    [Track.Source.ScreenShareAudio],
    participant.identity
  );

  const hasScreenAudio = isNonNullish(screenAudioTrack);

  if (!isControllable) {
    return null;
  }

  return (
    <>
      <ContextMenuSeparator />

      <ContextMenuItem closeOnClick={false} onSelect={toggleMute}>
        {isMuted ? <Volume2 /> : <VolumeX />}
        {isMuted ? t('unmuteForMe') : t('muteForMe')}
      </ContextMenuItem>

      <ContextMenuItem className={s.volumeItem} closeOnClick={false}>
        <div className={s.volumeRow}>
          <span className={s.volumeLabel}>
            <Volume1 />
            {t('volume')}
          </span>
          <span className={s.volumeValue}>{formatPercent(volume)}</span>
        </div>

        <Slider
          aria-label={t('volumeFor', { name: displayName })}
          max={1}
          min={0}
          step={0.01}
          value={volume}
          onValueChange={(next) => setVolume(next as number)}
        />
      </ContextMenuItem>

      {hasScreenAudio && (
        <ContextMenuItem className={s.volumeItem} closeOnClick={false}>
          <div className={s.volumeRow}>
            <span className={s.volumeLabel}>
              <MonitorSpeaker />
              {t('screenVolume')}
            </span>
            <span className={s.volumeValue}>{formatPercent(screenAudio.volume)}</span>
          </div>

          <Slider
            aria-label={t('screenVolumeFor', { name: displayName })}
            max={1}
            min={0}
            step={0.01}
            value={screenAudio.volume}
            onValueChange={(next) => screenAudio.setVolume(next as number)}
          />
        </ContextMenuItem>
      )}
    </>
  );
};
