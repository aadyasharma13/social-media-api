import { Request, Response, Router } from 'express';
import { authentication } from '../utilities/authentication';
import { CommentController } from '../controllers/comment.controller';
import { Comment } from '../database/models/comment.model';

const router: Router = Router();

// Preload comment objects on routes with ':commentId'
router.param('commentId', async function (req: Request, res: Response, next, id) {
  try {
    const comment = await Comment.findById(id).populate('user');
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    req.comment = comment;
    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * DELETE /api/comments/:commentId
 * Delete a comment
 */
router.delete('/:commentId', authentication.required, CommentController.deleteComment);

export const CommentsRoutes: Router = router;

