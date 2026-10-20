import type { CreateRoomRequest, Room, UpdateRoomRequest } from '@chatovo/schemas';

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
