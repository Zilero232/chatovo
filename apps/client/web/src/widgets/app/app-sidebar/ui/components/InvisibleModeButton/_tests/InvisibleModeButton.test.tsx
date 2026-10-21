import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'use-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { en as messages } from '@/shared/i18n/locales/en';

const setGroup = vi.fn();

let invisibleMode = false;

vi.mock('@/entities/app/settings', () => ({
  useAppSettings: () => ({ settings: { system: { invisibleMode } }, setGroup })
}));

const { InvisibleModeButton } = await import('../InvisibleModeButton');

const renderButton = () =>
  render(
    <IntlProvider locale='en' messages={messages} timeZone='UTC'>
      <InvisibleModeButton variant='rail' />
    </IntlProvider>
  );

describe('InvisibleModeButton', () => {
  beforeEach(() => {
    setGroup.mockReset();
    invisibleMode = false;
  });

  it('turns invisible mode on in one click', async () => {
    renderButton();

    await userEvent.click(
      screen.getByRole('button', { name: messages.settings.system.invisibleMode })
    );

    expect(setGroup).toHaveBeenCalledWith('system', { invisibleMode: true });
  });

  it('turns invisible mode off in one click while it is on', async () => {
    invisibleMode = true;

    renderButton();

    await userEvent.click(
      screen.getByRole('button', { name: messages.settings.system.invisibleMode })
    );

    expect(setGroup).toHaveBeenCalledWith('system', { invisibleMode: false });
  });

  it('reports the current mode as its pressed state', () => {
    invisibleMode = true;

    renderButton();

    const button = screen.getByRole('button', { name: messages.settings.system.invisibleMode });

    expect(button.getAttribute('aria-pressed')).toBe('true');
  });
});
