import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

import { en as messages } from '@/shared/i18n/locales/en';

const signUp = vi.fn();

vi.mock('@/shared/api', () => ({
  authClient: { signUp: { email: signUp }, getSession: vi.fn() },
  unwrapAuth: (promise: Promise<unknown>) => promise
}));

const { SignUpForm } = await import('../SignUpForm');

const renderForm = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider locale='en' messages={messages} timeZone='UTC'>
        <SignUpForm />
      </NextIntlClientProvider>
    </QueryClientProvider>
  );
};

const fillCredentials = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/name/i), 'Tester');
  await user.type(screen.getByLabelText(/email/i), 'tester@example.com');
  await user.type(screen.getByLabelText(/^password$/i), 'password123');
  await user.type(screen.getByLabelText(/confirm password/i), 'password123');
};

describe('SignUpForm consent', () => {
  it('refuses to submit and shows an error when the box is unchecked', async () => {
    const user = userEvent.setup();

    renderForm();
    await fillCredentials(user);
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    const alert = await screen.findByRole('alert');

    expect(alert.textContent).toBe(messages.auth.validation.termsRequired);
    expect(signUp).not.toHaveBeenCalled();
  });

  it('submits once the box is checked', async () => {
    const user = userEvent.setup();

    signUp.mockResolvedValue({ data: {}, error: null });

    renderForm();
    await fillCredentials(user);
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => expect(signUp).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
