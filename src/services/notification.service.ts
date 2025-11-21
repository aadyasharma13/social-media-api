import { Notification } from '../database/models/notification.model';

/**
 * Notification Service
 * Handles notification creation and management
 */

/**
 * Create a notification
 * @param userId - ID of the user who receives the notification
 * @param type - Type of notification: 'follow' | 'like' | 'comment'
 * @param senderId - ID of the user who triggered the notification
 * @param postId - ID of the post (null for follow notifications)
 * @returns Promise<boolean> - true if successful
 */
export const createNotification = async (
  userId: string,
  type: 'follow' | 'like' | 'comment',
  senderId: string,
  postId: string | null = null
): Promise<boolean> => {
  try {
    // Don't create notification if user is notifying themselves
    if (userId === senderId) {
      return false;
    }

    const notification = new Notification({
      user: userId,
      type: type,
      sender: senderId,
      post: postId,
      isRead: false
    });

    await notification.save();
    return true;
  } catch (error) {
    console.error('Error creating notification:', error);
    return false;
  }
};

