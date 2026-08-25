import { io, type Socket } from 'socket.io-client';

import type { CookbookMessage } from '../types/cookbookMessage';
import { getToken } from '../utils/token';

interface CookbookMessageDeletedPayload {
  id: string;
  cookbookId: string;
}

interface ServerToClientEvents {
  cookbookMessageCreated: (
    message: CookbookMessage,
  ) => void;

  cookbookMessageUpdated: (
    message: CookbookMessage,
  ) => void;

  cookbookMessageDeleted: (
    payload: CookbookMessageDeletedPayload,
  ) => void;
}

interface ClientToServerEvents {
  joinCookbook: (payload: {
    cookbookId: string;
  }) => void;

  leaveCookbook: (payload: {
    cookbookId: string;
  }) => void;
}

export type CookbookSocket = Socket<
  ServerToClientEvents,
  ClientToServerEvents
>;

let socket: CookbookSocket | null = null;

export function getCookbookSocket(): CookbookSocket {
  if (socket) {
    return socket;
  }

  const token = getToken();

  socket = io('http://localhost:3000', {
    autoConnect: false,
    auth: {
      token,
    },
  });

  return socket;
}

export function connectCookbookSocket(): CookbookSocket {
  const cookbookSocket =
    getCookbookSocket();

  const token = getToken();

  cookbookSocket.auth = {
    token,
  };

  if (!cookbookSocket.connected) {
    cookbookSocket.connect();
  }

  return cookbookSocket;
}

export function disconnectCookbookSocket(): void {
  if (!socket) {
    return;
  }

  socket.disconnect();
  socket = null;
}