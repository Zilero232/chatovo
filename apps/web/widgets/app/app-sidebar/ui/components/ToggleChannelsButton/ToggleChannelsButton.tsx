'use client';

import { Button, Tooltip, TooltipContent } from '@chatovo/ui-kit';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { ToggleChannelsButtonProps } from './ToggleChannelsButton.types';

import s from './ToggleChannelsButton.module.scss';

export const ToggleChannelsButton = ({ opened, onToggle }: ToggleChannelsButtonProps) => {
  const t = useTranslations('appSidebar');

  return (
    <Tooltip>
      <Button
        aria-expanded={opened}
        aria-label={opened ? t('hideChannels') : t('showChannels')}
        size='icon'
        variant='ghost'
        onClick={onToggle}
      >
        {opened ? (
          <PanelLeftClose key='close' className={s.iconEnter} />
        ) : (
          <PanelLeftOpen key='open' className={s.iconEnter} />
        )}
      </Button>
      <TooltipContent side='right'>{opened ? t('hideChannels') : t('showChannels')}</TooltipContent>
    </Tooltip>
  );
};
