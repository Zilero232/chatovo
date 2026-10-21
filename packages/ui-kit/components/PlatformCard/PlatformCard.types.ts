import type { LucideIcon } from 'lucide-react';

export type PlatformCardLink = {
  actionLabel: string;
  caption: string;
  download?: boolean;
  href: string;
  ActionIcon: LucideIcon;
};

export type PlatformCardProps = {
  Icon: LucideIcon;
  label: string;
  /** Shown instead of a download action when there is no `link` for the platform. */
  unavailableLabel?: string;
  link?: PlatformCardLink;
};
