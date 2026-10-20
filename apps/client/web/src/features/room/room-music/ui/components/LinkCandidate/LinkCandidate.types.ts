import type { MusicLink } from '@chatovo/schemas';

export type LinkCandidateProps = {
  isPending: boolean;
  link: MusicLink;
  onAdd: () => void;
};
