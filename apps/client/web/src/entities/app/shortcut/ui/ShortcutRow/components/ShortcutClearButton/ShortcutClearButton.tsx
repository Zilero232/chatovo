import { Button } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { X } from 'lucide-react';
import { useTranslations } from 'use-intl';

import type { ShortcutClearButtonProps } from './ShortcutClearButton.types';

import s from '../../ShortcutRow.module.scss';

export const ShortcutClearButton = ({ visible, onClick }: ShortcutClearButtonProps) => {
  const t = useTranslations('settings.shortcuts');

  return (
    <Button
      aria-hidden={!visible}
      aria-label={t('clear')}
      className={clsx({ [s.hidden]: !visible })}
      size='icon'
      tabIndex={visible ? 0 : -1}
      type='button'
      variant='ghost'
      onClick={onClick}
    >
      <X />
    </Button>
  );
};
