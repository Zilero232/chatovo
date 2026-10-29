export type FriendCallBannerProps = {
  duration: string | null;
  status: 'calling' | 'inCall' | 'ongoing';
  onJoin: () => void;
};
