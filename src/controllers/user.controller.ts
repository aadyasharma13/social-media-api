import { Request, Response, NextFunction } from 'express';
import IUserModel, { User } from '../database/models/user.model';
import passport from 'passport';
import { followUser, unfollowUser } from '../services/user.service';
import { Follow } from '../database/models/follow.model';
import { paginate } from '../utilities/pagination';
import { sendSuccess, sendError, sendUnauthorized, sendNotFound } from '../utilities/response';

/**
 * User Controller
 * Handles HTTP-level logic for user-related endpoints
 */

export class UserController {
  /**
   * GET /api/user
   * Get current authenticated user
   */
  static getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: IUserModel | null = await User.findById(req.payload.id);
      if (!user) {
        return sendUnauthorized(res, 'User not found');
      }
      return sendSuccess(res, { user: user.toAuthJSON() });
    } catch (error) {
      return next(error);
    }
  };

  /**
   * PUT /api/user
   * Update current user
   */
  static updateCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: IUserModel | null = await User.findById(req.payload.id);
      if (!user) {
        return sendUnauthorized(res, 'User not found');
      }

      // Update only fields that have values
      if (typeof req.body.user.email !== 'undefined') {
        user.email = req.body.user.email;
      }
      if (typeof req.body.user.username !== 'undefined') {
        user.username = req.body.user.username;
      }
      if (typeof req.body.user.password !== 'undefined') {
        await user.setPassword(req.body.user.password);
      }
      if (typeof req.body.user.image !== 'undefined') {
        user.image = req.body.user.image;
      }
      if (typeof req.body.user.bio !== 'undefined') {
        user.bio = req.body.user.bio;
      }

      await user.save();
      return sendSuccess(res, { user: user.toAuthJSON() }, 'User updated successfully');
    } catch (error) {
      return next(error);
    }
  };

  /**
   * POST /api/users
   * Register a new user
   */
  static register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: IUserModel = new User();
      user.username = req.body.user.username;
      user.email = req.body.user.email;
      await user.setPassword(req.body.user.password);
      user.bio = '';
      user.image = '';

      await user.save();
      return sendSuccess(res, { user: user.toAuthJSON() }, 'User registered successfully', 201);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * POST /api/users/login
   * Login user
   */
  static login = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.user.email) {
      return sendError(res, 'Validation error', 422, { email: "Can't be blank" });
    }

    if (!req.body.user.password) {
      return sendError(res, 'Validation error', 422, { password: "Can't be blank" });
    }

    passport.authenticate('local', {session: false}, (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (user) {
        user.token = user.generateJWT();
        return sendSuccess(res, { user: user.toAuthJSON() }, 'Login successful');
      } else {
        return sendError(res, info?.message || 'Invalid credentials', 422, info);
      }
    })(req, res, next);
  };

  /**
   * PATCH /api/users/profile
   * Update user profile
   */
  static updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.payload?.id;
      if (!userId) {
        return sendUnauthorized(res, 'Unauthorized: Invalid token');
      }

      const user: IUserModel | null = await User.findById(userId);
      if (!user) {
        return sendNotFound(res, 'User not found');
      }

      const profileData = req.body.profile || req.body;
      if (typeof profileData.bio !== 'undefined') { user.bio = profileData.bio; }
      if (typeof profileData.avatarUrl !== 'undefined') { user.avatarUrl = profileData.avatarUrl; }
      if (typeof profileData.location !== 'undefined') { user.location = profileData.location; }
      if (typeof profileData.website !== 'undefined') { user.website = profileData.website; }
      if (typeof profileData.dob !== 'undefined') { user.dob = new Date(profileData.dob); }
      if (typeof profileData.image !== 'undefined') { user.image = profileData.image; }

      const updatedUser = await user.save();
      return sendSuccess(res, {
        profile: {
          id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          bio: updatedUser.bio || null,
          avatarUrl: updatedUser.avatarUrl || null,
          image: updatedUser.image || null,
          location: updatedUser.location || null,
          website: updatedUser.website || null,
          dob: updatedUser.dob || null,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt
        }
      }, 'Profile updated successfully');
  } catch (error) {
      if (error.name === 'ValidationError') {
        return sendError(res, 'Validation error', 422, Object.keys(error.errors).reduce((errors: any, key: string) => {
          errors[key] = error.errors[key].message;
          return errors;
        }, {}));
      }
      return next(error);
    }
  };

  /**
   * POST /api/users/:userId/follow
   * Follow a user
   */
  static follow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const followerId = req.payload?.id;
      const targetId = req.params.userId;

      if (!followerId) {
        return sendUnauthorized(res, 'Unauthorized: Invalid token');
      }

      if (followerId === targetId) {
        return sendError(res, 'Users cannot follow themselves', 400);
      }

      await followUser(followerId, targetId);
      return sendSuccess(res, null, 'User followed successfully');
  } catch (error) {
      if (error.message === 'Already following this user' || error.code === 11000) {
        return sendError(res, 'Already following this user', 409);
      }
      if (error.message.includes('not found')) {
        return sendNotFound(res, error.message);
      }
      if (error.message === 'Users cannot follow themselves') {
        return sendError(res, error.message, 400);
      }
      return next(error);
    }
  };

  /**
   * DELETE /api/users/:userId/unfollow
   * Unfollow a user
   */
  static unfollow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const followerId = req.payload?.id;
      const targetId = req.params.userId;

      if (!followerId) {
        return sendUnauthorized(res, 'Unauthorized: Invalid token');
      }

      await unfollowUser(followerId, targetId);
      return sendSuccess(res, null, 'User unfollowed successfully');
  } catch (error) {
      if (error.message === 'Not following this user') {
        return sendNotFound(res, 'Not following this user');
      }
      if (error.message.includes('not found')) {
        return sendNotFound(res, error.message);
      }
      return next(error);
    }
  };

  /**
   * GET /api/users/:userId/followers
   * Get list of users who follow the specified user
   */
  static getFollowers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      if (!user) {
        return sendNotFound(res, 'User not found');
      }

      const limit = typeof req.query.limit !== 'undefined' 
        ? parseInt(req.query.limit as string) 
        : 20;
      const offset = typeof req.query.offset !== 'undefined' 
        ? parseInt(req.query.offset as string) 
        : 0;

      const currentUser = req.payload ? await User.findById(req.payload.id) : null;

      const paginationResult = await paginate(
        Follow,
        { following: userId },
        limit,
        offset,
        { createdAt: 'desc' },
        { path: 'follower', select: 'username email bio image avatarUrl location website dob' }
      );

      const formattedFollowers = paginationResult.data.map((follow: any) => {
        const follower = follow.follower;
        return {
          id: follower._id,
          username: follower.username,
          email: follower.email,
          bio: follower.bio || null,
          avatarUrl: follower.avatarUrl || null,
          image: follower.image || null,
          location: follower.location || null,
          website: follower.website || null,
          dob: follower.dob || null,
          following: currentUser ? currentUser.isFollowing(follower._id) : false
        };
      });

      return sendSuccess(res, {
        followers: formattedFollowers,
        pagination: {
          total: paginationResult.total,
          limit: paginationResult.limit,
          offset: paginationResult.offset,
          hasMore: paginationResult.hasMore
        }
      });
    } catch (error) {
      return next(error);
    }
  };

  /**
   * GET /api/users/:userId/following
   * Get list of users that the specified user follows
   */
  static getFollowing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      if (!user) {
        return sendNotFound(res, 'User not found');
      }

      const limit = typeof req.query.limit !== 'undefined' 
        ? parseInt(req.query.limit as string) 
        : 20;
      const offset = typeof req.query.offset !== 'undefined' 
        ? parseInt(req.query.offset as string) 
        : 0;

      const currentUser = req.payload ? await User.findById(req.payload.id) : null;

      const paginationResult = await paginate(
        Follow,
        { follower: userId },
        limit,
        offset,
        { createdAt: 'desc' },
        { path: 'following', select: 'username email bio image avatarUrl location website dob' }
      );

      const formattedFollowing = paginationResult.data.map((follow: any) => {
        const following = follow.following;
        return {
          id: following._id,
          username: following.username,
          email: following.email,
          bio: following.bio || null,
          avatarUrl: following.avatarUrl || null,
          image: following.image || null,
          location: following.location || null,
          website: following.website || null,
          dob: following.dob || null,
          following: currentUser ? currentUser.isFollowing(following._id) : false
        };
      });

      return sendSuccess(res, {
        following: formattedFollowing,
        pagination: {
          total: paginationResult.total,
          limit: paginationResult.limit,
          offset: paginationResult.offset,
          hasMore: paginationResult.hasMore
        }
      });
    } catch (error) {
      return next(error);
    }
  };

  /**
   * GET /api/users
   * Get all users (admin only)
   */
  static getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let limit = 20;
      let offset = 0;

      if (typeof req.query.limit !== 'undefined') {
        limit = parseInt(req.query.limit as string);
        if (isNaN(limit) || limit < 1) { limit = 20; }
        if (limit > 100) { limit = 100; }
      }

      if (typeof req.query.offset !== 'undefined') {
        offset = parseInt(req.query.offset as string);
        if (isNaN(offset) || offset < 0) { offset = 0; }
      }

      const [users, totalCount] = await Promise.all([
        User.find().select('-hash -salt').limit(limit).skip(offset).sort({ createdAt: 'desc' }).exec(),
        User.countDocuments()
      ]);

      const formattedUsers = users.map(function (user: IUserModel) {
        return {
          id: user._id,
          username: user.username,
          email: user.email,
          bio: user.bio || null,
          avatarUrl: user.avatarUrl || null,
          image: user.image || null,
          location: user.location || null,
          website: user.website || null,
          role: user.role || 'user',
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        };
      });

      return sendSuccess(res, {
        users: formattedUsers,
        pagination: {
          total: totalCount,
          limit: limit,
          offset: offset,
          hasMore: offset + limit < totalCount
        }
      });
    } catch (error) {
      return next(error);
    }
  };

  /**
   * DELETE /api/users/:userId
   * Delete any user (admin only)
   */
  static deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      if (!user) {
        return sendNotFound(res, 'User not found');
      }

      await User.findByIdAndDelete(userId);
      return sendSuccess(res, null, 'User deleted successfully');
    } catch (error) {
      return next(error);
    }
  };
}

