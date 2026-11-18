import type { BadgeId } from '@chatovo/schemas';
import type { LucideIcon } from 'lucide-react';

import { Gem, Heart, Hourglass, MessageCircle, Radio, Users } from 'lucide-react';

export const BADGE_ICONS: Record<BadgeId, LucideIcon> = {
  supporter: Heart,
  veteran: Hourglass,
  social: Users,
  chatter: MessageCircle,
  host: Radio,
  collector: Gem
};
