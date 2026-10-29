import type {
  DmCallView,
  FriendEntry,
  FriendRequestEntry,
  FriendshipRelation,
  Room,
  SendFriendRequestInput,
  UserBlockEntry
} from '@chatovo/schemas';

import { api } from '../http';

export const listFriends = async (): Promise<FriendEntry[]> => {
  const { data } = await api.get('/friends');

  return data;
};

export const listIncomingFriendRequests = async (): Promise<FriendRequestEntry[]> => {
  const { data } = await api.get('/friends/requests/incoming');

  return data;
};

export const getFriendshipRelation = async (userId: string): Promise<FriendshipRelation> => {
  const { data } = await api.get(`/friends/relations/${userId}`);

  return data;
};

export const sendFriendRequest = async (
  input: SendFriendRequestInput
): Promise<FriendshipRelation> => {
  const { data } = await api.post('/friends/requests', input);

  return data;
};

export const acceptFriendRequest = async (friendshipId: string): Promise<FriendshipRelation> => {
  const { data } = await api.post(`/friends/requests/${friendshipId}/accept`);

  return data;
};

export const declineFriendRequest = async (friendshipId: string): Promise<void> => {
  await api.post(`/friends/requests/${friendshipId}/decline`);
};

export const removeFriendship = async (userId: string): Promise<void> => {
  await api.delete(`/friends/${userId}`);
};

export const listBlockedUsers = async (): Promise<UserBlockEntry[]> => {
  const { data } = await api.get('/friends/blocks');

  return data;
};

export const blockUser = async (userId: string): Promise<UserBlockEntry> => {
  const { data } = await api.post(`/friends/blocks/${userId}`);

  return data;
};

export const unblockUser = async (userId: string): Promise<void> => {
  await api.delete(`/friends/blocks/${userId}`);
};

export const getOrCreateFriendDmRoom = async (userId: string): Promise<Room> => {
  const { data } = await api.post(`/friends/${userId}/dm-room`);

  return data;
};

export type DmCallCommand = 'accept' | 'cancel' | 'decline' | 'hangup';

export type SendDmCallCommandInput = {
  callId: string;
  command: DmCallCommand;
};

export const startDmCall = async (userId: string): Promise<DmCallView> => {
  const { data } = await api.post(`/friends/${userId}/calls`);

  return data;
};

export const sendDmCallCommand = async ({ callId, command }: SendDmCallCommandInput) => {
  await api.post(`/friends/calls/${callId}/${command}`);
};
