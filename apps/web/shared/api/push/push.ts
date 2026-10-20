import type { RegisterPushDeviceInput, UnregisterPushDeviceInput } from '@chatovo/schemas';

import { api } from '../http';

export const registerPushDevice = async (input: RegisterPushDeviceInput): Promise<void> => {
  await api.post('/push/devices', input);
};

export const unregisterPushDevice = async (input: UnregisterPushDeviceInput): Promise<void> => {
  await api.delete('/push/devices', { data: input });
};
