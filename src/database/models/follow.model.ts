import { Document, Model, model, Schema } from 'mongoose';
import { IFollow } from '../../interfaces/follow-interface';

export default interface IFollowModel extends IFollow, Document {
}

const FollowSchema = new Schema({
  follower: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  following: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false // We manually handle createdAt
});

// Enforce unique constraint on (follower, following) combination
// This prevents duplicate follow relationships
FollowSchema.index({ follower: 1, following: 1 }, { unique: true });

// Prevent users from following themselves
FollowSchema.pre('validate', function(next) {
  if (this.follower.toString() === this.following.toString()) {
    const error = new Error('Users cannot follow themselves');
    return next(error);
  }
  next();
});

export const Follow: Model<IFollowModel> = model<IFollowModel>('Follow', FollowSchema);

