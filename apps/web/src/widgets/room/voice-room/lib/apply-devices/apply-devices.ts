import { keys } from 'remeda';

import { KIND_TO_SLOT } from '@/entities/app/settings';

import type { ApplyDevicesInput } from './apply-devices.types';

/** Switches the room onto the saved device for each kind; already-active kinds are skipped. */
export const applyDevices = ({ room, devices }: ApplyDevicesInput) => {
  for (const kind of keys(KIND_TO_SLOT)) {
    const deviceId = devices[KIND_TO_SLOT[kind]];

    if (!deviceId || room.getActiveDevice(kind) === deviceId) {
      continue;
    }

    room.switchActiveDevice(kind, deviceId).catch((err) => {
      console.error('failed to switch active device', kind, err);
    });
  }
};
