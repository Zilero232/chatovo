import { FRIEND_CHAT_QUERY_PARAM } from '@chatovo/schemas';
import { z } from 'zod';

const optionalParam = z.string().optional();

export const roomSearchSchema = z.object({
  id: optionalParam,
  title: optionalParam,
  view: optionalParam
});

export const lobbySearchSchema = z.object({
  [FRIEND_CHAT_QUERY_PARAM]: optionalParam
});

export const resetPasswordSearchSchema = z.object({
  token: optionalParam,
  error: optionalParam
});

// Plain URLSearchParams on both sides: every value stays a string and the URLs keep
// their shape (`/room?id=…&title=Team+sync`), so invite links in the wild still resolve.
export const parseSearch = (searchStr: string): Record<string, string> =>
  Object.fromEntries(new URLSearchParams(searchStr));

export const stringifySearch = (search: Record<string, unknown>): string => {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(search)) {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  }

  const query = params.toString();

  return query ? `?${query}` : '';
};
