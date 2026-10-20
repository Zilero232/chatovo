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
  link?: PlatformCardLink;
};
