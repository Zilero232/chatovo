import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { en as messages } from '@/shared/i18n/locales/en';

const push = vi.fn();

let pathname = '/room';
let dmUnread = 0;
let incomingRequests: { friendshipId: string }[] = [];

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  usePathname: () => pathname
}));

vi.mock('@/features/social/friend-chat', () => ({
  useFriendChat: () => ({ dmUnread })
}));

vi.mock('@/entities/social/friend', () => ({
  useIncomingFriendRequests: () => ({ data: incomingRequests })
}));

const { LobbyButton } = await import('../LobbyButton');

const renderButton = (onNavigate?: () => void) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider locale='en' messages={messages} timeZone='UTC'>
        {children}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );

  return render(<LobbyButton onNavigate={onNavigate} />, { wrapper: Wrapper });
};

describe('LobbyButton', () => {
  beforeEach(() => {
    push.mockReset();
    pathname = '/room';
    dmUnread = 0;
    incomingRequests = [];
  });

  it('navigates client-side, so an open call survives the move', async () => {
    renderButton();

    await userEvent.click(screen.getByRole('button', { name: messages.appSidebar.lobby }));

    expect(push).toHaveBeenCalledWith('/lobby');
  });

  it('closes the mobile drawer it was opened from', async () => {
    const onNavigate = vi.fn();

    renderButton(onNavigate);

    await userEvent.click(screen.getByRole('button', { name: messages.appSidebar.lobby }));

    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it('marks itself as the current page while the lobby is open', () => {
    pathname = '/lobby';

    renderButton();

    const button = screen.getByRole('button', { name: messages.appSidebar.lobby });

    expect(button.getAttribute('aria-current')).toBe('page');
  });

  it('carries no current-page marker from another route', () => {
    renderButton();

    const button = screen.getByRole('button', { name: messages.appSidebar.lobby });

    expect(button.getAttribute('aria-current')).toBeNull();
  });

  it('sums unread DMs and incoming requests into one badge', () => {
    dmUnread = 2;
    incomingRequests = [{ friendshipId: 'a' }, { friendshipId: 'b' }, { friendshipId: 'c' }];

    renderButton();

    expect(screen.getByText('5')).not.toBeNull();
  });

  it('shows no badge when nothing is waiting', () => {
    renderButton();

    expect(screen.queryByText('0')).toBeNull();
  });
});
