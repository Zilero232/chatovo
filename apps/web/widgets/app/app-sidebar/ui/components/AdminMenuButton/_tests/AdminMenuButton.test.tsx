import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

import { en as messages } from '@/shared/i18n/locales/en';

const setGroup = vi.fn();

vi.mock('@/entities/auth/user', () => ({
  useCurrentUser: () => ({ isAdmin: true })
}));

vi.mock('@/entities/app/settings', () => ({
  useAppSettings: () => ({ settings: { system: { invisibleMode: false } }, setGroup })
}));

const { AdminMenuButton } = await import('../AdminMenuButton');

const renderMenu = () =>
  render(
    <NextIntlClientProvider locale='en' messages={messages} timeZone='UTC'>
      <AdminMenuButton />
    </NextIntlClientProvider>
  );

describe('AdminMenuButton', () => {
  it('opens the menu and shows both admin entries', async () => {
    const user = userEvent.setup();

    renderMenu();
    await user.click(screen.getByRole('button', { name: messages.admin.menuLabel }));

    expect(await screen.findByText(messages.admin.openPanel)).toBeTruthy();
    expect(screen.getByText(messages.settings.system.invisibleMode)).toBeTruthy();
  });

  it('toggles invisible mode from the menu', async () => {
    const user = userEvent.setup();

    renderMenu();
    await user.click(screen.getByRole('button', { name: messages.admin.menuLabel }));
    await user.click(await screen.findByText(messages.settings.system.invisibleMode));

    expect(setGroup).toHaveBeenCalledWith('system', { invisibleMode: true });
  });
});
