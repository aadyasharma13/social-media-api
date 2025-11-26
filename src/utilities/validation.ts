import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { sendValidationError } from './response';

/**
 * Validation Utility
 * Provides validation middleware for request validation
 */

/**
 * Middleware to check validation results
 * Must be called after validation chains
 */
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMap: any = {};
    errors.array().forEach((error: any) => {
      errorMap[error.param || error.msg] = error.msg;
    });
    return sendValidationError(res, errorMap);
  }
  next();
};

/**
 * Validation rules for user registration
 */
export const validateUserRegistration = [
  (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.body;
    if (!user) {
      return sendValidationError(res, { user: 'User object is required' });
    }
    if (!user.username || typeof user.username !== 'string' || user.username.trim().length === 0) {
      return sendValidationError(res, { username: "Username can't be blank" });
    }
    if (!user.email || typeof user.email !== 'string' || user.email.trim().length === 0) {
      return sendValidationError(res, { email: "Email can't be blank" });
    }
    if (!/^\S+@\S+\.\S+$/.test(user.email)) {
      return sendValidationError(res, { email: 'Email is invalid' });
    }
    if (!user.password || typeof user.password !== 'string' || user.password.length < 6) {
      return sendValidationError(res, { password: 'Password must be at least 6 characters' });
    }
    next();
  }
];

/**
 * Validation rules for user login
 */
export const validateUserLogin = [
  (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.body;
    if (!user) {
      return sendValidationError(res, { user: 'User object is required' });
    }
    if (!user.email || typeof user.email !== 'string' || user.email.trim().length === 0) {
      return sendValidationError(res, { email: "Email can't be blank" });
    }
    if (!user.password || typeof user.password !== 'string' || user.password.length === 0) {
      return sendValidationError(res, { password: "Password can't be blank" });
    }
    next();
  }
];

/**
 * Validation rules for post creation
 */
export const validatePostCreation = [
  (req: Request, res: Response, next: NextFunction) => {
    const { post } = req.body;
    if (!post) {
      return sendValidationError(res, { post: 'Post object is required' });
    }
    if (!post.content || typeof post.content !== 'string' || post.content.trim().length === 0) {
      return sendValidationError(res, { content: "Post content can't be blank" });
    }
    if (post.content && post.content.length > 5000) {
      return sendValidationError(res, { content: 'Post content must be less than 5000 characters' });
    }
    if (post.imageUrl && typeof post.imageUrl !== 'string') {
      return sendValidationError(res, { imageUrl: 'Image URL must be a string' });
    }
    next();
  }
];

/**
 * Validation rules for comment creation
 */
export const validateCommentCreation = [
  (req: Request, res: Response, next: NextFunction) => {
    const content = req.body.comment?.content || req.body.comment?.body || req.body.content;
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return sendValidationError(res, { content: "Comment content can't be blank" });
    }
    if (content && content.length > 1000) {
      return sendValidationError(res, { content: 'Comment content must be less than 1000 characters' });
    }
    next();
  }
];

/**
 * Validation rules for pagination parameters
 */
export const validatePagination = [
  (req: Request, res: Response, next: NextFunction) => {
    if (req.query.limit !== undefined) {
      const limit = parseInt(req.query.limit as string);
      if (isNaN(limit) || limit < 1) {
        return sendValidationError(res, { limit: 'Limit must be a positive number' });
      }
      if (limit > 100) {
        return sendValidationError(res, { limit: 'Limit cannot exceed 100' });
      }
    }
    if (req.query.offset !== undefined) {
      const offset = parseInt(req.query.offset as string);
      if (isNaN(offset) || offset < 0) {
        return sendValidationError(res, { offset: 'Offset must be a non-negative number' });
      }
    }
    next();
  }
];

