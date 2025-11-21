import { Router } from 'express';
import { UsersRoutes } from './users-routes';
import { ProfilesRoutes } from './profiles-routes';
import { PostsRoutes } from './posts-routes';
import { CommentsRoutes } from './comments-routes';
import { FeedRoutes } from './feed-routes';
import { NotificationsRoutes } from './notifications-routes';


const router: Router = Router();


router.use('/', UsersRoutes);
router.use('/', FeedRoutes);
router.use('/profiles', ProfilesRoutes);
router.use('/posts', PostsRoutes);
router.use('/comments', CommentsRoutes);
router.use('/notifications', NotificationsRoutes);


export const MainRouter: Router = router;
