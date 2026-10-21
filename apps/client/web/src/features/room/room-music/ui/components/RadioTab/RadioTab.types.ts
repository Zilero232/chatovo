import type { useMusicQueryField, useStationSearch } from '../../../model/hooks';

export type RadioTabProps = {
  field: ReturnType<typeof useMusicQueryField>;
  stations: ReturnType<typeof useStationSearch>;
  onOpenMine: () => void;
};
