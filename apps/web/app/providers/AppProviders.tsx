'use client';

import type { ReactNode } from 'react';

import { Toaster, TooltipProvider } from '@chatovo/ui-kit';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { MotionConfig } from 'motion/react';

import { queryClient } from '@/shared/api';
import { isTauriDesktop } from '@/shared/lib';
import { TitleBar } from '@/widgets/app/title-bar';

import { AuthProvider } from './AuthProvider';
import { EasterEggsProvider } from './EasterEggsProvider';
import { I18nProvider } from './I18nProvider';
import { QueryFocusManager } from './QueryFocusManager';
import { SessionExpiryWatcher } from './SessionExpiryWatcher';
import { TauriDesktopDocumentClass } from './TauriDesktopDocumentClass';
import { TauriMobileInsets } from './TauriMobileInsets';
import { TauriNativeMenuGuard } from './TauriNativeMenuGuard';
import { TrayMenuProvider } from './TrayMenuProvider';

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <QueryFocusManager />
      <SessionExpiryWatcher />
      <TauriMobileInsets />
      <TauriDesktopDocumentClass />
      <TauriNativeMenuGuard />
      <MotionConfig reducedMotion='user'>
        <TooltipProvider>
          <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
            {isTauriDesktop() && <TitleBar />}

            <div style={{ minHeight: 0, flex: 1 }}>
              <TrayMenuProvider>
                <AuthProvider>{children}</AuthProvider>
              </TrayMenuProvider>
            </div>
          </div>
        </TooltipProvider>
      </MotionConfig>

      <Toaster />
      <EasterEggsProvider />

      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools buttonPosition='bottom-right' />
      )}
    </I18nProvider>
  </QueryClientProvider>
);
