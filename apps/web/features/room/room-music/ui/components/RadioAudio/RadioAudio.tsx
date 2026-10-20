import { Button } from '@chatovo/ui-kit';
import { Play } from 'lucide-react';
import { useTranslations } from 'use-intl';

import type { MusicTrackPlayback } from '../../../model/types';

import { useRadioPlayer } from '../../../model/hooks';

import s from './RadioAudio.module.scss';

export const RadioAudio = ({ music, track }: MusicTrackPlayback) => {
  const t = useTranslations('room.music.player');

  const { setAudio, isBlocked, unblock, onError } = useRadioPlayer({ music, track });

  return (
    <>
      {/* eslint-disable-next-line siberiacancode-jsx-a11y/media-has-caption -- a live radio stream has no caption track */}
      <audio ref={setAudio} preload='none' src={track.ref} onError={onError} />
      {isBlocked && (
        <Button className={s.unblock} size='sm' variant='secondary' onClick={unblock}>
          <Play aria-hidden />
          {t('tapToListen')}
        </Button>
      )}
    </>
  );
};
