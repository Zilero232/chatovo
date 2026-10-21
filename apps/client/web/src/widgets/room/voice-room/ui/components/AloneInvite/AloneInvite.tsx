import { Button } from '@chatovo/ui-kit';
import { Check, Link2, UserPlus } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { useCopyInviteLink, useCurrentRoomId } from '../../../model/hooks';

import s from './AloneInvite.module.scss';

export const AloneInvite = () => {
  const t = useTranslations('room.invite');
  const roomId = useCurrentRoomId();
  const { canCopy, copied, copyInviteLink } = useCopyInviteLink(roomId);

  return (
    <div className={s.root}>
      <span aria-hidden className={s.icon}>
        <UserPlus />
      </span>
      <p className={s.title}>{t('aloneTitle')}</p>
      <p className={s.description}>{t('aloneDescription')}</p>
      <Button
        className={s.action}
        disabled={!canCopy}
        size='sm'
        variant='secondary'
        onClick={copyInviteLink}
      >
        {copied ? <Check /> : <Link2 />}
        {copied ? t('linkCopied') : t('copyLink')}
      </Button>
    </div>
  );
};
