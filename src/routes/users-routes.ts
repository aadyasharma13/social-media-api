import { Router } from 'express';
import { authentication } from "../utilities/authentication";
import { requireAdmin } from "../utilities/authorization";
import { UserController } from '../controllers/user.controller';
import { validateUserRegistration, validateUserLogin } from '../utilities/validation';

const router: Router = Router();

/**
 * GET /api/user
 */
router.get('/user', authentication.required, UserController.getCurrentUser);


/**
 * PUT /api/user
 */
router.put('/user', authentication.required, UserController.updateCurrentUser);

/**
 * PUT /api/user/profile
 * Update user profile fields (legacy route)
 */
router.put('/user/profile', authentication.required, UserController.updateProfile);

/**
 * PATCH /api/users/profile
 * Update user profile
 */
router.patch('/users/profile', authentication.required, UserController.updateProfile);


/**
 * POST /api/users
 */
router.post('/users', validateUserRegistration, UserController.register);


/**
 * POST /api/users/login
 */
router.post('/users/login', validateUserLogin, UserController.login);

/**
 * POST /api/users/:userId/follow
 * Follow a user
 */
router.post('/users/:userId/follow', authentication.required, UserController.follow);

/**
 * DELETE /api/users/:userId/unfollow
 * Unfollow a user
 */
router.delete('/users/:userId/unfollow', authentication.required, UserController.unfollow);

/**
 * GET /api/users
 * Get all users (admin only)
 */
router.get('/users', authentication.required, requireAdmin, UserController.getAllUsers);

/**
 * DELETE /api/users/:userId
 * Delete any user (admin only)
 */
router.delete('/users/:userId', authentication.required, requireAdmin, UserController.deleteUser);

/**
 * GET /api/users/:userId/followers
 * Get list of users who follow the specified user
 */
router.get('/users/:userId/followers', authentication.optional, UserController.getFollowers);

/**
 * GET /api/users/:userId/following
 * Get list of users that the specified user follows
 */
router.get('/users/:userId/following', authentication.optional, UserController.getFollowing);


export const UsersRoutes: Router = router;
