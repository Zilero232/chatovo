import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const lookup = vi.fn();
const fetchMock = vi.fn();

vi.mock('node:dns/promises', () => ({
  lookup: (...args: unknown[]) => lookup(...args)
}));

vi.mock('../../../core', () => ({ env: { OUTBOUND_PROXY_URL: undefined } }));

const { safeFetch } = await import('../safe-fetch');

const V4 = { address: '93.184.215.14', family: 4 };
const V6 = { address: '2606:2800:21f:cb07:6820:80da:af6b:8b2c', family: 6 };

const ok = () => new Response('hello', { status: 200, headers: { 'content-type': 'text/plain' } });

const requestedHost = (call: number) => new URL(String(fetchMock.mock.calls[call]?.[0])).hostname;

const fetchExample = () =>
  safeFetch({ url: 'https://example.com/', accept: '*/*', maxBytes: 1024 });

describe('safeFetch', () => {
  beforeEach(() => {
    lookup.mockReset();
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('connects to the IPv6 address first, pinned with the original host', async () => {
    lookup.mockResolvedValue([V4, V6]);
    fetchMock.mockResolvedValue(ok());

    const result = await fetchExample();

    expect(result?.body.toString()).toBe('hello');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(requestedHost(0)).toBe(`[${V6.address}]`);
    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({
      headers: { host: 'example.com' },
      tls: { serverName: 'example.com' },
      redirect: 'manual'
    });
  });

  it('falls back to IPv4 when the IPv6 connection fails', async () => {
    lookup.mockResolvedValue([V4, V6]);
    fetchMock.mockRejectedValueOnce(new Error('ENETUNREACH')).mockResolvedValueOnce(ok());

    const result = await fetchExample();

    expect(result?.body.toString()).toBe('hello');
    expect(requestedHost(1)).toBe(V4.address);
  });

  it('refuses a host when any of its addresses is private', async () => {
    lookup.mockResolvedValue([V6, { address: '10.0.0.5', family: 4 }]);

    await expect(fetchExample()).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('gives up when every address fails', async () => {
    lookup.mockResolvedValue([V4, V6]);
    fetchMock.mockRejectedValue(new Error('ECONNREFUSED'));

    await expect(fetchExample()).resolves.toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('re-checks the target of a redirect', async () => {
    lookup.mockResolvedValueOnce([V4]).mockResolvedValueOnce([{ address: '127.0.0.1', family: 4 }]);
    fetchMock.mockResolvedValueOnce(
      new Response(null, { status: 302, headers: { location: 'http://internal.example/' } })
    );

    await expect(fetchExample()).resolves.toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
