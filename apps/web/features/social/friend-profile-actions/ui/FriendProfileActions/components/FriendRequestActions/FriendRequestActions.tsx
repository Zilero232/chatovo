import { Button } from '@chatovo/ui-kit';
import { Check, UserPlus, X } from 'lucide-react';
import { useTranslations } from 'use-intl';

import type {
  AddFriendActionProps,
  CancelRequestActionProps,
  IncomingRequestActionsProps
} from './FriendRequestActions.types';

import s from '../../FriendProfileActions.module.scss';

export const AddFriendAction = ({ isBusy, onAdd }: AddFriendActionProps) => {
  const t = useTranslations('friends');

  return (
    <Button className={s.button} disabled={isBusy} size='sm' onClick={onAdd}>
      <UserPlus aria-hidden />
      {t('addFriend')}
    </Button>
  );
};

export const CancelRequestAction = ({ isBusy, onCancel }: CancelRequestActionProps) => {
  const t = useTranslations('friends');

  return (
    <Button className={s.button} disabled={isBusy} size='sm' variant='secondary' onClick={onCancel}>
      <X aria-hidden />
      {t('cancelRequest')}
    </Button>
  );
};

export const IncomingRequestActions = ({
  isBusy,
  onAccept,
  onDecline
}: IncomingRequestActionsProps) => {
  const t = useTranslations('friends');

  return (
    <div className={s.row}>
      <Button className={s.button} disabled={isBusy} size='sm' onClick={onAccept}>
        <Check aria-hidden />
        {t('accept')}
      </Button>
      <Button
        className={s.button}
        disabled={isBusy}
        size='sm'
        variant='secondary'
        onClick={onDecline}
      >
        <X aria-hidden />
        {t('decline')}
      </Button>
    </div>
  );
};
