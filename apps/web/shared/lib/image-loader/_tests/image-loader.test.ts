import { afterEach, describe, expect, it, vi } from 'vitest';

const API_URL = 'http://localhost:4000';

const apiEnv = vi.hoisted(() => ({ NEXT_PUBLIC_API_URL: 'http://localhost:4000' }));

vi.mock('@/shared/config', () => ({ env: apiEnv }));

const { default: imageLoader, isOptimizableImage } = await import('../image-loader');

const UPLOAD = `${API_URL}/uploads/avatars/u1/avatar.webp?v=7`;
const GITHUB_AVATAR = 'https://avatars.githubusercontent.com/u/1?v=4';

afterEach(() => {
  apiEnv.NEXT_PUBLIC_API_URL = API_URL;
});

describe('isOptimizableImage', () => {
  it('accepts an upload served by the api', () => {
    expect(isOptimizableImage(UPLOAD)).toBe(true);
  });

  it('accepts an allow-listed remote host', () => {
    expect(isOptimizableImage(GITHUB_AVATAR)).toBe(true);
  });

  it('refuses a generated data url avatar', () => {
    expect(isOptimizableImage('data:image/svg+xml;utf8,<svg/>')).toBe(false);
  });

  it('refuses a blob url from a local preview', () => {
    expect(isOptimizableImage('blob:http://localhost:3000/5b1c')).toBe(false);
  });

  it('refuses a static asset path', () => {
    expect(isOptimizableImage('/brand/app-icon-1024.png')).toBe(false);
  });

  it('refuses an api path outside the uploads folder', () => {
    expect(isOptimizableImage(`${API_URL}/health`)).toBe(false);
  });

  it('refuses an arbitrary remote image', () => {
    expect(isOptimizableImage('https://example.com/cat.png')).toBe(false);
  });

  it('refuses everything while the api address is relative', () => {
    apiEnv.NEXT_PUBLIC_API_URL = '/api';

    expect(isOptimizableImage(GITHUB_AVATAR)).toBe(false);
  });
});

describe('imageLoader', () => {
  it('routes an upload through the optimizer with the requested width and quality', () => {
    const url = new URL(imageLoader({ src: UPLOAD, width: 256, quality: 90 }));

    expect(url.origin + url.pathname).toBe(`${API_URL}/images`);
    expect(Object.fromEntries(url.searchParams)).toEqual({ url: UPLOAD, w: '256', q: '90' });
  });

  it('falls back to the default quality when none is given', () => {
    const url = new URL(imageLoader({ src: UPLOAD, width: 64 }));

    expect(url.searchParams.get('q')).toBe('75');
  });

  it('does not double the slash when the api address ends with one', () => {
    apiEnv.NEXT_PUBLIC_API_URL = `${API_URL}/`;

    expect(new URL(imageLoader({ src: UPLOAD, width: 64 })).pathname).toBe('/images');
  });

  it('keeps a path prefix of the api address', () => {
    apiEnv.NEXT_PUBLIC_API_URL = `${API_URL}/api`;

    expect(new URL(imageLoader({ src: GITHUB_AVATAR, width: 64 })).pathname).toBe('/api/images');
  });

  it('passes a source the optimizer refuses through untouched', () => {
    expect(imageLoader({ src: '/brand/logo.png', width: 64 })).toBe('/brand/logo.png');
  });
});
