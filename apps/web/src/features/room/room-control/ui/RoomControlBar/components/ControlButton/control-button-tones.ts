import s from './ControlButton.module.scss';

export const controlButtonToneClass = {
  on: s.toneOn,
  off: s.toneOff,
  active: s.toneActive,
  danger: s.toneDanger,
  leave: s.toneLeave
} as const;

export const controlShellToneClass = {
  on: s.shellToneOn,
  off: s.shellToneOff,
  active: s.shellToneActive,
  danger: s.shellToneDanger,
  leave: s.shellToneLeave
} as const;

export const controlMainToneClass = {
  on: s.mainToneOn,
  off: s.mainToneOff,
  active: s.mainToneActive,
  danger: s.mainToneDanger,
  leave: s.mainToneLeave
} as const;

export type ControlTone = keyof typeof controlButtonToneClass;
