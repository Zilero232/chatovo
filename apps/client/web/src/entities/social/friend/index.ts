export {
  useAcceptFriendRequest,
  useAcceptIncomingFriendCall,
  useCallFriend,
  useCancelOutgoingFriendCall,
  useCloseWhenCallAccepted,
  useDeclineFriendRequest,
  useDeclineIncomingFriendCall,
  useFriendCallRingtone,
  useFriends,
  useFriendshipRelation,
  useIncomingFriendCall,
  useIncomingFriendRequests,
  useOutgoingFriendCall,
  useRemoveFriendship,
  useSendFriendRequest
} from './model/hooks';
export type { CallFriendInput } from './model/hooks/use-call-friend';
export { FriendsRealtimeSync } from './ui/controllers/FriendsRealtimeSync/FriendsRealtimeSync';

export { FriendTag } from './ui/FriendTag/FriendTag';
