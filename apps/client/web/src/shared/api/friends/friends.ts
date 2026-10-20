import type {
  FriendEntry,
  FriendRequestEntry,
  FriendshipRelation,
  IncomingFriendCall,
  IncomingFriendCallResponse,
  OutgoingFriendCallResponse,
  Room,
  SendFriendRequestInput
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

export const getOrCreateFriendDmRoom = async (userId: string): Promise<Room> => {
  const { data } = await api.post(`/friends/${userId}/dm-room`);

  return data;
};

export const ringFriendCall = async (userId: string): Promise<Room> => {
  const { data } = await api.post(`/friends/${userId}/call`);

  return data;
};

export const getIncomingFriendCall = async (): Promise<IncomingFriendCallResponse> => {
  const { data } = await api.get('/friends/calls/incoming');

  return data;
};

export const acceptIncomingFriendCall = async (): Promise<IncomingFriendCall | null> => {
  const { data } = await api.post('/friends/calls/accept');

  return data;
};

export const declineIncomingFriendCall = async (): Promise<void> => {
  await api.post('/friends/calls/decline');
};

export const cancelOutgoingFriendCall = async (): Promise<void> => {
  await api.post('/friends/calls/cancel');
};

export const getOutgoingFriendCall = async (): Promise<OutgoingFriendCallResponse> => {
  const { data } = await api.get('/friends/calls/outgoing');

  return data;
};

export const ackOutgoingFriendCall = async (): Promise<void> => {
  await api.post('/friends/calls/ack');
};
