import type { RadioGenre } from '../../../model/types';

export type GenreChipsProps = {
  activeQuery: string;
  onPick: (genre: RadioGenre) => void;
};
