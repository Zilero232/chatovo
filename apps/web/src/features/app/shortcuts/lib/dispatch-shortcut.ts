import { match } from 'ts-pattern';

import type { ShortcutActionId } from '@/entities/app/shortcut';

import { appEvents } from '@/shared/lib';

type KeyState = 'Pressed' | 'Released';

export const dispatchShortcut = (actionId: ShortcutActionId, state: KeyState) =>
  match({ actionId, state })
    .with({ actionId: 'pttHold' }, ({ state: s }) => {
      appEvents.emit.pttKey({ phase: s === 'Pressed' ? 'pressed' : 'released' });
    })
    .with({ actionId: 'muteToggle', state: 'Pressed' }, () => {
      appEvents.emit.muteToggle();
    })
    .with({ actionId: 'deafenToggle', state: 'Pressed' }, () => {
      appEvents.emit.deafenToggle();
    })
    .with({ actionId: 'chatToggle', state: 'Pressed' }, () => {
      appEvents.emit.chatToggle();
    })
    .otherwise(() => {});
