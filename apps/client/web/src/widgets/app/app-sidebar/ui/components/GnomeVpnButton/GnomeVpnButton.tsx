import { ShieldCheck } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { EXTERNAL_LINKS } from '@/shared/constants';

import type { GnomeVpnButtonProps } from './GnomeVpnButton.types';

import { SidebarItem } from '../SidebarItem/SidebarItem';

import s from './GnomeVpnButton.module.scss';

export const GnomeVpnButton = ({ variant }: GnomeVpnButtonProps) => {
  const t = useTranslations('appSidebar');

  return (
    <SidebarItem
      className={s.root}
      href={EXTERNAL_LINKS.gnomeVpn}
      icon={<ShieldCheck />}
      label={t('gnomeVpnLabel')}
      rel='noopener noreferrer'
      target='_blank'
      title={t('gnomeVpn')}
      variant={variant}
    />
  );
};
