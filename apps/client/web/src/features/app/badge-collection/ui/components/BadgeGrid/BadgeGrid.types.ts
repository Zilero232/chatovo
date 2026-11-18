import type { BadgeId, BadgeProgress } from '@chatovo/schemas';

export type BadgeGridProps = {
  title: string;
  badges: BadgeProgress[];
  selectedId: BadgeId | null;
  onSelect: (id: BadgeId) => void;
};
