import type { ActivityRoomGroup } from '@/widgets/social/friends-activity/lib';

export type ActivityRoomCardProps = {
  group: ActivityRoomGroup;
  onNavigate?: () => void;
};
