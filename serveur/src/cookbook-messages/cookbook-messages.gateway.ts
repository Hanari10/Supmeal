import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { PrismaService } from '../database/prisma.service';

interface JwtPayload {
  sub: string;
  email: string;
}

interface JoinCookbookPayload {
  cookbookId: string;
}

interface SocketAuth {
  token?: unknown;
}

interface SocketData {
  userId?: string;
  email?: string;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:8080',
    credentials: true,
  },
})
export class CookbookMessagesGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const auth = client.handshake.auth as SocketAuth;

      const token = auth.token;

      if (typeof token !== 'string' || !token.trim()) {
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      const socketData = client.data as SocketData;

      socketData.userId = payload.sub;
      socketData.email = payload.email;
    } catch {
      client.disconnect();
    }
  }

  @SubscribeMessage('joinCookbook')
  async joinCookbook(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: JoinCookbookPayload,
  ) {
    const socketData = client.data as SocketData;

    const userId = socketData.userId;

    if (!userId) {
      throw new WsException('Utilisateur non authentifié.');
    }

    if (!payload?.cookbookId || typeof payload.cookbookId !== 'string') {
      throw new WsException('Cookbook invalide.');
    }

    const membership = await this.prisma.cookbookMember.findUnique({
      where: {
        cookbookId_userId: {
          cookbookId: payload.cookbookId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new WsException("Vous n'avez pas accès à ce cookbook.");
    }

    const room = this.getCookbookRoom(payload.cookbookId);

    await client.join(room);

    return {
      joined: true,
      cookbookId: payload.cookbookId,
    };
  }

  @SubscribeMessage('leaveCookbook')
  async leaveCookbook(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: JoinCookbookPayload,
  ) {
    if (!payload?.cookbookId || typeof payload.cookbookId !== 'string') {
      return;
    }

    await client.leave(this.getCookbookRoom(payload.cookbookId));
  }

  emitMessageCreated(cookbookId: string, message: unknown) {
    this.server
      .to(this.getCookbookRoom(cookbookId))
      .emit('cookbookMessageCreated', message);
  }

  emitMessageUpdated(cookbookId: string, message: unknown) {
    this.server
      .to(this.getCookbookRoom(cookbookId))
      .emit('cookbookMessageUpdated', message);
  }

  emitMessageDeleted(cookbookId: string, messageId: string) {
    this.server
      .to(this.getCookbookRoom(cookbookId))
      .emit('cookbookMessageDeleted', {
        id: messageId,
        cookbookId,
      });
  }

  private getCookbookRoom(cookbookId: string) {
    return `cookbook:${cookbookId}`;
  }
}
