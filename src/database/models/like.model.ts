import { Document, Model, model, Schema } from 'mongoose';
import { ILike } from '../../interfaces/like-interface';

export default interface ILikeModel extends ILike, Document {
}

const LikeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false // We manually handle createdAt
});

// Enforce unique constraint on (user, post) combination
// This prevents duplicate likes from the same user on the same post
LikeSchema.index({ user: 1, post: 1 }, { unique: true });

export const Like: Model<ILikeModel> = model<ILikeModel>('Like', LikeSchema);

