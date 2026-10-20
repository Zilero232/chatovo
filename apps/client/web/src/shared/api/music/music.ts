import type { RadioStationsResponse, RoomMusic } from '@chatovo/schemas';

import type {
  ControlRoomMusicInput,
  DequeueRoomMusicInput,
  EnqueueRoomMusicInput
} from './music.types';

import { api } from '../http';

export const getRoomMusic = async (roomId: string): Promise<RoomMusic> => {
  const { data } = await api.get(`/music/rooms/${roomId}`);

  return data;
};

export const enqueueRoomMusic = async ({
  roomId,
  item
}: EnqueueRoomMusicInput): Promise<RoomMusic> => {
  const { data } = await api.post(`/music/rooms/${roomId}/queue`, { item });

  return data;
};

export const dequeueRoomMusic = async ({
  roomId,
  trackId
}: DequeueRoomMusicInput): Promise<RoomMusic> => {
  const { data } = await api.delete(`/music/rooms/${roomId}/queue/${trackId}`);

  return data;
};

export const controlRoomMusic = async ({
  roomId,
  command
}: ControlRoomMusicInput): Promise<RoomMusic> => {
  const { data } = await api.post(`/music/rooms/${roomId}/playback`, { command });

  return data;
};

export const searchRadioStations = async (query: string): Promise<RadioStationsResponse> => {
  const { data } = await api.get('/music/radio', { params: { query } });

  return data;
};
