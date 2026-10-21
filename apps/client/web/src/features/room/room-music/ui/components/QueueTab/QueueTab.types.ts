import type { useMusicQueryField } from '../../../model/hooks';

export type QueueTabProps = {
  field: ReturnType<typeof useMusicQueryField>;
  onOpenMine: () => void;
  onOpenRadio: () => void;
  onSearchRadio: (query: string) => void;
};
