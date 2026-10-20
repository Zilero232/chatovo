import { Button, Tooltip, TooltipContent, TooltipProvider } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { TriangleAlert } from 'lucide-react';
import { useTranslations } from 'use-intl';

import type { ShortcutComboButtonProps } from './ShortcutComboButton.types';

import s from '../../ShortcutRow.module.scss';

export const ShortcutComboButton = ({
  display,
  label,
  recording,
  showConflictHint,
  onClick
}: ShortcutComboButtonProps) => {
  const t = useTranslations('settings.shortcuts');

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip open={showConflictHint ? undefined : false}>
        <Button
          aria-label={recording ? t('recording') : label}
          className={clsx(s.shortcutButton, { [s.shortcutButtonConflict]: showConflictHint })}
          type='button'
          variant='outline'
          onClick={onClick}
        >
          {showConflictHint && <TriangleAlert aria-hidden className={s.warnIcon} />}
          <span>{display}</span>
        </Button>

        {showConflictHint && (
          <TooltipContent className={s.tooltip} side='top' sideOffset={6}>
            {t('errors.systemTaken')}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
