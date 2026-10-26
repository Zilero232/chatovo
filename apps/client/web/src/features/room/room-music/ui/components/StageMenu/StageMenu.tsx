import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@chatovo/ui-kit';
import { CircleStop, ExternalLink, MoreHorizontal } from 'lucide-react';
import { useTranslations } from 'use-intl';

import type { StageMenuProps } from './StageMenu.types';

import { useStageMenu } from '../../../model/hooks';

export const StageMenu = ({ track }: StageMenuProps) => {
  const t = useTranslations('room.music.nowPlaying');

  const { openLabel, isPending, openSource, stop } = useStageMenu(track);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={t('more')} size='icon-sm' title={t('more')} variant='ghost'>
        <MoreHorizontal />
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end'>
        <DropdownMenuItem onSelect={openSource}>
          <ExternalLink />
          {openLabel}
        </DropdownMenuItem>

        <DropdownMenuItem disabled={isPending} variant='destructive' onSelect={stop}>
          <CircleStop />
          {t('stop')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
