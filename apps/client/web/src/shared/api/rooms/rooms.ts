import type { CreateRoomRequest, Room, RoomBan, UpdateRoomRequest } from '@chatovo/schemas';

import type { ModerateRoomParticipantInput, UnbanRoomUserInput } from './rooms.types';

import { api } from '../http';

export const listRooms = async (): Promise<Room[]> => {
  const { data } = await api.get('/rooms');

  return data;
};

export const createRoom = async (input: CreateRoomRequest): Promise<Room> => {
  const { data } = await api.post('/rooms', input);

  return data;
};

export const getRoom = async (id: string): Promise<Room> => {
  const { data } = await api.get(`/rooms/${id}`);

  return data;
};

export const updateRoom = async (id: string, input: UpdateRoomRequest): Promise<Room> => {
  const { data } = await api.patch(`/rooms/${id}`, input);

  return data;
};

export const deleteRoom = async (id: string): Promise<void> => {
  await api.delete(`/rooms/${id}`);
};

export const listRoomBans = async (roomId: string): Promise<RoomBan[]> => {
  const { data } = await api.get(`/rooms/${roomId}/bans`);

  return data;
};

export const unbanRoomUser = async ({ roomId, userId }: UnbanRoomUserInput): Promise<void> => {
  await api.delete(`/rooms/${roomId}/bans/${userId}`);
};

export const moderateRoomParticipant = async ({
  roomId,
  userId,
  action
}: ModerateRoomParticipantInput): Promise<void> => {
  await api.post(`/rooms/${roomId}/participants/${userId}/${action}`);
};
