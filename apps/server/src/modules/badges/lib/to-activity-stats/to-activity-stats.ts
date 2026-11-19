import type { ActivityStats, ToActivityStatsInput } from './to-activity-stats.types';

const SECONDS_IN_MINUTE = 60;

const toCount = (value: bigint | number | null | undefined): number => Number(value ?? 0);

export const toActivityStats = ({ messages, calls }: ToActivityStatsInput): ActivityStats => ({
  talker: Math.floor(toCount(calls?.seconds) / SECONDS_IN_MINUTE),
  penPal: toCount(messages?.dmChats),
  wanderer: toCount(messages?.groupRooms),
  sharer: toCount(messages?.attachments),
  regular: toCount(messages?.activeDays)
});
