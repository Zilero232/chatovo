import { RefreshCw } from 'lucide-react';
import { useTranslations } from 'use-intl';

import type { CheckUpdateButtonProps } from './CheckUpdateButton.types';

import { useUpdateCheckState } from '../../../model/hooks';
import { SidebarItem } from '../SidebarItem/SidebarItem';

import s from './CheckUpdateButton.module.scss';

export const CheckUpdateButton = ({ variant }: CheckUpdateButtonProps) => {
  const t = useTranslations('appSidebar');

  const { isChecking, requestCheck } = useUpdateCheckState();

  return (
    <SidebarItem
      className={s[variant]}
      disabled={isChecking}
      icon={<RefreshCw className={isChecking ? s.spinning : undefined} />}
      label={t('checkUpdateLabel')}
      title={t('checkUpdate')}
      variant={variant}
      onClick={requestCheck}
    />
  );
};
