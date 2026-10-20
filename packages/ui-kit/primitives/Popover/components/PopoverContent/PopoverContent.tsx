'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'motion/react';
import { isNullish } from 'remeda';

import type { PopoverContentProps } from '../../Popover.types';

import { usePopoverOpen } from '../../popover-open-context';
import { popoverVariants } from '../../Popover.motion';
import { Popover } from '../PopoverRoot/PopoverRoot';

import s from '../../Popover.module.scss';

const PopoverPopup = ({
  className,
  align = 'center',
  side = 'bottom',
  sideOffset = 4,
  triggerRef,
  initialFocus,
  children
}: PopoverContentProps) => {
  const isOpen = usePopoverOpen();

  return (
    <BasePopover.Portal keepMounted>
      <AnimatePresence>
        {isOpen ? (
          <BasePopover.Positioner
            key='popover-positioner'
            align={align}
            anchor={triggerRef}
            className={s.positioner}
            side={side}
            sideOffset={sideOffset}
          >
            <BasePopover.Popup
              render={
                <motion.div
                  animate='visible'
                  exit='hidden'
                  initial='hidden'
                  variants={popoverVariants}
                />
              }
              className={clsx('glass-overlay', s.popup, className)}
              data-slot='popover-content'
              initialFocus={initialFocus}
            >
              {children}
            </BasePopover.Popup>
          </BasePopover.Positioner>
        ) : null}
      </AnimatePresence>
    </BasePopover.Portal>
  );
};

export const PopoverContent = ({ isOpen, onOpenChange, ...props }: PopoverContentProps) => {
  if (isNullish(isOpen)) {
    return <PopoverPopup {...props} />;
  }

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverPopup {...props} />
    </Popover>
  );
};
