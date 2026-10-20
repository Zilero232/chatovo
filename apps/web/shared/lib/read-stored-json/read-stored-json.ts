import { STORAGE_EVENT } from '@siberiacancode/reactuse';

export const readStoredJson = <TValue>(key: string, fallback: TValue): TValue => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);

  if (!raw) {
    return fallback;
  }

  try {
    return (JSON.parse(raw) as TValue) ?? fallback;
  } catch {
    return fallback;
  }
};

/** Writes JSON to localStorage and notifies useStorage subscribers in this tab. */
export const writeStoredJson = <TValue>(key: string, value: TValue): void => {
  if (typeof window === 'undefined') {
    return;
  }

  const oldValue = window.localStorage.getItem(key);
  const newValue = JSON.stringify(value);

  window.localStorage.setItem(key, newValue);

  window.dispatchEvent(
    new StorageEvent(STORAGE_EVENT, {
      key,
      oldValue,
      newValue,
      storageArea: window.localStorage
    })
  );
};
