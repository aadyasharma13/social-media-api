import { Follow } from '../database/models/follow.model';
import { User } from '../database/models/user.model';
import { createNotification } from './notification.service';

/**
 * User Service
 * Handles user-related business logic
 */

/**
 * Follow a user
 * @param followerId - ID of the user who wants to follow
 * @param targetId - ID of the user to be followed
 * @returns Promise<boolean> - true if successful, throws error if fails
 */
export const followUser = async (followerId: string, targetId: string): Promise<boolean> => {
  // Check if users exist
  const [follower, target] = await Promise.all([
    User.findById(followerId),
    User.findById(targetId)
  ]);

  if (!follower) {
    throw new Error('Follower user not found');
  }

  if (!target) {
    throw new Error('Target user not found');
  }

  // Check if trying to follow self (additional check at service level)
  if (followerId === targetId) {
    throw new Error('Users cannot follow themselves');
  }

  // Check if already following
  const existingFollow = await Follow.findOne({
    follower: followerId,
    following: targetId
  });

  if (existingFollow) {
    throw new Error('Already following this user');
  }

  // Create follow relationship
  const follow = new Follow({
    follower: followerId,
    following: targetId
  });

  await follow.save();

  // Trigger notification for the user being followed
  // targetId receives notification, followerId is the sender
  await createNotification(targetId, 'follow', followerId, null);

  return true;
};

/**
 * Unfollow a user
 * @param followerId - ID of the user who wants to unfollow
 * @param targetId - ID of the user to be unfollowed
 * @returns Promise<boolean> - true if successful, throws error if fails
 */
export const unfollowUser = async (followerId: string, targetId: string): Promise<boolean> => {
  // Check if users exist
  const [follower, target] = await Promise.all([
    User.findById(followerId),
    User.findById(targetId)
  ]);

  if (!follower) {
    throw new Error('Follower user not found');
  }

  if (!target) {
    throw new Error('Target user not found');
  }

  // Find and delete follow relationship
  const follow = await Follow.findOneAndDelete({
    follower: followerId,
    following: targetId
  });

  if (!follow) {
    throw new Error('Not following this user');
  }

  return true;
};

