import { clsx } from 'clsx';

import { CosmeticRing, CosmeticTile } from '@/entities/app/shop';
import { UserAvatar } from '@/entities/auth/user';

import type { ParticipantStageProps } from './ParticipantStage.types';

import { useParticipantAudioLevel, useParticipantMedia } from '../../../../../model/hooks';
import { CardVideo } from '../../../CardVideo/CardVideo';
import { LocalScreenNotice } from '../../../LocalScreenNotice/LocalScreenNotice';
import { VoiceLevelRing } from '../../../VoiceLevelRing/VoiceLevelRing';
import { getCardTint } from '../../lib';

import s from '../../ParticipantCard.module.scss';

export const ParticipantStage = ({ participant }: ParticipantStageProps) => {
  const {
    cameraTrack,
    screenTrack,
    isSpeaking,
    avatarUrl,
    bannerColor,
    speakingRing,
    avatarFrame,
    tileBackground,
    displayName,
    isLocal,
    hasCamera,
    hasScreen,
    hasVideo
  } = useParticipantMedia(participant);

  const setAudioStage = useParticipantAudioLevel<HTMLDivElement>(participant);

  if (hasVideo) {
    return (
      <div className={s.stage}>
        <div className={s.videoGrid}>
          {hasCamera && cameraTrack && <CardVideo trackRef={cameraTrack} />}
          {hasScreen &&
            screenTrack &&
            (isLocal ? <LocalScreenNotice /> : <CardVideo trackRef={screenTrack} />)}
        </div>
      </div>
    );
  }

  return (
    <div className={s.stage}>
      <div ref={setAudioStage} className={s.audioStage}>
        <span aria-hidden className={s.tint} style={getCardTint(bannerColor)} />
        {tileBackground && <CosmeticTile item={tileBackground} />}
        <span
          aria-hidden
          className={clsx(s.avatarHalo, {
            [s.avatarHaloSpeaking]: isSpeaking,
            [s.avatarHaloLocalSpeaking]: isLocal && isSpeaking
          })}
        />
        <VoiceLevelRing colors={speakingRing?.colors} speaking={isSpeaking} />
        {avatarFrame && <CosmeticRing className={s.avatarFrame} item={avatarFrame} />}

        <UserAvatar
          className={clsx(s.avatar, { [s.avatarSpeaking]: isSpeaking })}
          fallbackClassName={s.avatarFallback}
          name={displayName}
          sizes='256px'
          src={avatarUrl}
        />
      </div>
    </div>
  );
};
