'use client';

import type { ComponentProps } from 'react';

import { Popover as BasePopover } from '@base-ui/react/popover';
import { useState } from 'react';

import type { PopoverProps, PopoverTriggerProps } from '../../Popover.types';

import { Button } from '../../../Button';
import { PopoverOpenProvider } from '../../popover-open-context';

export const Popover = ({ open, defaultOpen, onOpenChange, children, ...props }: PopoverProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);

  const isOpen = open ?? uncontrolledOpen;

  const handleOpenChange: NonNullable<ComponentProps<typeof BasePopover.Root>['onOpenChange']> = (
    next,
    eventDetails
  ) => {
    setUncontrolledOpen(next);
    onOpenChange?.(next, eventDetails);
  };

  return (
    <BasePopover.Root
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={handleOpenChange}
      {...props}
    >
      <PopoverOpenProvider isOpen={isOpen}>{children}</PopoverOpenProvider>
    </BasePopover.Root>
  );
};

export const PopoverTrigger = ({ className, children, ...props }: PopoverTriggerProps) => (
  <BasePopover.Trigger
    data-slot='popover-trigger'
    render={<Button className={className} {...props} />}
  >
    {children}
  </BasePopover.Trigger>
);
