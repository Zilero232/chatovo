import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'use-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { en as messages } from '@/shared/i18n/locales/en';

const navigate = vi.fn();

let pathname = '/lobby';

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigate,
  useLocation: ({ select }: { select: (location: { pathname: string }) => string }) =>
    select({ pathname })
}));

const { AdminPanelButton } = await import('../AdminPanelButton');

const renderButton = (onNavigate?: () => void) =>
  render(
    <IntlProvider locale='en' messages={messages} timeZone='UTC'>
      <AdminPanelButton variant='rail' onNavigate={onNavigate} />
    </IntlProvider>
  );

describe('AdminPanelButton', () => {
  beforeEach(() => {
    navigate.mockReset();
    pathname = '/lobby';
  });

  it('opens the admin panel in one click and closes the drawer', async () => {
    const onNavigate = vi.fn();

    renderButton(onNavigate);

    await userEvent.click(screen.getByRole('button', { name: messages.admin.openPanel }));

    expect(navigate).toHaveBeenCalledWith({ to: '/admin' });
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it('marks itself as the current page on a nested admin route', () => {
    pathname = '/admin/users';

    renderButton();

    const button = screen.getByRole('button', { name: messages.admin.openPanel });

    expect(button.getAttribute('aria-current')).toBe('page');
  });
});
