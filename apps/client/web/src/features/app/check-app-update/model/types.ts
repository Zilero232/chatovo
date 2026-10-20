export type UpdateStatus =
  'available' | 'checking' | 'downloading' | 'error' | 'idle' | 'installing' | 'unavailable';

export type UpdateInfo = {
  currentVersion: string | null;
  date: string | null;
  progress: number;
  silent: boolean;
  status: UpdateStatus;
  version: string | null;
  dismiss: () => void;
  install: () => void;
};
