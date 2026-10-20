import { describe, expect, it } from 'vitest';

import { buildDownloadUrl } from '../build-download-url';

const FILE = 'https://api.chatovo.ru/uploads/chat-attachments/r1/f1.png';

describe('buildDownloadUrl', () => {
  it('asks the api to serve the file as an attachment under its original name', () => {
    const url = new URL(buildDownloadUrl({ url: FILE, name: 'отпуск 2026.png' }));

    expect(url.searchParams.get('download')).toBe('отпуск 2026.png');
    expect(url.origin + url.pathname).toBe(FILE);
  });

  it('keeps a query the url already has', () => {
    const url = new URL(buildDownloadUrl({ url: `${FILE}?v=3`, name: 'a.png' }));

    expect(url.searchParams.get('v')).toBe('3');
  });

  it('leaves a relative url untouched', () => {
    expect(buildDownloadUrl({ url: '/brand/logo.png', name: 'logo.png' })).toBe('/brand/logo.png');
  });
});
