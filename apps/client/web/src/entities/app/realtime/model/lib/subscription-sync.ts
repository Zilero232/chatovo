import { getSubscribedRooms } from './subscription-registry';

type SubscriptionSender = () => void;

let sender: SubscriptionSender | null = null;
let pendingSync = false;

const flushRoomSubscriptions = (): void => {
  if (!sender) {
    pendingSync = true;
    return;
  }

  pendingSync = false;
  sender();
};

export const setSubscriptionSender = (next: SubscriptionSender | null): void => {
  sender = next;

  if (sender && pendingSync) {
    flushRoomSubscriptions();
  }
};

export const syncRoomSubscriptions = (): void => {
  if (!sender) {
    pendingSync = true;
    return;
  }

  flushRoomSubscriptions();
};

export const buildSubscribeMessage = () => ({
  op: 'subscribe' as const,
  rooms: getSubscribedRooms()
});
