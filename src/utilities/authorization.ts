import { Request, Response, NextFunction } from 'express';
import { User } from '../database/models/user.model';

/**
 * Authorization Middleware
 * Handles role-based access control
 */

/**
 * Require admin role middleware
 * Checks if the authenticated user has admin role
 * Returns 403 if user is not an admin
 */
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.payload?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid token'
      });
    }

    // Find user and check role
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Admin access required'
      });
    }

    // User is admin, proceed
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking admin authorization',
      error: error.message
    });
  }
};

