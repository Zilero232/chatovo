export const SHORTCUT_ACTIONS = {
  muteToggle: 'muteToggle',
  deafenToggle: 'deafenToggle',
  pttHold: 'pttHold',
  chatToggle: 'chatToggle'
} as const;

export type ShortcutActionId = (typeof SHORTCUT_ACTIONS)[keyof typeof SHORTCUT_ACTIONS];
