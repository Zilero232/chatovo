import type { RealtimeServerMessage } from '@chatovo/schemas';
import type { WebSocket } from 'ws';

import type {
  PresenceSnapshots,
  RealtimeConnection,
  UnsubscribeUserFromRoomInput
} from './realtime.types';

import { bindRealtimeBroadcast as bindEmit } from './emit';

const connections = new Map<string, RealtimeConnection>();
const byUser = new Map<string, Set<string>>();
const byRoom = new Map<string, Set<string>>();

const send = (connection: RealtimeConnection, message: RealtimeServerMessage): void => {
  try {
    connection.ws.send(JSON.stringify(message));
  } catch {}
};

const addToSet = (map: Map<string, Set<string>>, key: string, value: string) => {
  let bucket = map.get(key);

  if (!bucket) {
    bucket = new Set();
    map.set(key, bucket);
  }

  bucket.add(value);
};

const removeFromSet = (map: Map<string, Set<string>>, key: string, value: string) => {
  const bucket = map.get(key);

  if (!bucket) {
    return;
  }

  bucket.delete(value);

  if (bucket.size === 0) {
    map.delete(key);
  }
};

const linkRoom = (connectionId: string, roomId: string) => {
  addToSet(byRoom, roomId, connectionId);
};

const unlinkRoom = (connectionId: string, roomId: string) => {
  removeFromSet(byRoom, roomId, connectionId);
};

export const getConnectionByWs = (ws: WebSocket): RealtimeConnection | null => {
  for (const connection of connections.values()) {
    if (connection.ws === ws) {
      return connection;
    }
  }

  return null;
};

export const registerConnection = (
  userId: string,
  ws: WebSocket,
  canSeeInvisible: boolean
): RealtimeConnection => {
  const id = crypto.randomUUID();
  const connection: RealtimeConnection = {
    id,
    userId,
    ws,
    canSeeInvisible,
    isActive: true,
    rooms: new Set(),
    isAlive: true
  };

  connections.set(id, connection);

  addToSet(byUser, userId, id);

  return connection;
};

export const unregisterConnection = (connectionId: string): RealtimeConnection | null => {
  const connection = connections.get(connectionId);

  if (!connection) {
    return null;
  }

  connections.delete(connectionId);

  removeFromSet(byUser, connection.userId, connectionId);

  for (const roomId of connection.rooms) {
    unlinkRoom(connectionId, roomId);
  }

  return connection;
};

export const setConnectionRooms = (connectionId: string, roomIds: string[]): void => {
  const connection = connections.get(connectionId);

  if (!connection) {
    return;
  }

  for (const roomId of connection.rooms) {
    unlinkRoom(connectionId, roomId);
  }

  connection.rooms.clear();

  for (const roomId of roomIds) {
    connection.rooms.add(roomId);
    linkRoom(connectionId, roomId);
  }
};

export const unsubscribeUserFromRoom = ({ userId, roomId }: UnsubscribeUserFromRoomInput): void => {
  const userConnections = byUser.get(userId);

  if (!userConnections) {
    return;
  }

  for (const connectionId of userConnections) {
    if (connections.get(connectionId)?.rooms.delete(roomId)) {
      unlinkRoom(connectionId, roomId);
    }
  }
};

export const sendToConnection = (connectionId: string, message: RealtimeServerMessage): void => {
  const connection = connections.get(connectionId);

  if (!connection) {
    return;
  }

  send(connection, message);
};

export const sendToUser = (userId: string, message: RealtimeServerMessage): void => {
  const userConnections = byUser.get(userId);

  if (!userConnections) {
    return;
  }

  for (const connectionId of userConnections) {
    const connection = connections.get(connectionId);

    if (connection) {
      send(connection, message);
    }
  }
};

export const closeUserConnections = (userId: string, code: number, reason: string): void => {
  const userConnections = byUser.get(userId);

  if (!userConnections) {
    return;
  }

  for (const connectionId of userConnections) {
    const connection = connections.get(connectionId);

    if (connection) {
      try {
        connection.ws.close(code, reason);
      } catch {}
    }
  }
};

export const hasUserConnection = (userId: string): boolean => {
  const userConnections = byUser.get(userId);

  return (userConnections?.size ?? 0) > 0;
};

export const hasActiveUserConnection = (userId: string): boolean => {
  const userConnections = byUser.get(userId);

  if (!userConnections) {
    return false;
  }

  return [...userConnections].some((connectionId) => connections.get(connectionId)?.isActive);
};

export const markConnectionAlive = (ws: WebSocket): void => {
  const connection = getConnectionByWs(ws);

  if (connection) {
    connection.isAlive = true;
  }
};

export const listOnlineUserIds = (): string[] => [...byUser.keys()];

export const listConnections = (): RealtimeConnection[] => [...connections.values()];

export const sendToRoom = (roomId: string, message: RealtimeServerMessage): void => {
  const roomConnections = byRoom.get(roomId);

  if (!roomConnections) {
    return;
  }

  for (const connectionId of roomConnections) {
    const connection = connections.get(connectionId);

    if (connection) {
      send(connection, message);
    }
  }
};

export const sendToAll = (message: RealtimeServerMessage): void => {
  for (const connection of connections.values()) {
    send(connection, message);
  }
};

const sendPresenceByRole = (snapshots: PresenceSnapshots): void => {
  for (const connection of connections.values()) {
    send(connection, {
      type: 'presence.snapshot',
      snapshot: connection.canSeeInvisible ? snapshots.admin : snapshots.public
    });
  }
};

export const initRealtimeBroadcast = (): void => {
  bindEmit({
    presence: (snapshots) => {
      sendPresenceByRole(snapshots);
    },
    friends: (userId, message) => {
      sendToUser(userId, message);
    },
    room: (roomId, message) => {
      sendToRoom(roomId, message);
    },
    all: (message) => {
      sendToAll(message);
    }
  });
};
