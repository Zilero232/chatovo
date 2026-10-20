import { Button } from '@chatovo/ui-kit';
import { Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { useChatMessage } from '../../../../../model/contexts';

import s from './MessageActions.module.scss';

export const MessageActions = () => {
  const t = useTranslations('chat');
  const { canEdit, startEdit, requestDelete } = useChatMessage();

  return (
    <div className={s.root}>
      {canEdit && (
        <Button aria-label={t('edit')} size='icon-xs' variant='ghost' onClick={startEdit}>
          <Pencil />
        </Button>
      )}
      <Button aria-label={t('delete')} size='icon-xs' variant='ghost' onClick={requestDelete}>
        <Trash2 />
      </Button>
    </div>
  );
};
