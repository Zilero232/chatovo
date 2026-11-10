import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { sortBy } from 'remeda';

import type {
  ReadBodyInput,
  RequestPinnedInput,
  SafeFetchInput,
  SafeFetchResult
} from './safe-fetch.types';

import { OUTBOUND } from '../../config/outbound';
import { env } from '../../core';
import { isPublicAddress } from '../is-public-address';

const resolvePublicAddresses = async (hostname: string): Promise<string[]> => {
  const bare = hostname.replace(/^\[|\]$/g, '');

  if (isIP(bare)) {
    return isPublicAddress(bare) ? [bare] : [];
  }

  const addresses = await lookup(bare, { all: true, verbatim: true });
  const allPublic = addresses.every(({ address }) => isPublicAddress(address));

  if (!allPublic) {
    return [];
  }

  return sortBy(addresses, [({ family }) => family, 'desc']).map(({ address }) => address);
};

const pinToAddress = (url: URL, address: string): string => {
  const pinned = new URL(url);

  pinned.hostname = isIP(address) === 6 ? `[${address}]` : address;

  return pinned.toString();
};

const isFetchableUrl = (url: URL): boolean => {
  const { protocol, port, username, password } = url;

  return (
    (protocol === 'http:' || protocol === 'https:') &&
    OUTBOUND.allowedPorts.has(port) &&
    !username &&
    !password
  );
};

const requestPinned = async ({ url, accept, signal }: RequestPinnedInput) => {
  if (!isFetchableUrl(url)) {
    return null;
  }

  const addresses = await resolvePublicAddresses(url.hostname);

  for (const address of addresses) {
    try {
      return await fetch(pinToAddress(url, address), {
        headers: {
          host: url.host,
          accept,
          'accept-language': OUTBOUND.acceptLanguage,
          'user-agent': OUTBOUND.userAgent
        },
        redirect: 'manual',
        signal: AbortSignal.any([signal, AbortSignal.timeout(OUTBOUND.attemptTimeoutMs)]),
        proxy: env.OUTBOUND_PROXY_URL,
        tls: { serverName: url.hostname }
      });
    } catch (error) {
      if (signal.aborted) {
        throw error;
      }
    }
  }

  return null;
};

const readBody = async ({
  response,
  maxBytes,
  truncate
}: ReadBodyInput): Promise<Buffer | null> => {
  const declaredLength = Number(response.headers.get('content-length') ?? 0);

  if (!truncate && declaredLength > maxBytes) {
    await response.body?.cancel();

    return null;
  }

  const chunks: Uint8Array[] = [];
  let received = 0;

  for await (const chunk of response.body ?? []) {
    chunks.push(chunk);
    received += chunk.byteLength;

    if (received > maxBytes) {
      break;
    }
  }

  if (received > maxBytes && !truncate) {
    return null;
  }

  return Buffer.concat(chunks).subarray(0, maxBytes);
};

const isRedirect = (response: Response): boolean =>
  response.status >= 300 && response.status < 400 && response.headers.has('location');

/**
 * Fetches a public http(s) URL without letting it reach the server's own network: every hop,
 * redirects included, is resolved once, refused unless all its addresses are public, and the
 * connection is pinned to a checked address (no DNS rebinding), IPv6 first — sites blocked from
 * RU over IPv4 (YouTube) still answer over IPv6. Null on any failure.
 */
export const safeFetch = async ({
  url,
  accept,
  maxBytes,
  truncate = false
}: SafeFetchInput): Promise<SafeFetchResult | null> => {
  const signal = AbortSignal.timeout(OUTBOUND.timeoutMs);

  try {
    let current = new URL(url);

    for (let hop = 0; hop <= OUTBOUND.maxRedirects; hop += 1) {
      const response = await requestPinned({ url: current, accept, signal });

      if (!response) {
        return null;
      }

      if (isRedirect(response)) {
        await response.body?.cancel();
        current = new URL(response.headers.get('location') ?? '', current);

        continue;
      }

      if (!response.ok) {
        await response.body?.cancel();

        return null;
      }

      const body = await readBody({ response, maxBytes, truncate });

      return body
        ? { url: current.toString(), contentType: response.headers.get('content-type') ?? '', body }
        : null;
    }

    return null;
  } catch {
    return null;
  }
};
