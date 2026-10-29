import { useDmCalls } from './use-dm-calls';

export const useDmCallForRoom = (roomId: string | null | undefined) => {
  const { current } = useDmCalls();

  return current && current.roomId === roomId ? current : null;
};
