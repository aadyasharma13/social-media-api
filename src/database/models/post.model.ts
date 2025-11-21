import { Document, Model, model, Schema } from 'mongoose';
import { IPost } from '../../interfaces/post-interface';
import IUserModel from './user.model';

export default interface IPostModel extends IPost, Document {
  toJSONFor(user: IUserModel): any;
}

const PostSchema = new Schema({
  content: {
    type: Schema.Types.String,
    required: true
  },
  imageUrl: {
    type: Schema.Types.String,
    default: null
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likesCount: {
    type: Schema.Types.Number,
    default: 0
  },
  commentsCount: {
    type: Schema.Types.Number,
    default: 0
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
}, {
  timestamps: true
});

PostSchema.methods.toJSONFor = function (user: IUserModel) {
  return {
    _id: this._id,
    content: this.content,
    imageUrl: this.imageUrl,
    likesCount: this.likesCount,
    commentsCount: this.commentsCount,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    author: this.author.toProfileJSONFor(user)
  };
};

export const Post: Model<IPostModel> = model<IPostModel>('Post', PostSchema);

