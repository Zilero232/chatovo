import { format, isSameDay, isToday, isYesterday, parseISO } from 'date-fns';
import { isNumber, isString } from 'remeda';

import type { DateDivider } from './format-date.types';

const toDate = (value: number | string | Date) => {
  if (isNumber(value)) {
    return new Date(value);
  }

  return isString(value) ? parseISO(value) : value;
};

/** Chat timestamp: time only for today, "yesterday, HH:mm", otherwise a short date. */
export const formatMessageTime = (timestamp: number | Date) => {
  const date = toDate(timestamp);

  if (isToday(date)) {
    return format(date, 'HH:mm');
  }

  if (isYesterday(date)) {
    return `yesterday, ${format(date, 'HH:mm')}`;
  }

  return format(date, 'd MMM, HH:mm');
};

export const isSameCalendarDay = (a: number | Date, b: number | Date) =>
  isSameDay(toDate(a), toDate(b));

/** Full timestamp for admin tables and detail panels. */
export const formatDateTime = (value: number | string | Date) =>
  format(toDate(value), 'd MMM yyyy, HH:mm');

/** Short day label for chart axes; an empty input yields an empty label. */
export const formatDay = (value: number | string | Date) => {
  if (!value) {
    return '';
  }

  return format(toDate(value), 'd MMM');
};

/** Divider descriptor for a chat day separator; the label is filled only for older dates. */
export const getDateDivider = (timestamp: number | Date): DateDivider => {
  const date = toDate(timestamp);

  if (isToday(date)) {
    return { kind: 'today' };
  }

  if (isYesterday(date)) {
    return { kind: 'yesterday' };
  }

  return { kind: 'date', label: format(date, 'd MMMM yyyy') };
};
