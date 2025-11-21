import { Request, Response, NextFunction } from 'express';
import IUserModel, { User } from '../database/models/user.model';
import { sendSuccess, sendNotFound } from '../utilities/response';

/**
 * Profile Controller
 * Handles HTTP-level logic for profile-related endpoints
 */

export class ProfileController {
  /**
   * GET /api/profiles/:username
   * Get user profile
   */
  static getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.payload) {
        const user = await User.findById(req.payload.id);
        return sendSuccess(res, { profile: req.profile.toProfileJSONFor(user) });
      } else {
        return sendSuccess(res, { profile: req.profile.toProfileJSONFor(req.profile) });
      }
    } catch (error) {
      return next(error);
    }
  };

  /**
   * POST /api/profiles/:username/follow
   * Follow a user (legacy route, uses old User model methods)
   */
  static follow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profileId = req.profile._id;
      const user = await User.findById(req.payload.id);
      await user.follow(profileId);
      return sendSuccess(res, { profile: req.profile.toProfileJSONFor(user) });
    } catch (error) {
      return next(error);
    }
  };

  /**
   * DELETE /api/profiles/:username/follow
   * Unfollow a user (legacy route, uses old User model methods)
   */
  static unfollow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profileId = req.profile._id;
      const user = await User.findById(req.payload.id);
      await user.unfollow(profileId);
      return sendSuccess(res, { profile: req.profile.toProfileJSONFor(user) });
    } catch (error) {
      return next(error);
    }
  };
}

