import { Spinner, Tooltip, TooltipContent } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'motion/react';

import type { ControlButtonProps } from './ControlButton.types';

import { DeviceMenu } from '../DeviceMenu/DeviceMenu';
import {
  controlButtonToneClass,
  controlMainToneClass,
  controlShellToneClass
} from './control-button-tones';
import {
  CONTROL_ICON_ANIMATE,
  CONTROL_ICON_EXIT,
  CONTROL_ICON_INITIAL,
  CONTROL_ICON_TRANSITION
} from './ControlButton.motion';

import s from './ControlButton.module.scss';

export const ControlButton = ({
  icon,
  label,
  tone,
  pressed,
  disabled,
  isPending,
  device,
  onClick
}: ControlButtonProps) => {
  const animatedIcon = (
    <AnimatePresence initial={false} mode='popLayout'>
      <motion.span
        key={isPending ? 'pending' : String(pressed)}
        animate={CONTROL_ICON_ANIMATE}
        className={s.iconSlot}
        exit={CONTROL_ICON_EXIT}
        initial={CONTROL_ICON_INITIAL}
        transition={CONTROL_ICON_TRANSITION}
      >
        {isPending ? <Spinner decorative /> : icon}
      </motion.span>
    </AnimatePresence>
  );

  const isDisabled = disabled || isPending;
  if (!device) {
    return (
      <Tooltip>
        <button
          aria-label={label}
          aria-pressed={pressed}
          className={clsx(s.controlButton, controlButtonToneClass[tone])}
          disabled={isDisabled}
          type='button'
          onClick={onClick}
        >
          {animatedIcon}
        </button>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className={clsx(s.controlShell, controlShellToneClass[tone])}>
      <Tooltip>
        <button
          aria-label={label}
          aria-pressed={pressed}
          className={clsx(s.controlMain, controlMainToneClass[tone])}
          disabled={isDisabled}
          type='button'
          onClick={onClick}
        >
          {animatedIcon}
        </button>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>

      <DeviceMenu kind={device.kind} label={device.label} slot={device.slot} />
    </div>
  );
};
