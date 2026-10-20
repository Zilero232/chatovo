import { DropdownMenuRadioItem } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';
import { useTranslations } from 'use-intl';

import type { DeviceMenuItemProps } from './DeviceMenuItem.types';

import s from '../../DeviceMenu.module.scss';

export const DeviceMenuItem = ({ device, icon: Icon, isActive }: DeviceMenuItemProps) => {
  const t = useTranslations('settings.devices');

  const name = device.label || t('unknownDevice');

  return (
    <DropdownMenuRadioItem
      className={clsx(s.item, { [s.itemActive]: isActive, [s.itemInactive]: !isActive })}
      value={device.deviceId}
    >
      <span className={clsx(s.itemIconBox, { [s.itemIconBoxActive]: isActive })}>
        <Icon />
      </span>
      <span className={s.itemLabel} title={name}>
        {name}
      </span>
      {isActive && <Check className={s.itemCheck} />}
    </DropdownMenuRadioItem>
  );
};
