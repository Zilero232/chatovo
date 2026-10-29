import { useRoomContext } from '@livekit/components-react';
import { useTranslations } from 'use-intl';

import { useCameraControl } from './use-camera-control';
import { useDeafen } from './use-deafen';
import { useMicControl } from './use-mic-control';
import { useScreenControl } from './use-screen-control';

export const useRoomControls = () => {
  const t = useTranslations('room.controls');

  const room = useRoomContext();

  const { isDeafened, toggle: toggleDeafen } = useDeafen();
  const mic = useMicControl();
  const camera = useCameraControl();
  const screen = useScreenControl();

  const lockedLabel = t('invisibleLocked');
  const micLabel = mic.pttKey ? `${t(mic.labelKey)} · ${mic.pttKey}` : t(mic.labelKey);

  return {
    mic: {
      ...mic,
      isLocked: mic.isLocked || mic.isInvisible,
      label: mic.isInvisible ? lockedLabel : micLabel
    },
    camera: {
      ...camera,
      label: camera.isInvisible ? lockedLabel : t(camera.enabled ? 'cameraOff' : 'camera')
    },
    screen: {
      ...screen,
      label: screen.isInvisible ? lockedLabel : t(screen.enabled ? 'stopShare' : 'screenShare')
    },
    deafen: { active: isDeafened, toggle: toggleDeafen },
    leave: () => room.disconnect()
  };
};
