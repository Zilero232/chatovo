import { isValid, parse, parseISO } from 'date-fns';

const TAURI_DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss.SSS xxxxx';

export const parseTauriDate = (raw: string | null | undefined) => {
  if (!raw) {
    return null;
  }

  const tauriDate = parse(raw, TAURI_DATE_FORMAT, new Date());

  if (isValid(tauriDate)) {
    return tauriDate;
  }

  const isoDate = parseISO(raw);

  return isValid(isoDate) ? isoDate : null;
};
