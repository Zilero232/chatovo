import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { useTranslations } from 'use-intl';

import { useCurrentRoomMusic, useMusicDialog } from '../../../model/hooks';
import { MusicLibrary } from '../MusicLibrary/MusicLibrary';
import { MusicStage } from '../MusicStage/MusicStage';

import s from './MusicDialog.module.scss';

export const MusicDialog = () => {
  const t = useTranslations('room.music');

  const { isOpen, setIsOpen } = useMusicDialog();
  const { music } = useCurrentRoomMusic();

  const track = music?.current ?? null;
  const hasStage = music !== null && track !== null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={clsx(s.content, hasStage && s.staged)} popupClassName={s.popup}>
        <header className={s.header}>
          <div className={s.heading}>
            <DialogTitle className={s.title}>{t('title')}</DialogTitle>
            <DialogDescription className={s.description}>{t('description')}</DialogDescription>
          </div>
        </header>

        <div className={s.body} data-music-viewport='clip'>
          {hasStage && <MusicStage className={s.stage} music={music} track={track} />}
          <MusicLibrary />
        </div>
      </DialogContent>
    </Dialog>
  );
};
