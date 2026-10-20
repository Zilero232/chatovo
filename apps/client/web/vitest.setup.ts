import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

import '@testing-library/jest-dom/vitest';

window.matchMedia ??= ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn()
})) as unknown as typeof window.matchMedia;

afterEach(() => {
  cleanup();
});

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const location = { pathname: '/', search: {}, searchStr: '', hash: '', href: '/' };

  return {
    ...(await importOriginal<typeof import('@tanstack/react-router')>()),
    useNavigate: () => vi.fn(),
    useRouter: () => ({ history: { push: vi.fn(), replace: vi.fn(), back: vi.fn() } }),
    useLocation: (options?: { select?: (value: typeof location) => unknown }) =>
      options?.select ? options.select(location) : location,
    useSearch: (options?: { select?: (value: object) => unknown }) =>
      options?.select ? options.select({}) : {}
  };
});
