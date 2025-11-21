import { Router } from 'express';
import { authentication } from '../utilities/authentication';
import { NotificationController } from '../controllers/notification.controller';

const router: Router = Router();

/**
 * GET /api/notifications
 * Get all notifications for the current user (unread + read) with pagination
 */
router.get('/', authentication.required, NotificationController.getNotifications);

/**
 * PATCH /api/notifications/:id/read
 * Mark a notification as read
 */
router.patch('/:id/read', authentication.required, NotificationController.markAsRead);

export const NotificationsRoutes: Router = router;

