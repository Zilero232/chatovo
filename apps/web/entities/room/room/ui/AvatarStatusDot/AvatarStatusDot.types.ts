import type { LucideIcon } from 'lucide-react';

export type AvatarStatusDotCorner = 'bottom-left' | 'bottom-right' | 'top-left';

export type AvatarStatusDotTone = 'danger' | 'gold';

export type AvatarStatusDotProps = {
  corner: AvatarStatusDotCorner;
  icon: LucideIcon;
  label: string;
  tone: AvatarStatusDotTone;
  className?: string;
};
