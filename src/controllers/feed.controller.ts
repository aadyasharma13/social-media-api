import { Request, Response, NextFunction } from 'express';
import { User } from '../database/models/user.model';
import { Post } from '../database/models/post.model';
import { Follow } from '../database/models/follow.model';
import { paginate } from '../utilities/pagination';
import { sendSuccess, sendUnauthorized } from '../utilities/response';

/**
 * Feed Controller
 * Handles HTTP-level logic for feed-related endpoints
 */

export class FeedController {
  /**
   * GET /api/feed
   * Get feed of posts from users the current user follows
   */
  static getFeed = async (req: Request, res: Response, next: NextFunction) => {
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

      const user = await User.findById(userId);
      if (!user) {
        return sendUnauthorized(res, 'User not found');
      }

      const followRelations = await Follow.find({ follower: userId });
      const followingUserIds = followRelations.map(follow => follow.following);

      if (followingUserIds.length === 0) {
        return sendSuccess(res, {
          posts: [],
          pagination: {
            total: 0,
            limit: limit,
            offset: offset,
            hasMore: false
          }
        });
      }

      const paginationResult = await paginate(
        Post,
        { author: { $in: followingUserIds } },
        limit,
        offset,
        { createdAt: 'desc' },
        'author'
      );

      const formattedPosts = paginationResult.data.map((post: any) => {
        return post.toJSONFor(user);
      });

      return sendSuccess(res, {
        posts: formattedPosts,
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
}

