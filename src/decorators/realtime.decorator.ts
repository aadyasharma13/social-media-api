import { notificationSocket, realtimeEvents } from '../utilities/realtime';

export interface BroadcastOptions<T = any> {
  eventName?: string;
  userSelector?: (result: T, args: any[]) => string | null;
  payloadMapper?: (result: T) => any;
}

const defaultUserSelector = (result: any): string | null => {
  if (!result) {
    return null;
  }

  if (result.user && typeof result.user === 'object' && typeof result.user.toString === 'function') {
    return result.user.toString();
  }

  if (typeof result.user === 'string') {
    return result.user;
  }

  if (typeof result.userId === 'string') {
    return result.userId;
  }

  return null;
};

const defaultPayloadMapper = (result: any) => {
  if (!result) {
    return result;
  }

  if (typeof result.toJSON === 'function') {
    return result.toJSON();
  }

  return result;
};

export function BroadcastNotification<T = any>(options: BroadcastOptions<T> = {}): MethodDecorator {
  const eventName = options.eventName || realtimeEvents.NOTIFICATION;
  const userSelector = options.userSelector || defaultUserSelector;
  const payloadMapper = options.payloadMapper || defaultPayloadMapper;

  return function (target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);

      try {
        const userId = userSelector(result, args);
        if (userId) {
          const payload = payloadMapper(result);
          notificationSocket.emitToUser(userId, eventName, {
            event: eventName,
            data: payload
          });
        }
      } catch (error) {
        // Realtime emission should not block API request lifecycle
        console.error('Failed to broadcast realtime notification', error);
      }

      return result;
    };

    return descriptor;
  };
}