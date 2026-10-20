import type { Room } from 'livekit-client';

import type { DeviceSettings } from '@/entities/app/settings';

export type ApplyDevicesInput = {
  devices: DeviceSettings;
  room: Room;
};
