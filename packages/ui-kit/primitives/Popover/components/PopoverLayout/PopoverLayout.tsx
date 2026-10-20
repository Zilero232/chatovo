'use client';

import { clsx } from 'clsx';

import type {
  PopoverAnchorProps,
  PopoverDescriptionProps,
  PopoverHeaderProps,
  PopoverTitleProps
} from '../../Popover.types';

import { Text } from '../../../Text';

import s from '../../Popover.module.scss';

export const PopoverAnchor = ({ className, ...props }: PopoverAnchorProps) => (
  <div className={clsx(s.anchor, className)} data-slot='popover-anchor' {...props} />
);

export const PopoverHeader = ({ className, ...props }: PopoverHeaderProps) => (
  <div className={clsx(s.header, className)} data-slot='popover-header' {...props} />
);

export const PopoverTitle = ({ className, ...props }: PopoverTitleProps) => (
  <div className={clsx(s.title, className)} data-slot='popover-title' {...props} />
);

export const PopoverDescription = ({ className, ...props }: PopoverDescriptionProps) => (
  <Text className={className} data-slot='popover-description' tone='muted' {...props} />
);
