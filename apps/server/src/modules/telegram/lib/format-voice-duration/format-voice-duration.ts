import { formatDuration, intervalToDuration } from 'date-fns';
import { ru } from 'date-fns/locale';

export const formatVoiceDuration = (durationMs: number): string => {
  const duration = intervalToDuration({ start: 0, end: Math.max(0, durationMs) });
  const formatted = formatDuration(duration, { format: ['days', 'hours', 'minutes'], locale: ru });

  return formatted === '' ? 'меньше минуты' : formatted;
};
