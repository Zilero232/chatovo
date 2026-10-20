'use client';

import { useBoolean, useMediaQuery } from '@siberiacancode/reactuse';
import { Suspense } from 'react';

import { MEDIA_QUERIES } from '@/shared/constants';
import { AppSidebar } from '@/widgets/app/app-sidebar';
import { MobileNav } from '@/widgets/layout/mobile-nav';
import { ChannelsPanel } from '@/widgets/room/channels-panel';
import { RoomSessionHost } from '@/widgets/room/room-session-host';
import { IncomingCallDialog } from '@/widgets/social/incoming-call-dialog';
import { OutgoingCallDialog } from '@/widgets/social/outgoing-call-dialog';

import type { AuthedShellProps } from './AuthedShell.types';

import s from './AuthedShell.module.scss';

export const AuthedShell = ({ children }: AuthedShellProps) => {
  const [channelsOpened, toggleChannels] = useBoolean(true);
  const [mobileNavOpen, toggleMobileNav] = useBoolean(false);

  const isDesktop = useMediaQuery(MEDIA_QUERIES.desktop);

  return (
    <div className={s.root}>
      <MobileNav open={mobileNavOpen} onOpenChange={toggleMobileNav} />
      <IncomingCallDialog />
      <OutgoingCallDialog />

      <div className={s.shell}>
        {isDesktop && (
          <>
            <AppSidebar channelsOpened={channelsOpened} onToggleChannels={() => toggleChannels()} />

            {channelsOpened && (
              <Suspense fallback={null}>
                <ChannelsPanel />
              </Suspense>
            )}
          </>
        )}

        <div className={s.content}>
          <div className={s.page}>{children}</div>
          <RoomSessionHost />
        </div>
      </div>
    </div>
  );
};
