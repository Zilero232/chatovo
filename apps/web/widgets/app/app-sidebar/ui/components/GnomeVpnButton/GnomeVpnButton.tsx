'use client';

import { Button, Tooltip, TooltipContent } from '@chatovo/ui-kit';
import { ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { EXTERNAL_LINKS } from '@/shared/constants';

import s from './GnomeVpnButton.module.scss';

export const GnomeVpnButton = () => {
  const t = useTranslations('appSidebar');

  return (
    <Tooltip>
      <Button
        aria-label={t('gnomeVpnLabel')}
        className={s.root}
        href={EXTERNAL_LINKS.gnomeVpn}
        rel='noopener noreferrer'
        size='icon'
        target='_blank'
        variant='ghost'
      >
        <ShieldCheck />
      </Button>
      <TooltipContent side='right'>{t('gnomeVpn')}</TooltipContent>
    </Tooltip>
  );
};
