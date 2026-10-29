import { describe, expect, it, vi } from 'vitest';

const findUser = vi.fn();

vi.mock('../../../core', () => ({
  basePrisma: { user: { findUnique: (...args: unknown[]) => findUser(...args) } }
}));

const { assertIsAdmin } = await import('../assert-is-admin');

describe('assertIsAdmin', () => {
  it('opens the admin panel to the owner and admins', async () => {
    findUser.mockResolvedValueOnce({ role: 'owner' });
    await expect(assertIsAdmin('owner-1')).resolves.toBeUndefined();

    findUser.mockResolvedValueOnce({ role: 'admin' });
    await expect(assertIsAdmin('admin-1')).resolves.toBeUndefined();
  });

  it('keeps a moderator out of the admin panel', async () => {
    findUser.mockResolvedValueOnce({ role: 'moderator' });

    await expect(assertIsAdmin('moderator-1')).rejects.toMatchObject({
      response: { code: 'ADMIN_ONLY' }
    });
  });

  it('keeps out an account that no longer exists', async () => {
    findUser.mockResolvedValueOnce(null);

    await expect(assertIsAdmin('gone-1')).rejects.toMatchObject({
      response: { code: 'ADMIN_ONLY' }
    });
  });
});
