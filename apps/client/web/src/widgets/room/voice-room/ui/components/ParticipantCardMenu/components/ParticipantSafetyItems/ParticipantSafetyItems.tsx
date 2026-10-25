import {
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator
} from '@chatovo/ui-kit';
import { Ban, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'use-intl';

import type { ParticipantSafetyItemsProps } from './ParticipantSafetyItems.types';

export const ParticipantSafetyItems = ({
  isBlocked,
  onReport,
  onToggleBlock
}: ParticipantSafetyItemsProps) => {
  const t = useTranslations('participant');
  const tBlocks = useTranslations('blocks');
  const tModeration = useTranslations('moderation');

  return (
    <>
      <ContextMenuSeparator />

      <ContextMenuGroup>
        <ContextMenuLabel>{t('safety')}</ContextMenuLabel>

        <ContextMenuItem variant={isBlocked ? 'default' : 'destructive'} onSelect={onToggleBlock}>
          {isBlocked ? <ShieldCheck /> : <Ban />}
          {tBlocks(isBlocked ? 'unblock' : 'block')}
        </ContextMenuItem>

        <ContextMenuItem variant='destructive' onSelect={onReport}>
          <ShieldAlert />
          {tModeration('reportUser')}
        </ContextMenuItem>
      </ContextMenuGroup>
    </>
  );
};
