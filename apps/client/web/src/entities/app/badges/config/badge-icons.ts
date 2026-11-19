import type { BadgeId } from '@chatovo/schemas';
import type { LucideIcon } from 'lucide-react';

import {
  CalendarCheck,
  Compass,
  Gem,
  Heart,
  Hourglass,
  Mail,
  MessageCircle,
  Palette,
  Paperclip,
  Phone,
  Radio,
  Users
} from 'lucide-react';

export const BADGE_ICONS: Record<BadgeId, LucideIcon> = {
  supporter: Heart,
  veteran: Hourglass,
  social: Users,
  chatter: MessageCircle,
  host: Radio,
  collector: Gem,
  talker: Phone,
  penPal: Mail,
  wanderer: Compass,
  sharer: Paperclip,
  regular: CalendarCheck,
  stylist: Palette
};
