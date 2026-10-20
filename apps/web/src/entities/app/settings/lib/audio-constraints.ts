import type { AudioProcessingSettings } from '../model/types';

export const audioConstraints = (
  flags: AudioProcessingSettings,
  deviceId: string
): MediaTrackConstraints => ({
  noiseSuppression: flags.noiseSuppression,
  echoCancellation: flags.echoCancellation,
  autoGainControl: flags.autoGainControl,
  ...({ voiceIsolation: flags.voiceIsolation } as MediaTrackConstraints),
  ...(deviceId && { deviceId: { exact: deviceId } })
});
