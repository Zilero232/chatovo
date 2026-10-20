import type { ActivityRoomGroup } from '@/widgets/social/friends-activity/lib';

export type ActivityRoomsProps = {
  groups: ActivityRoomGroup[];
  onNavigate?: () => void;
};
