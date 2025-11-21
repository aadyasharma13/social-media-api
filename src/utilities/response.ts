import { Response } from 'express';

/**
 * Unified Response Utility
 * Provides consistent JSON response structure across all API endpoints
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
}

/**
 * Send success response
 * @param res - Express response object
 * @param data - Response data
 * @param message - Optional success message
 * @param statusCode - HTTP status code (default: 200)
 */
export function sendSuccess<T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode: number = 200
): void {
  const response: ApiResponse<T> = {
    success: true
  };

  if (message) {
    response.message = message;
  }

  if (data !== undefined) {
    response.data = data;
  }

  res.status(statusCode).json(response);
}

/**
 * Send error response
 * @param res - Express response object
 * @param message - Error message
 * @param statusCode - HTTP status code (default: 400)
 * @param errors - Optional error details
 */
export function sendError(
  res: Response,
  message: string,
  statusCode: number = 400,
  errors?: any
): void {
  const response: ApiResponse = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  res.status(statusCode).json(response);
}

/**
 * Send validation error response
 * @param res - Express response object
 * @param errors - Validation errors object
 */
export function sendValidationError(
  res: Response,
  errors: any
): void {
  sendError(res, 'Validation error', 422, errors);
}

/**
 * Send not found response
 * @param res - Express response object
 * @param message - Optional custom message
 */
export function sendNotFound(
  res: Response,
  message: string = 'Resource not found'
): void {
  sendError(res, message, 404);
}

/**
 * Send unauthorized response
 * @param res - Express response object
 * @param message - Optional custom message
 */
export function sendUnauthorized(
  res: Response,
  message: string = 'Unauthorized: Invalid token'
): void {
  sendError(res, message, 401);
}

/**
 * Send forbidden response
 * @param res - Express response object
 * @param message - Optional custom message
 */
export function sendForbidden(
  res: Response,
  message: string = 'Forbidden: Access denied'
): void {
  sendError(res, message, 403);
}

