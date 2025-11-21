import { Request, Response, NextFunction } from 'express';
import { Notification } from '../database/models/notification.model';
import { paginate } from '../utilities/pagination';
import { sendSuccess, sendUnauthorized, sendNotFound, sendForbidden } from '../utilities/response';

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
          sender: {
            id: notification.sender._id,
            username: notification.sender.username,
            avatarUrl: notification.sender.avatarUrl || notification.sender.image,
            bio: notification.sender.bio
          },
          post: notification.post ? {
            id: notification.post._id,
            content: notification.post.content,
            imageUrl: notification.post.imageUrl
          } : null,
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
          sender: {
            id: notification.sender._id,
            username: notification.sender.username,
            avatarUrl: notification.sender.avatarUrl || notification.sender.image,
            bio: notification.sender.bio
          },
          post: notification.post ? {
            id: notification.post._id,
            content: notification.post.content,
            imageUrl: notification.post.imageUrl
          } : null,
          isRead: notification.isRead,
          createdAt: notification.createdAt
        }
      }, 'Notification marked as read');
    } catch (error) {
      return next(error);
    }
  };
}

