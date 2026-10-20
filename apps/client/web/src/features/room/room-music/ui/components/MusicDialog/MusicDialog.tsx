import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { useTranslations } from 'use-intl';

import { useCurrentRoomMusic, useMusicDialog } from '../../../model/hooks';
import { MusicPanel } from '../MusicPanel/MusicPanel';
import { MusicStage } from '../MusicStage/MusicStage';

import s from './MusicDialog.module.scss';

export const MusicDialog = () => {
  const t = useTranslations('room.music');

  const { isOpen, setIsOpen } = useMusicDialog();
  const { music } = useCurrentRoomMusic();

  const track = music?.current ?? null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className={clsx(s.content, track !== null && s.staged)}
        popupClassName={s.popup}
      >
        <header className={s.header}>
          <DialogTitle className={s.title}>{t('title')}</DialogTitle>
          <DialogDescription className={s.description}>{t('description')}</DialogDescription>
        </header>

        <div className={s.body}>
          {music !== null && track !== null && <MusicStage music={music} track={track} />}
          <MusicPanel />
        </div>
      </DialogContent>
    </Dialog>
  );
};
