import { ContextMenuItem } from '@chatovo/ui-kit';
import { Pencil, ShieldAlert, Trash2 } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { useChatMessage } from '../../../../../model/contexts';

export const MessageMenuItems = () => {
  const t = useTranslations('chat');
  const tModeration = useTranslations('moderation');
  const { canEdit, canReport, showActions, startEdit, requestDelete, reportAbuse } =
    useChatMessage();

  return (
    <>
      {canEdit && (
        <ContextMenuItem onSelect={startEdit}>
          <Pencil />
          {t('edit')}
        </ContextMenuItem>
      )}

      {showActions && (
        <ContextMenuItem variant='destructive' onSelect={requestDelete}>
          <Trash2 />
          {t('delete')}
        </ContextMenuItem>
      )}

      {canReport && (
        <ContextMenuItem variant='destructive' onSelect={reportAbuse}>
          <ShieldAlert />
          {tModeration('reportMessage')}
        </ContextMenuItem>
      )}
    </>
  );
};
