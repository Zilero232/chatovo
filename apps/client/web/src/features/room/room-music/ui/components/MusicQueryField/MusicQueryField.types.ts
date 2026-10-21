import type { useMusicQueryField } from '../../../model/hooks';

export type MusicQueryFieldProps = {
  field: ReturnType<typeof useMusicQueryField>;
  isBusy: boolean;
  kind: 'link' | 'radio';
};
