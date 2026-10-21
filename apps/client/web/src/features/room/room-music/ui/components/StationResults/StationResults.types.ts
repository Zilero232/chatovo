import type { RadioStation } from '@chatovo/schemas';

export type StationResultsProps = {
  isError: boolean;
  isPopular?: boolean;
  isSearching: boolean;
  stations: RadioStation[];
  onPlay: (station: RadioStation) => void;
};
