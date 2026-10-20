'use client';

import { Dialog } from '@base-ui/react/dialog';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

import type { SheetProps } from '../../Sheet.types';

import { OVERLAY_TRANSITION } from '../../Sheet.motion';

import s from '../../Sheet.module.scss';

export const Sheet = ({
  open,
  defaultOpen,
  onOpenChange,
  className,
  trigger,
  children,
  ...props
}: SheetProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);

  const isOpen = open ?? uncontrolledOpen;

  const handleOpenChange = (next: boolean) => {
    setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  return (
    <Dialog.Root defaultOpen={defaultOpen} open={open} onOpenChange={handleOpenChange} {...props}>
      {trigger ? <Dialog.Trigger render={trigger as never} /> : null}

      <Dialog.Portal keepMounted>
        <AnimatePresence>
          {isOpen ? (
            <Dialog.Backdrop
              key='sheet-backdrop'
              render={
                <motion.div
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  transition={OVERLAY_TRANSITION}
                />
              }
              className={clsx(s.overlay, className)}
              data-slot='sheet'
            />
          ) : null}
        </AnimatePresence>

        <AnimatePresence>{isOpen ? children : null}</AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
