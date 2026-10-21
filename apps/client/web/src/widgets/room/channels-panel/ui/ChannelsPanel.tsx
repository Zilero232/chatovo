import { clsx } from 'clsx';

import { UserBar } from '@/widgets/app/user-bar';

import type { ChannelsPanelProps } from './ChannelsPanel.types';

import { ChannelsHeader, ChannelsList, MiniRoomSlot } from './components';

import s from './ChannelsPanel.module.scss';

export const ChannelsPanel = ({ variant = 'desktop' }: ChannelsPanelProps = {}) => {
  const isDesktop = variant === 'desktop';

  return (
    <div className={clsx(s.root, isDesktop ? s.desktop : s.embedded)} data-variant={variant}>
      {isDesktop && <ChannelsHeader />}

      <ChannelsList />

      {isDesktop && <MiniRoomSlot />}

      {isDesktop && <UserBar />}
    </div>
  );
};
