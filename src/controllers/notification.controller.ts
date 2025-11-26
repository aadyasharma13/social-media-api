import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { Notification } from '../database/models/notification.model';
import type IUserModel from '../database/models/user.model';
import type IPostModel from '../database/models/post.model';
import { paginate } from '../utilities/pagination';
import { sendSuccess, sendUnauthorized, sendNotFound, sendForbidden } from '../utilities/response';

const isPopulatedUser = (value: any): value is IUserModel => {
  return value && typeof value === 'object' && '_id' in value && 'username' in value;
};

const isPopulatedPost = (value: any): value is IPostModel => {
  return value && typeof value === 'object' && '_id' in value && 'content' in value;
};

const toObjectIdString = (value: string | Types.ObjectId | undefined | null): string | null => {
  if (!value) {
    return null;
  }
  if (typeof value === 'string') {
    return value;
  }
  if ('toString' in value) {
    return value.toString();
  }
  return null;
};

const buildSenderPayload = (sender: IUserModel | Types.ObjectId | string | undefined | null) => {
  if (!sender) {
    return null;
  }
  if (isPopulatedUser(sender)) {
    return {
      id: toObjectIdString(sender._id) || undefined,
      username: sender.username,
      avatarUrl: sender.avatarUrl || sender.image || null,
      bio: sender.bio || null
    };
  }

  const id = toObjectIdString(sender as Types.ObjectId | string | undefined);
  if (!id) {
    return null;
  }
  return {
    id,
    username: null,
    avatarUrl: null,
    bio: null
  };
};

const buildPostPayload = (post: IPostModel | Types.ObjectId | string | undefined | null) => {
  if (!post) {
    return null;
  }
  if (isPopulatedPost(post)) {
    return {
      id: toObjectIdString(post._id) || undefined,
      content: post.content,
      imageUrl: post.imageUrl || null
    };
  }

  const id = toObjectIdString(post as Types.ObjectId | string | undefined);
  if (!id) {
    return null;
  }
  return {
    id,
    content: null,
    imageUrl: null
  };
};

/**
 * Notification Controller
 * Handles HTTP-level logic for notification-related endpoints
 */

export class NotificationController {
  /**
   * GET /api/notifications
   * Get all notifications for the current user
   */
  static getNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.payload?.id;
      if (!userId) {
        return sendUnauthorized(res, 'Unauthorized: Invalid token');
      }

      const limit = typeof req.query.limit !== 'undefined' 
        ? parseInt(req.query.limit as string) 
        : 20;
      const offset = typeof req.query.offset !== 'undefined' 
        ? parseInt(req.query.offset as string) 
        : 0;

      const filter: any = { user: userId };
      if (req.query.unread === 'true') {
        filter.isRead = false;
      }

      const paginationResult = await paginate(
        Notification,
        filter,
        limit,
        offset,
        { createdAt: 'desc' },
        [
          { path: 'sender', select: 'username avatarUrl image bio' },
          { path: 'post', select: 'content imageUrl' }
        ]
      );

      const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });

      const formattedNotifications = paginationResult.data.map((notification: any) => {
        return {
          id: notification._id,
          type: notification.type,
          sender: buildSenderPayload(notification.sender),
          post: buildPostPayload(notification.post),
          isRead: notification.isRead,
          createdAt: notification.createdAt
        };
      });

      return sendSuccess(res, {
        notifications: formattedNotifications,
        pagination: {
          total: paginationResult.total,
          limit: paginationResult.limit,
          offset: paginationResult.offset,
          hasMore: paginationResult.hasMore
        },
        unreadCount: unreadCount
      });
    } catch (error) {
      return next(error);
    }
  };

  /**
   * PATCH /api/notifications/:id/read
   * Mark a notification as read
   */
  static markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.payload?.id;
      const notificationId = req.params.id;

      if (!userId) {
        return sendUnauthorized(res, 'Unauthorized: Invalid token');
      }

      const notification = await Notification.findById(notificationId);
      if (!notification) {
        return sendNotFound(res, 'Notification not found');
      }

      if (notification.user.toString() !== userId.toString()) {
        return sendForbidden(res, 'You can only mark your own notifications as read');
      }

      if (!notification.isRead) {
        notification.isRead = true;
        await notification.save();
      }

      await notification.populate('sender', 'username avatarUrl image bio');
      await notification.populate('post', 'content imageUrl');

      return sendSuccess(res, {
        notification: {
          id: notification._id,
          type: notification.type,
          sender: buildSenderPayload(notification.sender),
          post: buildPostPayload(notification.post),
          isRead: notification.isRead,
          createdAt: notification.createdAt
        }
      }, 'Notification marked as read');
    } catch (error) {
      return next(error);
    }
  };
}

