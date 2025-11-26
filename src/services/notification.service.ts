import { Notification } from '../database/models/notification.model';
import INotificationModel from '../database/models/notification.model';
import { BroadcastNotification } from '../decorators/realtime.decorator';

type NotificationType = 'follow' | 'like' | 'comment';

const POPULATE_FIELDS = [
  { path: 'sender', select: 'username avatarUrl image bio' },
  { path: 'post', select: 'content imageUrl' }
];

const mapNotificationPayload = (notification: INotificationModel) => {
  const sender: any = notification.sender;
  const post: any = notification.post;

  return {
    id: notification._id,
    type: notification.type,
    sender: sender ? {
      id: sender._id ? sender._id.toString() : sender.toString?.(),
      username: sender.username,
      avatarUrl: sender.avatarUrl || sender.image || null,
      bio: sender.bio || null
    } : null,
    post: post ? {
      id: post._id ? post._id.toString() : post.toString?.(),
      content: post.content,
      imageUrl: post.imageUrl || null
    } : null,
    isRead: notification.isRead,
    createdAt: notification.createdAt
  };
};

class NotificationService {
  @BroadcastNotification<INotificationModel>({
    payloadMapper: mapNotificationPayload
  })
  public async createNotification(
    userId: string,
    type: NotificationType,
    senderId: string,
    postId: string | null = null
  ): Promise<INotificationModel | null> {
    try {
      if (userId === senderId) {
        return null;
      }

      const notification = new Notification({
        user: userId,
        type,
        sender: senderId,
        post: postId,
        isRead: false
      });

      await notification.save();
      await notification.populate(POPULATE_FIELDS);
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }
}

const notificationService = new NotificationService();

export const createNotification = async (
  userId: string,
  type: NotificationType,
  senderId: string,
  postId: string | null = null
): Promise<void> => {
  await notificationService.createNotification(userId, type, senderId, postId);
};


