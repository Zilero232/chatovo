'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger
} from '@chatovo/ui-kit';
import { ChevronUp } from 'lucide-react';
import { isEmpty } from 'remeda';

import type { DeviceMenuProps } from './DeviceMenu.types';

import { useDeviceSelect } from '../../../../model/hooks';
import { DeviceMenuItem } from './components';
import { deviceIcon } from './lib/device-icon';

import s from './DeviceMenu.module.scss';

export const DeviceMenu = ({ kind, slot, label }: DeviceMenuProps) => {
  const { devices, resolvedId, selectDevice } = useDeviceSelect({ kind, slot, label });

  /* eslint-disable react/static-components -- deviceIcon is a lookup returning a module-level lucide icon, not a component built per render */
  const Icon = deviceIcon(kind);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={label} className={s.trigger} disabled={isEmpty(devices)}>
        <ChevronUp className={s.triggerIcon} />
      </DropdownMenuTrigger>

      <DropdownMenuContent align='center' className={s.menu} side='top'>
        <DropdownMenuGroup>
          <DropdownMenuLabel className={s.header}>
            <Icon className={s.headerIcon} />
            <span className={s.headerLabel}>{label}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuRadioGroup className={s.list} value={resolvedId} onValueChange={selectDevice}>
          {devices.map((device) => (
            <DeviceMenuItem
              key={device.deviceId}
              device={device}
              icon={Icon}
              isActive={device.deviceId === resolvedId}
            />
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
  /* eslint-enable react/static-components */
};
