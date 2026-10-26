import { ContextMenuGroup, ContextMenuSeparator } from '@chatovo/ui-kit';
import { MonitorSpeaker, Volume2 } from 'lucide-react';
import { useTranslations } from 'use-intl';

import type { ParticipantVolumeControlsProps } from './ParticipantVolumeControls.types';

import { useParticipantAudioControls } from '../../../model/hooks';
import { VolumeRow } from './components';

export const ParticipantVolumeControls = ({
  participant,
  displayName
}: ParticipantVolumeControlsProps) => {
  const t = useTranslations('participant');

  const { voice, screen, isVisible, hasScreenAudio } = useParticipantAudioControls(participant);

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <ContextMenuSeparator />

      <ContextMenuGroup>
        <VolumeRow
          icon={<Volume2 />}
          isMuted={voice.isMuted}
          label={t('voice')}
          muteLabel={voice.isMuted ? t('unmuteForMe') : t('muteForMe')}
          sliderLabel={t('volumeFor', { name: displayName })}
          volume={voice.volume}
          onToggleMute={voice.toggleMute}
          onVolumeChange={voice.setVolume}
        />

        {hasScreenAudio && (
          <VolumeRow
            icon={<MonitorSpeaker />}
            isMuted={screen.isMuted}
            label={t('screenVolume')}
            muteLabel={screen.isMuted ? t('unmuteForMe') : t('muteForMe')}
            sliderLabel={t('screenVolumeFor', { name: displayName })}
            volume={screen.volume}
            onToggleMute={screen.toggleMute}
            onVolumeChange={screen.setVolume}
          />
        )}
      </ContextMenuGroup>
    </>
  );
};
