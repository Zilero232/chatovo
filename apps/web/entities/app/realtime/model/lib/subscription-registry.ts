const roomRefCounts = new Map<string, number>();

export const addSubscriptionRooms = (roomIds: string[]) => {
  for (const roomId of roomIds) {
    roomRefCounts.set(roomId, (roomRefCounts.get(roomId) ?? 0) + 1);
  }
};

export const removeSubscriptionRooms = (roomIds: string[]) => {
  for (const roomId of roomIds) {
    const next = (roomRefCounts.get(roomId) ?? 0) - 1;

    if (next <= 0) {
      roomRefCounts.delete(roomId);
    } else {
      roomRefCounts.set(roomId, next);
    }
  }
};

export const getSubscribedRooms = (): string[] => [...roomRefCounts.keys()].sort();
