import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import type { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import type { IncomingMessage } from 'node:http';
import type { WebSocket } from 'ws';

import { Logger } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';

import { isUserBlocked } from '../../lib';
import {
  clearFriendsEpoch,
  FriendshipService,
  getUserCallSnapshot,
  onCallUserOffline,
  onCallUserOnline
} from '../friends';
import { addLobbyConnection, getPresenceSnapshots, removeLobbyConnection } from '../livekit';
import { BLOCKED_WS_CLOSE_CODE, HEARTBEAT_INTERVAL_MS } from './config';
import {
  getConnectionByWs,
  hasUserConnection,
  listConnections,
  markConnectionAlive,
  registerConnection,
  sendToConnection,
  unregisterConnection
} from './connection-store';
import { handleClientMessage } from './handlers/client-message';
import { authorizeToken, presenceForViewer } from './lib';

@WebSocketGateway({ path: '/realtime' })
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(RealtimeGateway.name);

  private heartbeat: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly friendship: FriendshipService) {}

  onModuleInit() {
    this.heartbeat = setInterval(() => {
      for (const connection of listConnections()) {
        if (!connection.isAlive) {
          connection.ws.terminate();

          continue;
        }

        connection.isAlive = false;
        connection.ws.ping();
      }
    }, HEARTBEAT_INTERVAL_MS);
  }

  onModuleDestroy() {
    if (this.heartbeat) {
      clearInterval(this.heartbeat);
    }
  }

  async handleConnection(client: WebSocket, request: IncomingMessage) {
    const token = new URL(request.url ?? '/', 'http://localhost').searchParams.get('token');
    const authorized = await authorizeToken(token);

    if (!authorized) {
      client.close(4401, 'Unauthorized');

      return;
    }

    const { userId, canSeeInvisible } = authorized;

    if (await isUserBlocked(userId)) {
      client.close(BLOCKED_WS_CLOSE_CODE, 'Account blocked');

      return;
    }

    const connection = registerConnection(userId, client, canSeeInvisible);

    addLobbyConnection(userId);
    onCallUserOnline(userId);

    client.on('pong', () => {
      markConnectionAlive(client);
    });

    client.on('message', (data: Buffer) => {
      handleClientMessage(connection, data).catch((error: unknown) => {
        this.logger.warn(`Realtime message failed: ${String(error)}`);
      });
    });

    sendToConnection(connection.id, {
      type: 'presence.snapshot',
      snapshot: presenceForViewer({ snapshots: getPresenceSnapshots(), userId, canSeeInvisible })
    });

    sendToConnection(connection.id, {
      type: 'friends.snapshot',
      snapshot: getUserCallSnapshot(userId)
    });

    await this.friendship.broadcastFriendPresence({ userId, isOnline: true });
  }

  async handleDisconnect(client: WebSocket) {
    const connection = getConnectionByWs(client);

    if (!connection) {
      return;
    }

    const { userId } = connection;

    unregisterConnection(connection.id);
    removeLobbyConnection(userId);

    if (!hasUserConnection(userId)) {
      onCallUserOffline(userId);
      clearFriendsEpoch(userId);

      await this.friendship.broadcastFriendPresence({ userId, isOnline: false });
    }
  }
}
