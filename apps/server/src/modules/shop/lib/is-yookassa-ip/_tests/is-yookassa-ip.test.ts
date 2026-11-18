import { describe, expect, it } from 'vitest';

import { isYookassaIp } from '../is-yookassa-ip';

describe('isYookassaIp', () => {
  it('accepts an address inside a YooKassa range', () => {
    expect(isYookassaIp({ ip: '185.71.76.5', allowLoopback: false })).toBe(true);
  });

  it('accepts an IPv4-mapped IPv6 address from a YooKassa range', () => {
    expect(isYookassaIp({ ip: '::ffff:77.75.153.10', allowLoopback: false })).toBe(true);
  });

  it('accepts the YooKassa IPv6 range', () => {
    expect(isYookassaIp({ ip: '2a02:5180::1', allowLoopback: false })).toBe(true);
  });

  it('refuses any other address', () => {
    expect(isYookassaIp({ ip: '8.8.8.8', allowLoopback: false })).toBe(false);
  });

  it('refuses loopback in production and allows it in development', () => {
    expect(isYookassaIp({ ip: '127.0.0.1', allowLoopback: false })).toBe(false);
    expect(isYookassaIp({ ip: '127.0.0.1', allowLoopback: true })).toBe(true);
  });

  it('refuses a malformed address', () => {
    expect(isYookassaIp({ ip: 'not-an-ip', allowLoopback: true })).toBe(false);
  });
});
