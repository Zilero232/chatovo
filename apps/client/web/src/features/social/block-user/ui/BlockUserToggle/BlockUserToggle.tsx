import { Button } from '@chatovo/ui-kit';
import { Ban, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'use-intl';

import type { BlockUserToggleProps } from './BlockUserToggle.types';

import { useUnblockUser } from '../../model/hooks';
import { BlockUserConfirmDialog } from '../BlockUserConfirmDialog/BlockUserConfirmDialog';

import s from './BlockUserToggle.module.scss';

export const BlockUserToggle = ({ isBlocked, userId, userName }: BlockUserToggleProps) => {
  const t = useTranslations('blocks');

  const { isPending, unblock } = useUnblockUser();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (isBlocked) {
    return (
      <Button
        className={s.unblock}
        disabled={isPending}
        size='sm'
        variant='secondary'
        onClick={() => unblock({ userId, userName })}
      >
        <ShieldCheck aria-hidden />
        {t('unblock')}
      </Button>
    );
  }

  return (
    <>
      <Button className={s.block} size='sm' variant='ghost' onClick={() => setIsConfirmOpen(true)}>
        <Ban aria-hidden />
        {t('block')}
      </Button>

      <BlockUserConfirmDialog
        open={isConfirmOpen}
        userId={userId}
        userName={userName}
        onOpenChange={setIsConfirmOpen}
      />
    </>
  );
};
