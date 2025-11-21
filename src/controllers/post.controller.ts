import { Request, Response, NextFunction } from 'express';
import { User } from '../database/models/user.model';
import { Post } from '../database/models/post.model';
import { Comment } from '../database/models/comment.model';
import { Like } from '../database/models/like.model';
import { paginate } from '../utilities/pagination';
import { sendSuccess, sendError, sendUnauthorized, sendNotFound, sendForbidden } from '../utilities/response';
import { createNotification } from '../services/notification.service';

/**
 * Post Controller
 * Handles HTTP-level logic for post-related endpoints
 */

export class PostController {
  /**
   * GET /api/posts
   * Get all posts with pagination
   */
  static getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = typeof req.query.limit !== 'undefined' 
        ? parseInt(req.query.limit as string) 
        : 20;
      const offset = typeof req.query.offset !== 'undefined' 
        ? parseInt(req.query.offset as string) 
        : 0;

      const query: any = {};
      if (req.query.author) {
        const author = await User.findOne({ username: req.query.author as string });
        if (author) {
          query.author = author._id;
        }
      }

      const user = req.payload ? await User.findById(req.payload.id) : null;

      const paginationResult = await paginate(
        Post,
        query,
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

  /**
   * GET /api/posts/:post
   * Get a single post
   */
  static getPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.payload ? await User.findById(req.payload.id) : null;
      await req.post.populate('author').execPopulate();
      return sendSuccess(res, { post: req.post.toJSONFor(user) });
    } catch (error) {
      return next(error);
    }
  };

  /**
   * POST /api/posts
   * Create a new post
   */
  static createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.payload.id);
      if (!user) {
        return sendUnauthorized(res, 'User not found');
      }

      const post = new Post(req.body.post);
      post.author = user;
      await post.save();

      return sendSuccess(res, { post: post.toJSONFor(user) }, 'Post created successfully', 201);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * PUT /api/posts/:post
   * Update a post
   */
  static updatePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.payload.id);
      if (!user) {
        return sendUnauthorized(res, 'User not found');
      }

      if (req.post.author._id.toString() === req.payload.id.toString()) {
        if (typeof req.body.post.content !== 'undefined') {
          req.post.content = req.body.post.content;
        }
        if (typeof req.body.post.imageUrl !== 'undefined') {
          req.post.imageUrl = req.body.post.imageUrl;
        }

        const updatedPost = await req.post.save();
        return sendSuccess(res, { post: updatedPost.toJSONFor(user) }, 'Post updated successfully');
      } else {
        return sendForbidden(res, 'You can only update your own posts');
      }
    } catch (error) {
      return next(error);
    }
  };

  /**
   * DELETE /api/posts/:post
   * Delete a post
   */
  static deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.payload?.id;
      if (!userId) {
        return sendUnauthorized(res, 'Unauthorized: Invalid token');
      }

      const user = await User.findById(userId);
      if (!user) {
        return sendUnauthorized(res, 'User not found');
      }

      const isAuthor = req.post.author._id.toString() === userId.toString();
      const isAdmin = user.role === 'admin';

      if (isAuthor || isAdmin) {
        await req.post.remove();
        return sendSuccess(res, null, 'Post deleted successfully');
      } else {
        return sendForbidden(res, 'You can only delete your own posts');
      }
    } catch (error) {
      return next(error);
    }
  };

  /**
   * POST /api/posts/:postId/like
   * Like a post
   */
  static likePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.payload?.id;
      const postId = req.params.postId;

      if (!userId) {
        return sendUnauthorized(res, 'Unauthorized: Invalid token');
      }

      const post = await Post.findById(postId);
      if (!post) {
        return sendNotFound(res, 'Post not found');
      }

      const existingLike = await Like.findOne({ user: userId, post: postId });
      if (existingLike) {
        return sendError(res, 'Post already liked', 409);
      }

      const like = new Like({ user: userId, post: postId });
      await like.save();

      post.likesCount = (post.likesCount || 0) + 1;
      await post.save();

      const postAuthorId = post.author.toString();
      await createNotification(postAuthorId, 'like', userId, postId);

      return sendSuccess(res, null, 'Post liked successfully');
    } catch (error: any) {
      if (error.code === 11000) {
        return sendError(res, 'Post already liked', 409);
      }
      return next(error);
    }
  };

  /**
   * DELETE /api/posts/:postId/unlike
   * Unlike a post
   */
  static unlikePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.payload?.id;
      const postId = req.params.postId;

      if (!userId) {
        return sendUnauthorized(res, 'Unauthorized: Invalid token');
      }

      const post = await Post.findById(postId);
      if (!post) {
        return sendNotFound(res, 'Post not found');
      }

      const like = await Like.findOneAndDelete({ user: userId, post: postId });
      if (!like) {
        return sendNotFound(res, 'Post not liked');
      }

      post.likesCount = Math.max((post.likesCount || 0) - 1, 0);
      await post.save();

      return sendSuccess(res, null, 'Post unliked successfully');
    } catch (error) {
      return next(error);
    }
  };

  /**
   * GET /api/posts/:postId/comments
   * Get comments for a post
   */
  static getComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = req.params.postId;
      const limit = typeof req.query.limit !== 'undefined' 
        ? parseInt(req.query.limit as string) 
        : 20;
      const offset = typeof req.query.offset !== 'undefined' 
        ? parseInt(req.query.offset as string) 
        : 0;

      const post = await Post.findById(postId);
      if (!post) {
        return sendNotFound(res, 'Post not found');
      }

      const user = req.payload ? await User.findById(req.payload.id) : null;

      const paginationResult = await paginate(
        Comment,
        { post: postId },
        limit,
        offset,
        { createdAt: 'desc' },
        'user'
      );

      const formattedComments = paginationResult.data.map((comment: any) => {
        return comment.toJSONFor(user);
      });

      return sendSuccess(res, {
        comments: formattedComments,
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
   * POST /api/posts/:postId/comments
   * Create a comment on a post
   */
  static createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.payload?.id;
      const postId = req.params.postId;

      if (!userId) {
        return sendUnauthorized(res, 'Unauthorized: Invalid token');
      }

      const user = await User.findById(userId);
      if (!user) {
        return sendUnauthorized(res, 'User not found');
      }

      const post = await Post.findById(postId);
      if (!post) {
        return sendNotFound(res, 'Post not found');
      }

      const content = req.body.comment?.content || req.body.comment?.body || req.body.content;
      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        return sendError(res, 'Comment content is required', 422);
      }

      const comment = new Comment({
        post: postId,
        user: userId,
        content: content.trim()
      });

      await comment.save();
      post.comments.push(comment);
      await post.save();

      const postAuthorId = post.author.toString();
      await createNotification(postAuthorId, 'comment', userId, postId);

      const populatedComment = await Comment.findById(comment._id).populate('user');
      return sendSuccess(res, { comment: populatedComment.toJSONFor(user) }, 'Comment created successfully', 201);
    } catch (error) {
      return next(error);
    }
  };
}

