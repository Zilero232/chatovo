import ipaddr from 'ipaddr.js';

import type { IsYookassaIpInput } from './is-yookassa-ip.types';

import { LOOPBACK_CIDRS, YOOKASSA_WEBHOOK_CIDRS } from '../../config';

const toRange = (cidr: string) => ipaddr.parseCIDR(cidr);

const YOOKASSA_RANGES = YOOKASSA_WEBHOOK_CIDRS.map(toRange);
const LOOPBACK_RANGES = LOOPBACK_CIDRS.map(toRange);

export const isYookassaIp = ({ ip, allowLoopback }: IsYookassaIpInput): boolean => {
  if (!ipaddr.isValid(ip)) {
    return false;
  }

  const address = ipaddr.process(ip);
  const ranges = allowLoopback ? [...YOOKASSA_RANGES, ...LOOPBACK_RANGES] : YOOKASSA_RANGES;

  return ranges.some(
    ([range, prefix]) => address.kind() === range.kind() && address.match(range, prefix)
  );
};
