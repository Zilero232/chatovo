import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@chatovo/ui-kit';
import { useMediaQuery } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import { useTranslations } from 'use-intl';

import { MEDIA_QUERIES } from '@/shared/constants';

import { useCurrentRoomMusic, useMusicDialog } from '../../../model/hooks';
import { MusicPanel } from '../MusicPanel/MusicPanel';
import { MusicStage } from '../MusicStage/MusicStage';

import s from './MusicDialog.module.scss';

export const MusicDialog = () => {
  const t = useTranslations('room.music');

  const { isOpen, setIsOpen } = useMusicDialog();
  const { music } = useCurrentRoomMusic();
  const isWide = useMediaQuery(MEDIA_QUERIES.wide);

  const track = music?.current ?? null;
  const hasStage = music !== null && track !== null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={clsx(s.content, hasStage && s.staged)} popupClassName={s.popup}>
        <header className={s.header}>
          <DialogTitle className={s.title}>{t('title')}</DialogTitle>
          <DialogDescription className={s.description}>{t('description')}</DialogDescription>
        </header>

        <div className={s.body} data-music-viewport='clip'>
          {hasStage && isWide && <MusicStage className={s.stage} music={music} track={track} />}
          <MusicPanel>
            {hasStage && !isWide && <MusicStage music={music} track={track} />}
          </MusicPanel>
        </div>
      </DialogContent>
    </Dialog>
  );
};
