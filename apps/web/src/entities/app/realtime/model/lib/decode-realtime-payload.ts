import { isString } from 'remeda';

export const decodeRealtimePayload = async (raw: unknown): Promise<string | null> => {
  if (isString(raw)) {
    return raw;
  }

  if (raw instanceof Blob) {
    return raw.text();
  }

  if (raw instanceof ArrayBuffer) {
    return new TextDecoder().decode(raw);
  }

  return null;
};
