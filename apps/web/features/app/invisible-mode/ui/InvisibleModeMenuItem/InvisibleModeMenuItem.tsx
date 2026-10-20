import { DropdownMenuCheckboxItem } from '@chatovo/ui-kit';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { useAppSettings } from '@/entities/app/settings';

import s from './InvisibleModeMenuItem.module.scss';

export const InvisibleModeMenuItem = () => {
  const t = useTranslations('settings.system');
  const { settings, setGroup } = useAppSettings();

  const { invisibleMode } = settings.system;

  return (
    <DropdownMenuCheckboxItem
      checked={invisibleMode}
      className={s.root}
      onCheckedChange={(value) => setGroup('system', { invisibleMode: value })}
    >
      {invisibleMode ? <EyeOff /> : <Eye />}
      {t('invisibleMode')}
    </DropdownMenuCheckboxItem>
  );
};
