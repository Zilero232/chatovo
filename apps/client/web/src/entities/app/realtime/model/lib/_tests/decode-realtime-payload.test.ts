import { describe, expect, it } from 'vitest';

import { decodeRealtimePayload } from '../decode-realtime-payload';

describe('decodeRealtimePayload', () => {
  it('passes a text frame through untouched', async () => {
    await expect(decodeRealtimePayload('{"type":"ping"}')).resolves.toBe('{"type":"ping"}');
  });

  it('reads a binary frame delivered as a Blob', async () => {
    await expect(decodeRealtimePayload(new Blob(['hello']))).resolves.toBe('hello');
  });

  it('decodes a raw ArrayBuffer frame as UTF-8', async () => {
    const bytes = new TextEncoder().encode('привет');
    const buffer = new ArrayBuffer(bytes.byteLength);

    new Uint8Array(buffer).set(bytes);

    await expect(decodeRealtimePayload(buffer)).resolves.toBe('привет');
  });

  it('returns null for a frame shape the socket should never send', async () => {
    await expect(decodeRealtimePayload(42)).resolves.toBeNull();
    await expect(decodeRealtimePayload(null)).resolves.toBeNull();
    await expect(decodeRealtimePayload(undefined)).resolves.toBeNull();
  });

  it('preserves an empty text frame instead of reporting it as undecodable', async () => {
    await expect(decodeRealtimePayload('')).resolves.toBe('');
  });
});
