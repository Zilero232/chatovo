import { Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { useInvisibleMode } from '@/features/app/invisible-mode';

import type { InvisibleModeButtonProps } from './InvisibleModeButton.types';

import { SidebarItem } from '../SidebarItem/SidebarItem';

import s from './InvisibleModeButton.module.scss';

export const InvisibleModeButton = ({ variant }: InvisibleModeButtonProps) => {
  const t = useTranslations('settings.system');

  const { isInvisible, toggle } = useInvisibleMode();

  return (
    <SidebarItem
      aria-pressed={isInvisible}
      badge={variant === 'menu' && <span aria-hidden className={s.switch} />}
      className={s[variant]}
      icon={isInvisible ? <EyeOff /> : <Eye />}
      label={t('invisibleMode')}
      title={t('invisibleMode')}
      variant={variant}
      onClick={toggle}
    />
  );
};
