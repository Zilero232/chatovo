import { useRealtime } from '@/entities/app/realtime';

export const useRoomsPresence = () => {
  const { presence } = useRealtime();

  return presence.rooms;
};
