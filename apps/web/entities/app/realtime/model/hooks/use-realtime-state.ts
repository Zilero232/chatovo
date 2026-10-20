import type { RealtimeClientMessage, RoomsParticipantsSnapshot } from '@chatovo/schemas';

import { isPrivilegesChangedCloseCode, isSessionEndedCloseCode } from '@chatovo/schemas';
import { useDocumentVisibility, useWindowFocus } from '@siberiacancode/reactuse';
import { WebSocket } from 'partysocket';
import { useEffect, useEffectEvent, useRef, useState } from 'react';

import { useCurrentUser } from '@/entities/auth/user';
import { authClient, buildRealtimeUrl, clearToken } from '@/shared/api';
import { appEvents } from '@/shared/lib';

import {
  buildSubscribeMessage,
  dispatchRealtimeMessage,
  emptyPresence,
  parseRealtimeServerMessage,
  setSubscriptionSender,
  syncRoomSubscriptions
} from '../lib';

export const useRealtimeState = () => {
  const { isAuthenticated } = useCurrentUser();
  const [presence, setPresence] = useState<RoomsParticipantsSnapshot>(emptyPresence);
  const [isConnected, setIsConnected] = useState(false);

  const isVisible = useDocumentVisibility() === 'visible';
  const isFocused = useWindowFocus();

  const isActive = isVisible && isFocused;

  const wsRef = useRef<WebSocket | null>(null);

  const handleMessage = useEffectEvent(async (raw: unknown) => {
    const message = await parseRealtimeServerMessage(raw);

    if (!message) {
      return;
    }

    dispatchRealtimeMessage(message, {
      setPresence
    });
  });

  const pushSubscriptions = useEffectEvent(() => {
    const ws = wsRef.current;

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return;
    }

    ws.send(JSON.stringify(buildSubscribeMessage()));
  });

  const pushActivity = useEffectEvent(() => {
    const ws = wsRef.current;

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return;
    }

    const message: RealtimeClientMessage = { op: 'client.activity', active: isActive };

    ws.send(JSON.stringify(message));
  });

  useEffect(() => {
    pushActivity();
  }, [isActive]);

  useEffect(() => {
    setSubscriptionSender(() => {
      pushSubscriptions();
    });
    syncRoomSubscriptions();

    return () => {
      setSubscriptionSender(null);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      wsRef.current?.close();
      wsRef.current = null;
      // eslint-disable-next-line react/set-state-in-effect -- resets state that mirrors the socket we just tore down
      setIsConnected(false);
      // eslint-disable-next-line react/set-state-in-effect -- see above
      setPresence(emptyPresence());

      return;
    }

    const ws = new WebSocket(() => buildRealtimeUrl(), [], {
      connectionTimeout: 10_000,
      maxRetries: Infinity,
      debug: import.meta.env.MODE === 'development'
    });

    wsRef.current = ws;

    const onOpen = () => {
      setIsConnected(true);
      syncRoomSubscriptions();
      pushActivity();
    };
    const onClose = (event: CloseEvent) => {
      setIsConnected(false);

      if (isSessionEndedCloseCode(event.code)) {
        ws.close();
        wsRef.current = null;
        clearToken();
        appEvents.emit.sessionExpired();

        return;
      }

      if (isPrivilegesChangedCloseCode(event.code)) {
        void authClient.getSession({ query: { disableCookieCache: true } });
      }
    };
    const onMessage = (event: MessageEvent) => {
      void handleMessage(event.data);
    };

    ws.addEventListener('open', onOpen);
    ws.addEventListener('close', onClose);
    ws.addEventListener('message', onMessage);

    return () => {
      ws.removeEventListener('open', onOpen);
      ws.removeEventListener('close', onClose);
      ws.removeEventListener('message', onMessage);
      ws.close();
      wsRef.current = null;
    };
  }, [isAuthenticated]);

  const send = (message: RealtimeClientMessage) => {
    const ws = wsRef.current;

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return;
    }

    ws.send(JSON.stringify(message));
  };

  return { presence, send, isConnected };
};
