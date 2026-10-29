export {
  acceptFriendRequest,
  blockUser,
  declineFriendRequest,
  getFriendshipRelation,
  getOrCreateFriendDmRoom,
  listBlockedUsers,
  listFriends,
  listIncomingFriendRequests,
  removeFriendship,
  sendDmCallCommand,
  sendFriendRequest,
  startDmCall,
  unblockUser
} from './friends';
export type { DmCallCommand, SendDmCallCommandInput } from './friends';
