import { Button } from '@chatovo/ui-kit';
import { MonitorOff, MonitorUp } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { useScreenControl } from '@/features/room/room-control';

import s from './LocalScreenNotice.module.scss';

export const LocalScreenNotice = () => {
  const t = useTranslations('room');

  const { isPending, toggle } = useScreenControl();

  return (
    <div className={s.root}>
      <span aria-hidden className={s.icon}>
        <MonitorUp />
      </span>
      <p className={s.title}>{t('screen.sharingTitle')}</p>
      <p className={s.hint}>{t('screen.sharingHint')}</p>
      <Button disabled={isPending} size='sm' variant='destructive' onClick={toggle}>
        <MonitorOff aria-hidden />
        {t('controls.stopShare')}
      </Button>
    </div>
  );
};
