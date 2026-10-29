import { Button } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { EyeOff } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { useInvisibleGuard } from '@/entities/room/room';

import s from './ChatReadOnlyNotice.module.scss';

export const ChatReadOnlyNotice = () => {
  const t = useTranslations('room.invisible');

  const { turnOff } = useInvisibleGuard();

  return (
    <div className={clsx('surface-bar', s.root)} role='status'>
      <span aria-hidden className='accent-top-line' />

      <EyeOff aria-hidden className={s.icon} />

      <span className={s.text}>
        <span className={s.title}>{t('chatReadOnly')}</span>
        <span className={s.hint}>{t('chatReadOnlyHint')}</span>
      </span>

      <Button size='sm' variant='secondary' onClick={turnOff}>
        {t('turnOff')}
      </Button>
    </div>
  );
};
