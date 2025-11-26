import { Request, Response, NextFunction } from 'express';
import { Comment } from '../database/models/comment.model';
import { Post } from '../database/models/post.model';
import { User } from '../database/models/user.model';
import { sendSuccess, sendUnauthorized, sendForbidden } from '../utilities/response';

/**
 * Comment Controller
 * Handles HTTP-level logic for comment-related endpoints
 */

export class CommentController {
  /**
   * DELETE /api/comments/:commentId
   * Delete a comment
   */
  static deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.payload?.id;
      const comment = req.comment;

      if (!userId) {
        return sendUnauthorized(res, 'Unauthorized: Invalid token');
      }

      const user = await User.findById(userId);
      if (!user) {
        return sendUnauthorized(res, 'User not found');
      }

      // Handle both populated and non-populated user field
      const commentUserId = typeof comment.user === 'object' && comment.user !== null 
        ? (comment.user as any)._id || comment.user 
        : comment.user;
      const isAuthor = commentUserId.toString() === userId.toString();
      const isAdmin = user.role === 'admin';

      if (!isAuthor && !isAdmin) {
        return sendForbidden(res, 'You can only delete your own comments');
      }

      const post = await Post.findById(comment.post);
      if (post) {
        // @ts-ignore
        post.comments = post.comments.filter(
          (commentId: any) => commentId.toString() !== comment._id.toString()
        );
        await post.save();
      }

      await Comment.findByIdAndDelete(comment._id);
      return sendSuccess(res, null, 'Comment deleted successfully');
    } catch (error) {
      return next(error);
    }
  };
}

