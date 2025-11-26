import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import logger from './logger';
import { JWT_SECRET } from './secrets';

interface JwtPayload {
  id: string;
  username?: string;
}

const SOCKET_EVENT = {
  CONNECTED: 'connection:success',
  NOTIFICATION: 'notification:new'
};

const SOCKET_ROOM_PREFIX = 'user:';

class NotificationSocket {
  private io: SocketIOServer | null = null;

  init(server: HttpServer): void {
    if (this.io) {
      return;
    }

    this.io = new SocketIOServer(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      }
    });

    this.io.use((socket, next) => {
      try {
        const token = this.extractToken(socket);
        if (!token) {
          return next(new Error('Authentication token missing'));
        }

        const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
        socket.data.userId = payload.id;
        socket.data.username = payload.username;
        return next();
      } catch (error) {
        logger.warn('Socket authentication failed', error as Error);
        return next(new Error('Authentication error'));
      }
    });

    this.io.on('connection', (socket: Socket) => {
      const userId = socket.data.userId;
      if (!userId) {
        socket.disconnect(true);
        return;
      }

      socket.join(this.buildRoom(userId));
      socket.emit(SOCKET_EVENT.CONNECTED, { message: 'Realtime channel established' });

      socket.on('disconnect', (reason: string) => {
        logger.debug(`Socket disconnected for user ${userId}: ${reason}`);
      });
    });

    logger.info('Realtime notification gateway initialized');
  }

  emitToUser(userId: string, eventName: string, payload: any): void {
    if (!this.io) {
      return;
    }

    const room = this.buildRoom(userId);
    this.io.to(room).emit(eventName, payload);
  }

  private extractToken(socket: Socket): string | null {
    const authHeader = socket.handshake.headers.authorization;
    if (authHeader && typeof authHeader === 'string') {
      const [scheme, token] = authHeader.split(' ');
      if (scheme === 'Token' || scheme === 'Bearer') {
        return token;
      }
    }

    const tokenFromAuth = socket.handshake.auth?.token;
    if (tokenFromAuth && typeof tokenFromAuth === 'string') {
      return tokenFromAuth;
    }

    return null;
  }

  private buildRoom(userId: string): string {
    return `${SOCKET_ROOM_PREFIX}${userId}`;
  }
}

const notificationSocketInstance = new NotificationSocket();

export const initRealtime = (server: HttpServer): void => {
  notificationSocketInstance.init(server);
};

export const notificationSocket = notificationSocketInstance;
export const realtimeEvents = SOCKET_EVENT;