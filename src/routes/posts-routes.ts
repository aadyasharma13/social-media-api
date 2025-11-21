import { Request, Response, Router } from 'express';
import { authentication } from '../utilities/authentication';
import { PostController } from '../controllers/post.controller';
import { validatePostCreation, validateCommentCreation } from '../utilities/validation';
import { Post } from "../database/models/post.model";
import { Comment } from "../database/models/comment.model";

const router: Router = Router();

// Preload post objects on routes with ':post'
router.param('post', function (req: Request, res: Response, next, id) {
  Post.findById(id)
    .populate('author')
    .then(function (post) {
      if (!post) {
        return res.sendStatus(404);
      }

      req.post = post;

      return next();
    }).catch(next);
});

router.param('comment', function (req: Request, res: Response, next, id) {
  Comment.findById(id).then(function (comment) {
    if (!comment) {
      return res.sendStatus(404);
    }

    req.comment = comment;

    return next();
  }).catch(next);
});

/**
 * GET /api/posts
 * Get all posts with pagination
 */
router.get('/', authentication.optional, PostController.getAllPosts);

router.post('/', authentication.required, validatePostCreation, PostController.createPost);

// return a post
router.get('/:post', authentication.optional, PostController.getPost);

// update post
router.put('/:post', authentication.required, PostController.updatePost);

// delete post
router.delete('/:post', authentication.required, PostController.deletePost);

/**
 * GET /api/posts/:postId/comments
 * Get comments for a post with pagination
 */
router.get('/:postId/comments', authentication.optional, PostController.getComments);

/**
 * POST /api/posts/:postId/comments
 * Create a new comment on a post
 */
router.post('/:postId/comments', authentication.required, validateCommentCreation, PostController.createComment);


/**
 * POST /api/posts/:postId/like
 * Like a post
 */
router.post('/:postId/like', authentication.required, PostController.likePost);

/**
 * DELETE /api/posts/:postId/unlike
 * Unlike a post
 */
router.delete('/:postId/unlike', authentication.required, PostController.unlikePost);


export const PostsRoutes: Router = router;

