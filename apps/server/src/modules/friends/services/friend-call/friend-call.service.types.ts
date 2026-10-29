export type RingFriendCallInput = {
  userId: string;
  otherUserId: string;
};

export type DmCallActionInput = {
  callId: string;
  userId: string;
};

export type RequireDmCallInput = DmCallActionInput & {
  role: 'callee' | 'caller' | 'participant';
};
