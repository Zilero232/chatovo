'use client';

import { clsx } from 'clsx';

import type { ChannelsPanelProps } from './ChannelsPanel.types';

import { ChannelsFooter, ChannelsHeader, ChannelsList, MiniRoomSlot } from './components';

import s from './ChannelsPanel.module.scss';

export const ChannelsPanel = ({ variant = 'desktop', onNavigate }: ChannelsPanelProps = {}) => (
  <div
    className={clsx(s.root, variant === 'desktop' ? s.desktop : s.drawer)}
    data-variant={variant}
  >
    <ChannelsHeader compact={variant === 'drawer'} />

    <ChannelsList onNavigate={onNavigate} />

    {variant === 'desktop' && <MiniRoomSlot />}

    <ChannelsFooter />
  </div>
);
