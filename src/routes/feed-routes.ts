import { Router } from 'express';
import { authentication } from '../utilities/authentication';
import { FeedController } from '../controllers/feed.controller';

const router: Router = Router();

/**
 * GET /api/feed
 * Get feed of posts from users the current user follows
 */
router.get('/feed', authentication.required, FeedController.getFeed);

export const FeedRoutes: Router = router;

